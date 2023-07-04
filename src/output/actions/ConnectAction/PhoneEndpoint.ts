import { Equals, IsOptional, IsString, IsUrl, Type, ValidateNested } from '@jovotech/output';
import { EndpointBase, EndpointType } from './Endpoint';

class PhoneEndpointOnAnswer {
  /**
   * The URL serves an NCCO to execute in the number being connected to, before that call is joined to your existing conversation.
   */
  @IsUrl()
  url!: string;

  /**
   * Optionally, the ringbackTone key can be specified with a URL value that points to a ringbackTone to be played back on repeat to the caller, so they do not hear just silence. The ringbackTone will automatically stop playing when the call is fully connected.
   */
  @IsOptional()
  @IsUrl()
  ringbackTone?: string;
}

/**
 * Phone (PSTN) - phone numbers in E.164 format
 */
export class PhoneEndpoint extends EndpointBase<EndpointType.Phone | 'phone'> {
  @Equals(EndpointType.Phone)
  declare type: EndpointType.Phone | 'phone';

  /**
   * The phone number to connect to in E.164 format.
   */
  @IsString()
  number!: string;

  /**
   * Set the digits that are sent to the user as soon as the Call is answered. The * and # digits are respected. You create pauses using p. Each pause is 500ms.
   */
  @IsOptional()
  @IsString()
  dtmfAnswer?: string;

  /**
   * A JSON object containing a required url key. The URL serves an NCCO to execute in the number being connected to, before that call is joined to your existing conversation. Optionally, the ringbackTone key can be specified with a URL value that points to a ringbackTone to be played back on repeat to the caller, so they do not hear just silence. The ringbackTone will automatically stop playing when the call is fully connected. Example: {"url":"https://example.com/answer", "ringbackTone":"http://example.com/ringbackTone.wav" }. Please note, the key ringback is still supported.
   */
  @IsOptional()
  @ValidateNested()
  @Type(() => PhoneEndpointOnAnswer)
  onAnswer?: PhoneEndpointOnAnswer;
}
