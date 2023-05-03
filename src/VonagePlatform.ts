import {
  AnyObject,
  App,
  DeepPartial,
  Extensible,
  ExtensibleInitConfig,
  HandleRequest,
  Jovo,
  JovoError,
  JovoResponse,
  Platform,
  PlatformConfig,
  Server,
  StoredElementSession,
} from '@jovotech/framework';
import { VonageRequest } from './VonageRequest';
import { VonageResponse } from './VonageResponse';
import { Vonage } from './Vonage';
import { VonageUser } from './VonageUser';
import { VonageDevice } from './VonageDevice';
import { VonageOutputTemplateConversionStrategy } from './output';
import { VonageRequestBuilder } from './VonageRequestBuilder';
import _cloneDeep from 'lodash.clonedeep';
import { VonageEventMethodEnum } from './output/common/VonageEventMethodEnum';

export interface VonageConfig extends PlatformConfig {
  verifyToken: string;
  session?: StoredElementSession & { enabled?: never };

  eventUrl?: string;
  eventMethod?: VonageEventMethodEnum;

  /**
   * Configuration used for input action
   */
  inputConfig?: {
    eventUrl?: string;
    eventMethod?: VonageEventMethodEnum;
  };
  // todo: add also the others configurations for actions, like record
}

export type VonageInitConfig = ExtensibleInitConfig<VonageConfig, 'verifyToken'>;

export class VonagePlatform extends Platform<
  VonageRequest,
  VonageResponse,
  Vonage,
  VonageUser,
  VonageDevice,
  VonagePlatform,
  VonageConfig
> {
  readonly id: string = 'vonage';
  readonly requestClass = VonageRequest;
  readonly jovoClass = Vonage;
  readonly userClass = VonageUser;
  readonly deviceClass = VonageDevice;
  readonly outputTemplateConverterStrategy = new VonageOutputTemplateConversionStrategy();
  readonly requestBuilder = VonageRequestBuilder;

  constructor(config: VonageInitConfig) {
    super(config);
  }

  async initialize(parent: Extensible): Promise<void> {
    if (super.initialize) {
      await super.initialize(parent);
    }
    this.augmentAppHandle();
  }

  augmentAppHandle(): void {
    const APP_HANDLE = App.prototype.handle;
    const getVerifyTokenFromConfig = function (this: VonagePlatform) {
      return this.config.verifyToken;
    }.bind(this);

    App.prototype.handle = async function (server: Server) {
      const request = server.getRequestObject();
      const query = server.getQueryParams();

      const headers = server.getRequestHeaders();

      // todo: implement the verification!
      const verified = true;

      // const verifyMode = query['hub.mode'];
      // const verifyChallenge = query['hub.challenge'];
      // const verifyToken = query['hub.verify_token'];

      // todo: move after verific that this is a vonage request.
      if (!verified) {
        throw new JovoError({
          message: 'The verify-token in the request does not match the configured verify-token.',
          context: {
            // verifyToken,
            // configuredVerifyToken,
          },
        });
      }

      // todo: improve the verification!
      const isVonageRequest = query['platform'] === 'vonage';

      if (isVonageRequest) {
        const responses: VonageResponse[] = [];
        // Set platform origin on request entry
        const serverCopy = _cloneDeep(server);
        // eslint-disable-next-line @typescript-eslint/no-empty-function
        serverCopy.setResponse = async (response: VonageResponse) => {
          responses.push(response);
        };

        request.$type = 'vonage';
        serverCopy.getRequestObject = () => request;
        await APP_HANDLE.call(this, serverCopy);

        return server.setResponse(responses);
      }

      return APP_HANDLE.call(this, server);
    };
  }

  mount(parent: HandleRequest): Promise<void> | void {
    super.mount(parent);

    // todo: add here new input before the request stops!
    //this.middlewareCollection.use('after.request.end', (jovo) => this.fixResponse(jovo));
  }

  getDefaultConfig(): VonageConfig {
    return {
      ...this.getInitConfig(),
    };
  }

  getInitConfig(): VonageInitConfig {
    return {
      verifyToken: '<YOUR-SECURE-TOKEN>',
    };
  }

  isRequestRelated(request: AnyObject | VonageRequest): boolean {
    return request.$type === 'vonage' && request.from && request.to && request.conversation_uuid;
  }

  isResponseRelated(response: AnyObject | VonageResponse): boolean {
    console.log('is response related triggered');
    return typeof response === typeof VonageResponse;
  }

  finalizeResponse(
    response: VonageResponse[] | VonageResponse,
    jovo: Vonage,
  ): VonageResponse[] | Promise<VonageResponse> | Promise<VonageResponse[]> | VonageResponse {
    if (Array.isArray(jovo.$response)) {
      jovo.$response[0].action.action;
    }

    if (!Array.isArray(response))
      return (response as VonageResponse).action as unknown as VonageResponse;

    return response.map((r) => (r as VonageResponse).action as unknown as VonageResponse);
  }
}
