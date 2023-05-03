import { ActionAction, ActionBase } from './ActionBase';
import { Equals } from '@jovotech/output';

/**
 * todo: Missing keys from documentation!
 */
export class ConnectAction extends ActionBase<ActionAction.Connect | 'connect'> {
  @Equals(ActionAction.Connect)
  action!: ActionAction.Connect | 'connect';
}
