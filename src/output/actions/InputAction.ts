import {
  ArrayNotEmpty,
  ArrayUnique,
  IsBoolean,
  IsEnum,
  IsNumber,
  IsString,
  IsUrl,
  Max,
  Min,
  Type,
  IsOptional,
  ValidateNested,
  Equals,
  IsArray,
} from '@jovotech/output';
import { ActionAction, ActionBase } from './ActionBase';
import { EventMethodEnum } from '../common/EventMethodEnum';
import { LanguageEnum } from '../common/LanguageEnum';

export enum InputType {
  dtmf = 'dtmf',
  speech = 'speech',
}

class Speech {
  /**
   * The unique ID of the Call leg for the user to capture the speech of, defined as an array with a single element. The first joined leg of the call by default.
   */
  @IsString({
    each: true,
  })
  uuid?: string[];

  /**
   * Controls how long the system will wait after user stops speaking to decide the input is completed. The default value is 2.0 (seconds). The range of possible values is between 0.4 seconds and 10.0 seconds.
   */
  @IsNumber()
  @Min(0)
  @Max(10)
  endInSilence?: number = 2;

  /**
   * Expected language of the user's speech. Format: BCP-47. Default: en-US.
   */
  @IsEnum(LanguageEnum)
  language?: LanguageEnum | string = LanguageEnum['en-US'];

  /**
   * Array of hints (strings) to improve recognition quality if certain words are expected from the user.
   */
  @IsString({ each: true })
  context?: string[];

  /**
   * Controls how long the system will wait for the user to start speaking. The range of possible values is between 1 second and 60 seconds. The default value is 10.
   */
  @IsNumber()
  @Min(0)
  @Max(60)
  startTimeout?: number = 10;

  /**
   * Controls maximum speech duration (from the moment user starts speaking). The default value is 60 (seconds). The range of possible values is between 1 and 60 seconds.
   */
  @IsNumber()
  @Min(0)
  @Max(60)
  maxDuration?: number = 60;

  /**
   * Set to true so the speech input recording (recording_url) is sent to your webhook endpoint at eventUrl. The default value is false.
   */
  @IsBoolean()
  saveAudio?: boolean = false;
}

class DTMF {
  /**
   * The result of the callee's activity is sent to the eventUrl webhook endpoint timeOut seconds after the last action. The default value is 3. Max is 10.
   */
  @IsOptional()
  @Min(0)
  @Max(10)
  timeOut?: number;

  /**
   * The number of digits the user can press. The maximum value is 20, the default is 4 digits.
   */
  @IsOptional()
  @Max(20)
  maxDigits?: number;

  /**
   * Set to true so the callee's activity is sent to your webhook endpoint at eventUrl after they press #. If # is not pressed the result is submitted after timeOut seconds. The default value is false. That is, the result is sent to your webhook endpoint after timeOut seconds.
   */
  @IsOptional()
  @IsBoolean()
  submitInHash?: boolean = false;
}

export class InputAction extends ActionBase<ActionAction.Input | 'input'> {
  @Equals(ActionAction.Input)
  declare action: ActionAction.Input | 'input';

  /**
   * Acceptable input type, can be set as [ "dtmf" ] for DTMF input only, [ "speech" ] for ASR only, or [ "dtmf", "speech" ] for both.
   */

  @ArrayUnique()
  @ArrayNotEmpty()
  @IsEnum(InputType, {
    each: true,
  })
  type!: InputType[];

  /**
   * DTMF settings.
   */
  @IsOptional()
  @ValidateNested()
  @Type(() => DTMF)
  dtmf?: DTMF;

  @IsOptional()
  @ValidateNested()
  @Type(() => Speech)
  speech?: Speech;

  /**
   * Vonage sends the digits pressed by the callee to this URL 1) after timeOut pause in activity or when # is pressed for DTMF or 2) after user stops speaking or 30 seconds of speech for speech input.
   */
  @IsOptional()
  @IsArray()
  @IsUrl()
  eventUrl?: (string | undefined)[];

  /**
   * he HTTP method used to send event information to event_url The default value is POST.
   */
  @IsOptional()
  @IsEnum(EventMethodEnum)
  eventMethod?: EventMethodEnum | string;
}
