import {
  AnyObject,
  App,
  Extensible,
  ExtensibleInitConfig,
  HandleRequest,
  Headers,
  Jovo,
  JovoError,
  Platform,
  PlatformConfig,
  Server,
  ServerResponse,
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
  InputActionOutput,
  NotifyAction,
  RecordAction,
  StreamAction,
  TalkAction,
  VonageOutputTemplateConversionStrategy,
} from './output';
import _cloneDeep from 'lodash.clonedeep';
import { LanguageEnum } from './output/common/LanguageEnum';
import * as jwt from 'jsonwebtoken';
import * as sha from 'js-sha256';
import { ExpressJs } from '@jovotech/server-express';
import { resolve } from 'path';
import { homedir } from 'os';
import { promises } from 'fs';
import { upperCase } from 'lodash';

export interface VonageConfig extends PlatformConfig {
  /**
   * Locale used if not found a mapped for the current request
   */
  fallbackLanguage: LanguageEnum | string;

  /**
   * Language map, used to correctly set the language response.
   */
  languageMap: Record<string, LanguageEnum | string | undefined>;

  signedToken?: string;
  /**
   * Overwrite the endpoint used in the project.
   */
  eventUrl?: string;

  session?: StoredElementSession & { enabled?: never };

  /**
   * Configuration used for input action.
   *
   */
  inputConfig?: Pick<InputAction, 'eventMethod' | 'eventUrl'> & {
    dtmf?: Pick<NonNullable<InputAction['dtmf']>, 'timeOut' | 'submitInHash'>;
    speech?: Pick<
      NonNullable<InputAction['speech']>,
      'endInSilence' | 'maxDuration' | 'startTimeout' | 'saveAudio'
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
  talkConfig?: Pick<TalkAction, 'premium' | 'style' | 'level'>;

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

export type VonageInitConfig = ExtensibleInitConfig<VonageConfig>;

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
  }

  augmentAppHandle(): void {
    const APP_HANDLE = App.prototype.handle;

    const validateAuthentication = function (
      this: VonagePlatform,
      request: AnyObject,
      headers: Headers,
    ) {
      if (!this.config.signedToken) return true;

      // if is not set, meaning that is not configuration by cli or in testing.
      if (!this.config.eventUrl) return false;
      const token = (headers.authorization as string | undefined)?.split(' ')[1];

      if (!token) return false;
      try {
        const decoded = jwt.verify(token, this.config.signedToken, {
          algorithms: ['HS256'],
        });
        return sha.sha256(JSON.stringify(request)) == decoded;
      } catch (err) {
        throw new JovoError({
          message: 'Authentication token not valid',
        });
      }
    }.bind(this);

    App.prototype.handle = async function (server: Server) {
      const request = server.getRequestObject();
      const headers = server.getRequestHeaders();

      // in case the request come from the jovo-testing plugin, the platform is filled
      if (request.platform || !validateAuthentication(request, headers)) {
        return APP_HANDLE.call(this, server);
      }

      server.setResponseHeaders({
        'Content-Type': 'application/json',
      });

      if (request.status) {
        return server.setResponse({});
      }

      let response: ServerResponse | unknown = {};
      // Set platform origin on request entry
      const serverCopy = _cloneDeep(server);
      // eslint-disable-next-line @typescript-eslint/no-empty-function
      serverCopy.setResponse = async (r: VonageResponse) => {
        response = r;
      };

      request.$type = 'vonage';

      serverCopy.getRequestObject = () => request;
      serverCopy.setResponseHeaders({
        'Content-Type': 'application/json',
      });

      await APP_HANDLE.call(this, serverCopy);

      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore // The response is always there.
      return server.setResponse(response);
    };
  }

  mount(parent: HandleRequest): Promise<void> | void {
    super.mount(parent);

    this.middlewareCollection.use('before.request.start', async (jovo) => {
      const request = jovo.$request as VonageRequest;
      if (request.$type !== 'vonage') return;
      request.$eventUrl = await this.extractEndpointFromServer(jovo);
    });

    this.middlewareCollection.use('after.dialogue.end', async (jovo) => {
      // with no output or none of the output has listen to false
      // then instruct vonage to continue to listen
      if (
        (!jovo.$output.length || !jovo.$output.some((o) => o.listen === false)) &&
        !jovo.$output.some((o) => o.platforms?.vonage?.nativeResponse?.action === 'input')
      ) {
        jovo.$output.push(new InputActionOutput(jovo, {}).build());
      }
    });
  }

