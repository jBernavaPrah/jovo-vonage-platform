import { Action } from '../actions';
import { VonageResponse } from '../../VonageResponse';
import { IsObject } from '@jovotech/output';

export class NormalizeVonageOutputTemplateResponse implements Partial<VonageResponse> {
  [x: string]: unknown;

  @IsObject()
  action!: Action;
}
