import { NormalizedPlatformOutputTemplate } from '@jovotech/framework';
import { Action } from '../actions';

export class NormalizedVonageOutputTemplate extends NormalizedPlatformOutputTemplate<Action> {
  declare nativeResponse?: Action;
}
