import { Type } from '@jovotech/output';
import { ActionAction, ActionBase } from '../../actions/ActionBase';
import { TalkAction } from '../../actions/TalkAction';
import { ConnectAction } from '../../actions/ConnectAction';
import { ConversationAction } from '../../actions/ConversationAction';
import { InputAction } from '../../actions/InputAction';
import { NotifyAction } from '../../actions/NotifyAction';
import { RecordAction } from '../../actions/RecordAction';
import { StreamAction } from '../../actions/StreamAction';

export function TransformAction(): PropertyDecorator {
  return Type(() => ActionBase, {
    keepDiscriminatorProperty: true,
    discriminator: {
      property: 'action',
      subTypes: [
        { value: ConnectAction, name: ActionAction.Connect },
        { value: ConversationAction, name: ActionAction.Conversation },
        { value: InputAction, name: ActionAction.Input },
        { value: NotifyAction, name: ActionAction.Notify },
        { value: RecordAction, name: ActionAction.Record },
        { value: StreamAction, name: ActionAction.Stream },
        { value: TalkAction, name: ActionAction.Talk },
      ],
    },
  }) as PropertyDecorator;
}
