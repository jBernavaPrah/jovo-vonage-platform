import {} from '../../VonageResponse';

import { NormalizedPlatformOutputTemplate } from '@jovotech/framework';
import { NormalizeVonageOutputTemplateResponse } from './NormalizeVonageOutputTemplateResponse';
import { Type } from '@jovotech/output';

export class NormalizedVonageOutputTemplate extends NormalizedPlatformOutputTemplate<NormalizeVonageOutputTemplateResponse> {
  @Type(() => NormalizeVonageOutputTemplateResponse)
  nativeResponse?: NormalizeVonageOutputTemplateResponse;
}
