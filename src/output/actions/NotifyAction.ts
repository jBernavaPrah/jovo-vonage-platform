import { Equals, IsEnum, IsOptional, IsString, IsUrl } from '@jovotech/output';
import { ActionAction, ActionBase } from './ActionBase';
import { EventMethodEnum } from '../common/EventMethodEnum';

export class NotifyAction extends ActionBase<ActionAction.Notify | 'notify'> {
  @Equals(ActionAction.Notify)
  action!: ActionAction.Notify | 'notify';

  payload!: Map<string, never>;

  @IsUrl()
  eventUrl!: string;

  @IsOptional()
  @IsEnum(EventMethodEnum)
  eventMethod?: EventMethodEnum;
}
