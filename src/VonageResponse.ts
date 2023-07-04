import { JovoResponse } from '@jovotech/framework';
import {  IsObject, ValidateNested } from '@jovotech/output';

import { Action } from './output';
import { TransformAction } from './output/decorators/transformation/TransformAction';

export class VonageResponse extends JovoResponse {
  readonly $type = 'vonage';
  @IsObject()
  @ValidateNested()
  @TransformAction()
  action?: Action;

  hasSessionEnded(): boolean {
    return false;
  }
}
