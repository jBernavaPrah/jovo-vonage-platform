import {MessageValue} from '@jovotech/framework';
import {TalkAction} from './actions';
import {InputAction, InputType} from './actions';
import {ActionAction} from './actions';

export function convertMessageToVonageTalk(message: MessageValue): TalkAction {
    return {
        action: ActionAction.Talk,
        text: typeof message === 'string' ? message : message.text || (message.speech as string),
    };
}

export function createInputAction(
    type: InputType[],
    config: Partial<InputAction> = {},
): InputAction {
    return {
        action: ActionAction.Input,
        type,
        ...config,
    };
}
