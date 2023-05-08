import { InputType, TestSuite } from '@jovotech/framework';
import { app } from './_app/app';
import { VonagePlatform } from '../src';

describe('Testing Responses', () => {
  const testSuite = new TestSuite({ app, platform: VonagePlatform, locale: 'it' });
  test('Welcome response', async () => {
    const { output, response } = await testSuite.run({
      from: '123123',
      to: '123123123',
      uuid: 'asdfasfdsf',
      conversation_uuid: 'asdfasf',
      timestamp: 'asdfasdf',
    });

    expect(response).toMatchObject([
      {
        action: 'talk',
        text: 'Hello! How can I help you?',
      },
      {
        action: 'input',
        type: ['speech'],
      },
    ]);
  });

  test('Not understanding response', async () => {
    const { output, response } = await testSuite.run({
      from: '123123',
      to: '123123123',
      uuid: 'asdfasfdsf',
      speech: {
        results: [
          {
            text: ' asdfsdf asdfs asdfsdf',
            confidence: 100,
          },
        ],
      },
      conversation_uuid: 'asdfasf',
      timestamp: 'asdfasdf',
    });

    expect(response).toMatchObject([
      {
        action: 'talk',
        text: `I didn't understand, can you repeat?`,
      },
      {
        action: 'input',
        type: ['speech'],
      },
    ]);
  });

  test('Answer response', async () => {
    const { output, response } = await testSuite.run({
      from: '123123',
      to: '123123123',
      uuid: 'asdfasfdsf',
      speech: {
        results: [
          {
            text: 'I would like an appointment',
            confidence: 100,
          },
        ],
      },
      conversation_uuid: 'asdfasf',
      timestamp: 'asdfasdf',
    });

    expect(response).toMatchObject([
      {
        action: 'talk',
        text: 'OK from reservation!',
      },
      {
        action: 'input',
        type: ['speech'],
      },
    ]);
  });
});
