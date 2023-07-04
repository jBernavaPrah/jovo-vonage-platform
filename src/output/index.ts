import { NormalizedVonageOutputTemplate } from './models';
import { registerOutputPlatform } from '@jovotech/output';

declare module '@jovotech/output/dist/types/models/NormalizedOutputTemplatePlatforms' {
  interface NormalizedOutputTemplatePlatforms {
    vonage?: NormalizedVonageOutputTemplate;
  }
}
// Additionally, make class-validator and class-transformer aware of the added property.
registerOutputPlatform('vonage', NormalizedVonageOutputTemplate);

export * from './models';
export * from './actions';

export * from './templates/InputActionOutput';

export * from './VonageOutputTemplateConversionStrategy';
export { convertMessageToVonageTalk, createInputAction } from './utilities';
