import { v4 } from 'uuid';

export const createVonageRequest = (request: Record<string, unknown> = {}) => ({
  from: '393920247157',
  to: '39042111111',
  uuid: v4(),
  conversation_uuid: v4(),
  timestamp: new Date().toDateString(),
  ...request,
});

export const createVonageHeaders = (headers: Record<string, unknown> = {}) => ({
  ['user-agent']: 'Vonage',
  host: 'test.com',
  ...headers,
});

export const responseWithInput = (...args: Record<string, any>[]) => {
  return [
    ...args,
    {
      action: 'input',
      eventUrl: ['http://test.com'],
      speech: {
        language: 'en-GB',
      },
      type: ['speech'],
    },
  ];
};
