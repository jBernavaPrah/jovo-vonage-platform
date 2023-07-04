import { IsEnum } from '@jovotech/output';
import { EnumLike } from '@jovotech/framework';
import { ConversationAction } from './ConversationAction';
import { ConnectAction } from './ConnectAction';
import { InputAction } from './InputAction';
import { NotifyAction } from './NotifyAction';
import { RecordAction } from './RecordAction';
import { StreamAction } from './StreamAction';
import { TalkAction } from './TalkAction';

export enum ActionAction {
  Record = 'record',
  Conversation = 'conversation',
  Connect = 'connect',
  Talk = 'talk',
  Stream = 'stream',
  Input = 'input',
  Notify = 'notify',
}

export type ActionActionLike = EnumLike<ActionAction>;

export class ActionBase<TYPE extends ActionActionLike = ActionActionLike> {
  [key: string]: unknown;

  @IsEnum(ActionAction)
  declare action: TYPE;
}

export type Action =
  | ConversationAction
  | ConnectAction
  | InputAction
  | NotifyAction
  | RecordAction
  | StreamAction
  | TalkAction;
