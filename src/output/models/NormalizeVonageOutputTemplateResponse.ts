import { Action } from '../actions/ActionBase';
import { VonageResponse } from '../../VonageResponse';
import { IsArray, IsObject, ValidateNested } from '@jovotech/output';
import { TransformAction } from '../decorators/transformation/TransformAction';

export class NormalizeVonageOutputTemplateResponse implements Partial<VonageResponse> {
  [x: string]: unknown;

  @IsObject()
  @ValidateNested()
  @TransformAction()
  action!: Action;
}
