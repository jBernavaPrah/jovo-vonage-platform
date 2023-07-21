import { Action, VonagePlatform, VonageRequest } from '../src/';

import { TestServer } from './TestServer';
import app from './App';
import { createVonageHeaders, createVonageRequest, inputResponse } from './utils';

/*
|--------------------------------------------------------------------------
| UNIT TESTING
|--------------------------------------------------------------------------
|
| Run `npm test` to execute this sample test.
| Learn more here: www.jovo.tech/docs/unit-testing
|
*/
const server = new TestServer<Partial<VonageRequest>, Action[]>();

describe('Vonage Basically tests', () => {
  beforeEach(() => {
    server.setNativeRequestHeaders(createVonageHeaders());
  });

  test('Ensure correctly loaded locale IT', async () => {
    await app.initialize();
    server.setRequest(
      createVonageRequest({
        from: '393920247157',
      }),
    );

    await app.handle(server);

    //console.log(server.$response);
    expect(server.$response).toEqual([
      {
        action: 'talk',
        language: 'it-IT',
        text: 'welcome',
      },
      inputResponse(),
    ]);
  });
  test('Ensure correctly loaded locale CH', async () => {
    await app.initialize();
    server.setRequest(
      createVonageRequest({
        from: '+41446681800',
      }),
    );

    await app.handle(server);

    //console.log(server.$response);
    expect(server.$response).toEqual([
      {
        action: 'talk',
        language: 'de-DE',
        text: 'welcome',
      },
      inputResponse({
        speech: {
          language: 'de-DE',
        },
      }),
    ]);
  });

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

    const response = inputResponse() as any;
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
    expect(server.$response).toEqual([inputResponse()]);
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

    expect(server.$response).toEqual([
      {
        action: 'talk',
        language: 'it-IT',
        text: 'silence',
      },
      inputResponse(),
    ]);
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

    expect(server.$response).toEqual([
      {
        action: 'talk',
        language: 'it-IT',
        bargeIn: true,
        text: 'barge',
      },
      inputResponse(),
    ]);
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
    expect(server.$response).toEqual([
      {
        action: 'talk',
        language: 'it-IT',
        text: 'welcome',
      },
      inputResponse(),
    ]);
  });

  test('Customized response is handled correctly', async () => {
    await app.initialize();
    server.setRequest(
      createVonageRequest({
        speech: {
          results: [
            {
              text: 'custom',
              confidence: 1,
            },
          ],
        },
      }),
    );

    await app.handle(server);

    //console.log(server.$response);
    expect(server.$response).toEqual([
      inputResponse({
        speech: {
          endInSilence: 0.4,
          language: 'it-IT',
          saveAudio: false,
          maxDuration: 1,
          startTimeout: 1,
        },
      }),
    ]);
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
        language: 'it-IT',
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
