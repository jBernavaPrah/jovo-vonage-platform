import {
  AnyObject,
  App,
  Extensible,
  ExtensibleInitConfig,
  HandleRequest,
  JovoError,
  Platform,
  PlatformConfig,
  Server,
  StoredElementSession,
} from '@jovotech/framework';
import { Vonage } from './Vonage';
import { VonageDevice } from './VonageDevice';
import { VonageRequest } from './VonageRequest';
import { VonageRequestBuilder } from './VonageRequestBuilder';
import { VonageResponse } from './VonageResponse';
import { VonageUser } from './VonageUser';
import {
  Action,
  ActionAction,
  ConnectAction,
  ConversationAction,
  InputAction,
  NotifyAction,
  RecordAction,
  StreamAction,
  TalkAction,
  VonageOutputTemplateConversionStrategy,
} from './output';
import _cloneDeep from 'lodash.clonedeep';
import { createSpeechInputAction } from './output/utilities';

export interface VonageConfig extends PlatformConfig {
  verifyToken: string;
  session?: StoredElementSession & { enabled?: never };

  /**
   * Configuration used for input action.
   *
   */
  inputConfig?: Pick<InputAction, 'eventMethod' | 'eventUrl'> & {
    dtmf?: Pick<NonNullable<InputAction['dtmf']>, 'timeOut' | 'submitInHash'>;
    speech?: Pick<
      NonNullable<InputAction['speech']>,
      'language' | 'endInSilence' | 'maxDuration' | 'startTimeout' | 'saveAudio'
    >;
  };

  /**
   * Configuration used for input action
   */
  recordConfig?: Pick<
    RecordAction,
    | 'eventMethod'
    | 'eventUrl'
    | 'beepStart'
    | 'endOfKey'
    | 'timeOut'
    | 'split'
    | 'format'
    | 'endOnSilence'
  >;

  /**
   * Configuration used for the Talk Action.
   * If the language is not set, will be used the call language
   */
  talkConfig?: Pick<TalkAction, 'language' | 'premium' | 'style' | 'level'>;

  connectConfig?: Pick<
    ConnectAction,
    | 'limit'
    | 'machineDetection'
    | 'ringbackTone'
    | 'eventUrl'
    | 'eventMethod'
    | 'eventType'
    | 'from'
    | 'randomFromNumber'
  >;

  conversationConfig?: Pick<ConversationAction, 'musicOnHoldUrl' | 'endOnExit' | 'record'>;

  notifyConfig?: Pick<NotifyAction, 'eventMethod'>;

  streamConfig?: Pick<StreamAction, 'level'>;
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
  readonly id: string = 'vonage' as const;
  readonly outputTemplateConverterStrategy: VonageOutputTemplateConversionStrategy =
    new VonageOutputTemplateConversionStrategy();
  readonly requestClass = VonageRequest;
  readonly jovoClass = Vonage;
  readonly userClass = VonageUser;
  readonly deviceClass = VonageDevice;
  readonly requestBuilder = VonageRequestBuilder;

  async initialize(parent: Extensible): Promise<void> {
    if (super.initialize) {
      await super.initialize(parent);
    }
    this.augmentAppHandle();
  }

  constructor(config: VonageInitConfig) {
    super(config);
    //Object.setPrototypeOf(this, Platform.prototype);
  }

  augmentAppHandle(): void {
    const APP_HANDLE = App.prototype.handle;
    const getVerifyTokenFromConfig = function (this: VonagePlatform) {
      return this.config.verifyToken;
    }.bind(this);

    App.prototype.handle = async function (server: Server) {
      //console.log('ABCd');

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
    //console.log('ABCmount');

    //this.middlewareCollection.use('before')

    // todo: add here new input before the request stops!
    //this.middlewareCollection.use('after.request.end', (jovo) => this.fixResponse(jovo));
  }

  getDefaultConfig(): VonageConfig {
    // todo: change the language of the input based on the incoming call

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
    const responses: Action[] = Array.isArray(response)
      ? [...response.map((r) => this.setDefaultDataOnAction(r.action))]
      : [this.setDefaultDataOnAction(response.action)];

    if (
      !responses?.some((a) => a.action === ActionAction.Input) &&
      !jovo.$output.some((o) => o.listen === false)
    ) {
      responses.push(this.setDefaultDataOnAction(createSpeechInputAction()));
    }

    //
    return responses as unknown as VonageResponse[];
  }

  /**
   * Based by the configuration, set values if configuration is not found.
   *
   * @param action
   * @private
   */
  private setDefaultDataOnAction(action: Action): Action {
    switch (action.action) {
      case ActionAction.Input:
        return {
          ...action,
          ...this.config.inputConfig,
        };
      case ActionAction.Talk:
        return {
          ...action,
          ...this.config.talkConfig,
        };
      case ActionAction.Record:
        return {
          ...action,
          ...this.config.recordConfig,
        };
      case ActionAction.Conversation:
        return {
          ...action,
          ...this.config.conversationConfig,
        };
      case ActionAction.Connect:
        return {
          ...action,
          ...this.config.connectConfig,
        };

      case ActionAction.Stream:
        return {
          ...action,
          ...this.config.streamConfig,
        };

      case ActionAction.Notify:
        return {
          ...action,
          ...this.config.notifyConfig,
        };
    }

    return action;
  }
}
