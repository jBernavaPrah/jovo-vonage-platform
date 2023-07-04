import { MessageValue } from '@jovotech/framework';
import { ActionAction, InputAction, InputType, TalkAction } from './actions';
import { plainToInstance } from 'class-transformer';

export function convertMessageToVonageTalk(
  message: MessageValue,
  config: Omit<TalkAction, 'action' | 'text'> = {},
): TalkAction {
  return createTalkAction(
    typeof message === 'string' ? message : message.text || (message.speech as string),
    config,
  );
}

export function createTalkAction(
  text: string,
  config: Omit<TalkAction, 'action' | 'text'> = {},
): TalkAction {
  return plainToInstance(TalkAction, {
    action: ActionAction.Talk,
    text,
    ...config,
  });
}

export function createSpeechInputAction(
  config: Omit<InputAction, 'action' | 'type' | 'dtmf'> = {},
): InputAction {
  return createInputAction([InputType.speech], config);
}

export function createDTMFInputAction(
  config: Omit<InputAction, 'action' | 'type' | 'speech'> = {},
): InputAction {
  return createInputAction([InputType.dtmf], config);
}

export function createInputAction(
  type: InputType[],
  config: Partial<InputAction> = {},
): InputAction {
  return plainToInstance(InputAction, {
    action: ActionAction.Input,
    type,
    ...config,
  });
}
