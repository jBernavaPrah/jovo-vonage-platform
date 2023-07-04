import { RequestBuilder, UnknownObject } from '@jovotech/framework';
import { join as joinPaths } from 'path';

import { VonagePlatform } from './VonagePlatform';
import { VonageRequest } from './VonageRequest';

export class VonageRequestBuilder extends RequestBuilder<VonagePlatform> {
  launch(json?: UnknownObject): VonageRequest {
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const launchJson = require(joinPaths(__dirname, 'sample-requests', 'LaunchRequest.json'));
    const request: VonageRequest = Object.create(VonageRequest.prototype);
    return Object.assign(request, json || launchJson);
  }

  intent(name?: string): VonageRequest;
  intent(json?: UnknownObject): VonageRequest;
  intent(nameOrJson?: string | UnknownObject): VonageRequest {
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const intentJson = require(joinPaths(__dirname, 'sample-requests', 'IntentRequest.json'));

    const request: VonageRequest = Object.create(VonageRequest.prototype);

    if (typeof nameOrJson === 'string') {
      Object.assign(request, intentJson);
      request.setIntent(nameOrJson);
    } else {
      Object.assign(request, nameOrJson || intentJson);
    }

    return request;
  }
}
