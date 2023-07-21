import { v4 } from 'uuid';
import _ from 'lodash';

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

export const inputResponse = (args: Record<string, any> = {}) => {
  return _.merge(
    {
      action: 'input',
      eventUrl: ['http://test.com'],
      speech: {
        language: 'it-IT',
      },
      type: ['speech'],
    },
    args,
  );
};
