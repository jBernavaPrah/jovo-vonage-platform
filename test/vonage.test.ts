import { Action, VonagePlatform, VonageRequest } from '../src/';

import { TestServer } from './TestServer';
import app from './App';
import { createVonageHeaders, createVonageRequest, responseWithInput } from './utils';

/*
|--------------------------------------------------------------------------
| UNIT TESTING
|--------------------------------------------------------------------------
|
| Run `npm test` to execute this sample test.
| Learn more here: www.jovo.tech/docs/unit-testing
|
*/
describe('Vonage Basically tests', () => {
  const server = new TestServer<Partial<VonageRequest>, Action[]>();
  server.setNativeRequestHeaders(createVonageHeaders());

  test('Ensure App Input Config are correctly managed', async () => {
    const platform: VonagePlatform = app.platforms.find(
      (p) => p instanceof VonagePlatform,
    ) as VonagePlatform;

    platform.config.inputConfig = {
      speech: {
        endInSilence: 0.7,
      },
    };

    await app.initialize();
    server.setRequest(
      createVonageRequest({
        speech: {
          results: [
            {
              text: 'empty',
              confidence: 1,
            },
          ],
        },
      }),
    );

    await app.handle(server);

    const response = responseWithInput()[0];
    response.speech.endInSilence = 0.7;

    expect(server.$response).toEqual([response]);

    platform.config.inputConfig = undefined;
  });

  test('Can handle an empty output, creating correctly the input action ', async () => {
    await app.initialize();
    server.setRequest(
      createVonageRequest({
        speech: {
          results: [
            {
              text: 'empty',
              confidence: 1,
            },
          ],
        },
      }),
    );

    await app.handle(server);

    //console.log(server.$response);
    expect(server.$response).toEqual(responseWithInput());
  });

  test('If timeout reached, use as intent of silence', async () => {
    await app.initialize();
    server.setRequest(
      createVonageRequest({
        speech: {
          timeout_reason: 'max_duration',
        },
      }),
    );

    await app.handle(server);

    expect(server.$response).toEqual(
      responseWithInput({
        action: 'talk',
        language: 'en-GB',
        text: 'silence',
      }),
    );
  });

  test('Barge is added correctly if output template is used', async () => {
    await app.initialize();
    server.setRequest(
      createVonageRequest({
        speech: {
          results: [
            {
              text: 'barge',
              confidence: 1,
            },
          ],
        },
      }),
    );

    await app.handle(server);

    expect(server.$response).toEqual(
      responseWithInput({
        action: 'talk',
        language: 'en-GB',
        bargeIn: true,
        text: 'barge',
      }),
    );
  });

  test('Ensure requests with status filled are ignored', async () => {
    await app.initialize();
    server.setRequest(
      createVonageRequest({
        status: 'something',
      }),
    );

    await app.handle(server);

    //console.log(server.$response);
    expect(server.$response).toEqual({});
  });

  test('The welcome is triggered if no speech/dtmf is detected', async () => {
    await app.initialize();
    server.setRequest(createVonageRequest({}));

    await app.handle(server);

    //console.log(server.$response);
    expect(server.$response).toEqual(
      responseWithInput({
        action: 'talk',
        language: 'en-GB',
        text: 'welcome',
      }),
    );
  });

  test('Response with correct Language ', async () => {
    await app.initialize();
    server.setRequest({
      locale: 'it',
      ...createVonageRequest({
        speech: {
          results: [
            {
              text: 'bot',
              confidence: 1,
            },
          ],
        },
      }),
    });

    await app.handle(server);

    const response = responseWithInput({
      action: 'talk',
      language: 'it-IT',
      text: 'bot',
    });

    response[response.length - 1].speech.language = 'it-IT';

    //console.log(server.$response);
    expect(server.$response).toEqual(response);
  });

  test('The response has not input action if there is a output with listen false', async () => {
    await app.initialize();
    server.setRequest(
      createVonageRequest({
        speech: {
          results: [
            {
              text: 'goodbye',
              confidence: 1,
            },
          ],
        },
      }),
    );

    await app.handle(server);

    //console.log(server.$response);
    expect(server.$response).toEqual([
      {
        action: 'talk',
        language: 'en-GB',
        text: 'goodbye',
      },
    ]);
  });

  test('validate request', async () => {
    const platform = app.platforms.find((p) => p.id === 'vonage') as VonagePlatform;
    platform.config.signedToken = '123123123';
    await app.initialize();
    server.setRequest(createVonageRequest({}));
    server.setNativeRequestHeaders(
      createVonageHeaders({
        authorization: 'bearer something',
      }),
    );

    const t = async () => await app.handle(server);
    await expect(t()).rejects.toThrow();
  });
});
