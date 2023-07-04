import { EndpointBase, EndpointType } from './Endpoint';
import { Equals, Expose, IsEnum, IsObject, IsOptional, IsUrl } from '@jovotech/output';

enum ContentType {
  Audio116Rate16000 = 'audio/l16;rate=16000',
  Audio116Rate8000 = 'audio/l16;rate=8000',
}

export class WebSocketEndpoint extends EndpointBase<EndpointType.WebSocket | 'websocket'> {
  @Equals(EndpointType.WebSocket)
  declare type: EndpointType.WebSocket | 'websocket';

  /**
   * The URI to the websocket you are streaming to.
   */
  @IsUrl()
  uri!: string;

  /**
   * the internet media type for the audio you are streaming. Possible values are: audio/l16;rate=16000 or audio/l16;rate=8000.
   */
  @IsEnum(ContentType)
  @Expose({ name: 'content-type' })
  contentType!: string;

  /**
   * a JSON object containing any metadata you want. See connecting to a websocket for example headers.
   */
  @IsOptional()
  @IsObject()
  headers?: Record<string, never>;
}
