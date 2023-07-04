import { EndpointBase, EndpointType } from './Endpoint';
import { Equals, IsObject, IsOptional, IsUrl } from '@jovotech/output';

export class SipEndpoint extends EndpointBase<EndpointType.Sip | 'sip'> {
  @Equals(EndpointType.Sip)
  declare type: EndpointType.Sip | 'sip';

  /**
   * The SIP URI to the endpoint you are connecting to in the format sip:rebekka@sip.example.com. To use TLS and/or SRTP, include respectively transport=tls or media=srtp to the URL with the semicolon ; as a delimiter, for example: sip:rebekka@sip.example.com;transport=tls;media=srtp.
   */
  @IsUrl()
  uri!: string;

  /**
   * key => value string pairs containing any metadata you need e.g. { "location": "New York City", "occupation": "developer" }. The headers are transmitted as part of the SIP INVITE as X-key: value headers. So in the example, these headers are sent: X-location: New York City and X-occupation: developer.
   */
  @IsOptional()
  @IsObject()
  headers?: Record<string, never>;
}
