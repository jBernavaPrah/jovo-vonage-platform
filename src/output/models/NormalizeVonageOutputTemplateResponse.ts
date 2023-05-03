import { Action } from '../actions/ActionBase';
import { VonageResponse } from '../../VonageResponse';
import { IsObject, ValidateNested } from '@jovotech/output';
import { TransformAction } from '../decorators/transformation/TransformAction';

export class NormalizeVonageOutputTemplateResponse implements Partial<VonageResponse> {
  [key: string]: unknown;

  @IsObject()
  @ValidateNested()
  @TransformAction()
  action!: Action;
}
