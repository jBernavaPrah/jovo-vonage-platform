import {
  Equals,
  IsArray,
  IsBoolean,
  IsEnum,
  IsOptional,
  IsString,
  IsUrl,
  Max,
  Min,
} from '@jovotech/output';
import { ActionAction, ActionBase } from './ActionBase';
import { EventMethodEnum } from '../common/EventMethodEnum';

export enum RecordFormat {
  mp3 = 'mp3',
  wav = 'wav',
  ogg = 'ogg',
}

export class RecordAction extends ActionBase<ActionAction.Record | 'record'> {
  @Equals(ActionAction.Record)
  declare action: ActionAction.Record | 'record';

  /**
   * Record the Call in a specific format. Options are:
   * mp3
   * wav
   * ogg
   * The default value is mp3, or wav when recording more than 2 channels.
   */
  @IsEnum(RecordFormat)
  format?: RecordFormat;

  /**
   * Record the sent and received audio in separate channels of a stereo recording—set to conversation to enable this.
   */
  @IsBoolean()
  split?: boolean;

  /**
   * The number of channels to record (maximum 32). If the number of participants exceeds channels any additional participants will be added to the last channel in file. split conversation must also be enabled.
   */
  @Max(32)
  channels?: number;

  /**
   * Stop recording after n seconds of silence. Once the recording is stopped the recording data is sent to event_url. The range of possible values is 3<=endOnSilence<=10.
   */
  @Min(3)
  @Max(10)
  endOnSilence?: number;

  /**
   * Stop recording when a digit is pressed on the handset. Possible values are: *, # or any single digit e.g. 9.
   */
  @IsString()
  endOfKey?: string;

  /**
   * The maximum length of a recording in seconds. One the recording is stopped the recording data is sent to event_url. The range of possible values is between 3 seconds and 7200 seconds (2 hours).
   */
  @Min(3)
  @Max(7200)
  timeOut?: number;

  /**
   * Set to true to play a beep when a recording starts.
   */
  @IsBoolean()
  beepStart?: boolean;

  /**
   * The URL to the webhook endpoint that is called asynchronously when a recording is finished. If the message recording is hosted by Vonage, this webhook contains the URL you need to download the recording and other meta data.
   */
  @IsOptional()
  @IsArray()
  @IsUrl()
  eventUrl?: (string | undefined)[];

  @IsEnum(EventMethodEnum)
  eventMethod?: EventMethodEnum | string;
}
