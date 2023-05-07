import { VonageConfig, VonagePlatform } from './VonagePlatform';
import { Vonage } from './Vonage';
import { registerPlatformSpecificJovoReference } from '@jovotech/framework';

declare module '@jovotech/framework/dist/types/Extensible' {
  interface ExtensiblePluginConfig {
    VonagePlatform?: VonageConfig;
  }

  interface ExtensiblePlugins {
    VonagePlatform?: VonagePlatform;
  }
}

declare module '@jovotech/framework/dist/types/Jovo' {
  interface Jovo {
    $vonage?: Vonage;
  }
}
registerPlatformSpecificJovoReference('$vonage', Vonage);

export * from './Vonage';
export * from './VonagePlatform';
export * from './VonageDevice';
export * from './VonageResponse';
export * from './VonageRequest';
export * from './VonageUser';
export * from './output';
