import { Equals, IsArray, IsEnum, IsOptional, IsUrl } from '@jovotech/output';
import { ActionAction, ActionBase } from './ActionBase';
import { EventMethodEnum } from '../common/EventMethodEnum';

export class NotifyAction extends ActionBase<ActionAction.Notify | 'notify'> {
  @Equals(ActionAction.Notify)
  declare action: ActionAction.Notify | 'notify';

  payload!: Map<string, never>;

  @IsArray()
  @IsUrl()
  eventUrl!: (string | undefined)[];

  @IsOptional()
  @IsEnum(EventMethodEnum)
  eventMethod?: EventMethodEnum | string;
}
