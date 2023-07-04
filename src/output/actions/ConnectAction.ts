import { ActionAction, ActionBase } from './ActionBase';
import {
  Equals,
  IsArray,
  IsBoolean,
  IsEnum,
  IsNumber,
  IsOptional,
  IsString,
  IsUrl,
  Max,
  Min,
  Type,
  ValidateNested,
} from '@jovotech/output';
import { Endpoint, EndpointBase } from './ConnectAction/Endpoint';
import { TransformEndpoint } from '../decorators/transformation/TransformEndpoint';
import { EventMethodEnum } from '../common/EventMethodEnum';

enum MachineDetectionType {
  continue = 'continue',
  hangup = 'hangup',
}

/**
 * You can use the connect action to connect a call to endpoints such as phone numbers or a VBC extension.
 *
 * This action is synchronous, after a connect the next action in the NCCO stack is processed. A connect action ends when the endpoint you are calling is busy or unavailable. You ring endpoints sequentially by nesting connect actions.
 */
export class ConnectAction extends ActionBase<ActionAction.Connect | 'connect'> {
  @Equals(ActionAction.Connect)
  declare action: ActionAction.Connect | 'connect';

  /**
   * Array of endpoint objects to connect to. Currently supports a maximum of one endpoint object.
   */
  @IsArray()
  @Max(1)
  @Min(1)
  @ValidateNested({
    each: true,
  })
  @TransformEndpoint()
  endpoint!: Endpoint[];

  /**
   * A number in E.164 format that identifies the caller.§§ This must be one of your Vonage virtual numbers, another value will result in the caller ID being unknown. If the caller is an app user, this option should be omitted.
   */
  @IsOptional()
  @IsString()
  from?: string;

  /**
   * Set to true to use a random phone number as from. The number will be selected from the list of the numbers assigned to the current application. The application will try to use number(s) from the same country as the destination (if available). randomFromNumber: true cannot be used together with from. The default value is false.
   */
  @IsOptional()
  @IsBoolean()
  randomFromNumber?: boolean;

  /**
   * Set to synchronous to:
   * - make the connect action synchronous
   * - enable eventUrl to return an NCCO that overrides the current NCCO when a call moves to specific states.
   */
  @IsOptional()
  @Equals('synchronous')
  eventType?: 'synchronous';

  /**
   * If the call is unanswered, set the number in seconds before Vonage stops ringing endpoint. The default value is 60.
   */
  @IsOptional()
  @IsNumber()
  timeout?: number;

  /**
   * Maximum length of the call in seconds. The default and maximum value is 7200 seconds (2 hours).
   */
  @IsOptional()
  @IsNumber()
  limit?: number;

  /**
   * Configure the behavior when Vonage detects that a destination is an answerphone. Set to either:
   * - continue - Vonage sends an HTTP request to event_url with the Call event machine
   * - hangup - end the Call
   */
  @IsOptional()
  @IsEnum(MachineDetectionType)
  machineDetection?: MachineDetectionType;

  /**
   * Set the webhook endpoint that Vonage calls asynchronously on each of the possible Call States. If eventType is set to synchronous the eventUrl can return an NCCO that overrides the current NCCO when a timeout occurs.
   */
  @IsOptional()
  @IsUrl()
  eventUrl?: (string | undefined)[];

  /**
   * The HTTP method Vonage uses to make the request to eventUrl. The default value is POST.
   */
  @IsOptional()
  @IsEnum(EventMethodEnum)
  eventMethod?: EventMethodEnum;

  /**
   * A URL value that points to a ringbackTone to be played back on repeat to the caller, so they don't hear silence. The ringbackTone will automatically stop playing when the call is fully connected. It's not recommended to use this parameter when connecting to a phone endpoint, as the carrier will supply their own ringbackTone. Example: "ringbackTone": "http://example.com/ringbackTone.wav".
   */
  @IsOptional()
  @IsUrl()
  ringbackTone?: string;
}