  getDefaultConfig(): VonageConfig {
    return {
      ...this.getInitConfig(),
      languageMap: {},
      fallbackLanguage: LanguageEnum['en-GB'],
    };
  }

  getInitConfig(): VonageInitConfig {
    return {};
  }

  isRequestRelated(request: AnyObject | VonageRequest): boolean {
    return request.$type === 'vonage';
  }

  isResponseRelated(response: AnyObject | VonageResponse): boolean {
    return response.$type === 'vonage';
  }

  finalizeResponse(
    response: VonageResponse[] | VonageResponse,
    jovo: Vonage,
  ): VonageResponse[] | Promise<VonageResponse> | Promise<VonageResponse[]> | VonageResponse {
    // Extract only the action from response.
    const responses: (Action | undefined)[] = Array.isArray(response)
      ? [...response.map((r) => r.action)]
      : [response.action];

    const eventUrl = this.config.eventUrl ?? (jovo.$request as VonageRequest).$eventUrl;
    const language =
      Object.keys(LanguageEnum).find(
        (k) =>
          `${jovo.$request.getLocale() ?? ''}-${upperCase(jovo.$request.getLocale() ?? '')}` === k,
      ) ??
      this.config.languageMap[jovo.$request.getLocale() ?? ''] ??
      this.config.fallbackLanguage;

    // Add default configuration to each action.
    return responses
      .filter((x): x is Action => x !== undefined)
      .map((r) =>
        this.setDefaultDataOnAction(r, language, eventUrl),
      ) as unknown as VonageResponse[];
  }

  protected async retrieveLocalWebhookId(): Promise<string | undefined> {
    const homeConfigPath = resolve(homedir(), '.jovo/config');
    try {
      const homeConfigBuffer = await promises.readFile(homeConfigPath);
      const homeConfigData = JSON.parse(homeConfigBuffer.toString());
      if (homeConfigData?.webhook?.uuid) {
        return homeConfigData.webhook.uuid;
      }
    } catch (e) {}
    return;
  }

  protected async extractEndpointFromServer(jovo: Jovo): Promise<string> {
    if (jovo.$server instanceof ExpressJs) {
      let protocol = 'https';
      try {
        protocol = jovo.$server.req?.protocol ?? 'https';
      } catch (e) {}
      return `${protocol}://${jovo.$server.req?.headers.host}${jovo.$server.req.originalUrl}`;
    }

    if (jovo.$plugins.JovoDebugger && jovo.$plugins.JovoDebugger.config.enabled) {
      const webhookId = await this.retrieveLocalWebhookId();
      return `${jovo.$plugins.JovoDebugger.config.webhookUrl}/${webhookId}`;
    }
    return '';
  }

  /**
   * Based by the configuration, set values if configuration is not found.
   *
   * @param action
   * @param language
   * @param eventUrl
   * @private
   */
  private setDefaultDataOnAction(action: Action, language: string, eventUrl: string): Action {
    Object.keys(action).forEach((key) => typeof action[key] === undefined && delete action[key]);
    switch (action.action) {
      case ActionAction.Input:
        return {
          eventUrl: [eventUrl],
          ...this.config.inputConfig,
          speech: {
            language,
            ...this.config.inputConfig?.speech,
          },
          ...action,
        };
      case ActionAction.Talk:
        return {
          ...this.config.talkConfig,
          language,
          ...action,
        };
      case ActionAction.Record:
        return {
          eventUrl: [eventUrl],
          ...this.config.recordConfig,
          ...action,
        };
      case ActionAction.Conversation:
        return {
          ...this.config.conversationConfig,
          ...action,
        };
      case ActionAction.Connect:
        return {
          eventUrl: [eventUrl],
          ...this.config.connectConfig,
          ...action,
        };
      case ActionAction.Stream:
        return {
          eventUrl: [eventUrl],
          ...this.config.streamConfig,
          ...action,
        };
      case ActionAction.Notify:
        return {
          ...this.config.notifyConfig,
          ...action,
        };
    }

    return action;
  }
}
