import { DenormalizePlatformOutputTemplate } from '@jovotech/framework';
import { NormalizedVonageOutputTemplate } from './NormalizedVonageOutputTemplate';

export type VonageOutputTemplate =
  DenormalizePlatformOutputTemplate<NormalizedVonageOutputTemplate>;
