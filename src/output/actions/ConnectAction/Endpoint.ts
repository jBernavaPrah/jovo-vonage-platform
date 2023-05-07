import { EnumLike } from '@jovotech/framework';
import { IsEnum } from '@jovotech/output';
import { PhoneEndpoint } from './PhoneEndpoint';
import { AppEndpoint } from './AppEndpoint';
import { WebSocketEndpoint } from './WebSocketEndpoint';
import { SipEndpoint } from './SipEndpoint';
import { VBCEndpoint } from './VBCEndpoint';

export enum EndpointType {
  Phone = 'phone',
  App = 'app',
  WebSocket = 'websocket',
  Sip = 'sip',
  VBC = 'vbc',
}

export type EndpointTypeLike = EnumLike<EndpointType>;

export type Endpoint = PhoneEndpoint | AppEndpoint | WebSocketEndpoint | SipEndpoint | VBCEndpoint;

export class EndpointBase<TYPE extends EndpointTypeLike = EndpointTypeLike> {
  @IsEnum(EndpointType)
  type!: TYPE;
}
