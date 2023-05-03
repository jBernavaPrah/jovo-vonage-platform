import { Equals, IsEnum, IsString } from '@jovotech/output';
import { ActionAction, ActionBase } from './ActionBase';
import { VonageEventMethodEnum } from '../common/VonageEventMethodEnum';

export class NotifyAction extends ActionBase<ActionAction.Notify | 'notify'> {
  @Equals(ActionAction.Notify)
  action!: ActionAction.Notify | 'notify';

  payload!: Map<string, never>;

  @IsString()
  eventUrl!: string;

  @IsEnum(VonageEventMethodEnum)
  eventMethod?: VonageEventMethodEnum;

  hasSessionEnded(): boolean {
    return false;
  }
}
