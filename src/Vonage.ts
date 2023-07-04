import { Jovo } from '@jovotech/framework';
import { VonageRequest } from './VonageRequest';

import { VonageUser } from './VonageUser';
import { VonageDevice } from './VonageDevice';
import { VonageResponse } from './VonageResponse';
import { VonagePlatform } from './VonagePlatform';

export class Vonage extends Jovo<
  VonageRequest,
  VonageResponse,
  Vonage,
  VonageUser,
  VonageDevice,
  VonagePlatform
> {
  get endpoint(): string {
    return '';
  }
}
