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
} from '@jovotech/output';
import { ActionAction, ActionBase } from './ActionBase';
import { EventMethodEnum } from '../common/EventMethodEnum';

export class StreamAction extends ActionBase<ActionAction.Stream | 'stream'> {
  @Equals(ActionAction.Stream)
  declare action: ActionAction.Stream | 'stream';

  /**
   *  An array containing a single URL to an mp3 or wav (16-bit) audio file to stream to the Call or Conversation.
   */
  @IsString()
  streamUrl!: string;

  /**
   * Set the audio level of the stream in the range -1 >=level<=1 with a precision of 0.1. The default value is 0.
   */
  @IsNumber()
  @Min(-1)
  @Max(1)
  level?: number;

  /**
   * Set to true so this action is terminated when the user interacts with the application either with DTMF or ASR voice input. Use this feature to enable users to choose an option without having to listen to the whole message in your Interactive Voice Response (IVR ). If you set bargeIn to true on one more Stream actions then the next non-stream action in the NCCO stack must be an input action. The default value is false. Once bargeIn is set to true it will stay true (even if bargeIn: false is set in a following action) until an input action is encountered.
   */
  @IsBoolean()
  bargeIn?: boolean;

  /**
   * The number of times audio is repeated before the Call is closed. The default value is 1. Set to 0 to loop infinitely.
   */
  @IsNumber()
  @Min(0)
  loop?: number;

  /**
   * Set the webhook endpoint that Vonage calls asynchronously on each of the possible Call States. If eventType is set to synchronous the eventUrl can return an NCCO that overrides the current NCCO when a timeout occurs.
   */
  @IsOptional()
  @IsArray()
  @IsUrl()
  eventUrl?: (string | undefined)[];

  /**
   * The HTTP method Vonage uses to make the request to eventUrl. The default value is POST.
   */
  @IsOptional()
  @IsEnum(EventMethodEnum)
  eventMethod?: EventMethodEnum;
}
