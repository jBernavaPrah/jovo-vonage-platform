import {
  Equals,
  IsBoolean,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  Max,
  Min,
} from '@jovotech/output';
import { ActionAction, ActionBase } from './ActionBase';
import { LanguageEnum } from '../common/LanguageEnum';

export class TalkAction extends ActionBase<ActionAction.Talk | 'talk'> {
  @Equals(ActionAction.Talk)
  declare action: ActionAction.Talk | 'talk';

  /**
   * A string of up to 1,500 characters (excluding SSML tags) containing the message to be synthesized in the Call or Conversation. A single comma in text adds a short pause to the synthesized speech. To add a longer pause a break tag needs to be used in SSML. To use SSML tags, you must enclose the text in a speak element.
   */
  @IsNotEmpty()
  text!: string;

  /**
   * Set to true so this action is terminated when the user interacts with the application either with DTMF or ASR voice input. Use this feature to enable users to choose an option without having to listen to the whole message in your Interactive Voice Response (IVR). If you set bargeIn to true the next non-talk action in the NCCO stack must be an input action. The default value is false.
   *
   * Once bargeIn is set to true it will stay true (even if bargeIn: false is set in a following action) until an input action is encountered
   */
  @IsOptional()
  @IsBoolean()
  bargeIn?: boolean;

  /**
   * The number of times text is repeated before the Call is closed. The default value is 1. Set to 0 to loop infinitely.
   */
  @IsOptional()
  @IsNumber()
  @Min(0)
  loop?: number;

  /**
   * The volume level that the speech is played. This can be any value between -1 to 1 with 0 being the default.
   */
  @IsOptional()
  @IsNumber()
  @Min(-1)
  @Max(1)
  level?: number;

  /**
   * The language (BCP-47 format) for the message you are sending. Default: en-US. Possible values are listed in the Text-To-Speech guide.
   */
  @IsOptional()
  @IsEnum(LanguageEnum)
  language?: LanguageEnum | string;

  /**
   * The vocal style (vocal range, tessitura and timbre). Default: 0. Possible values are listed in the Text-To-Speech guide.
   */
  @IsOptional()
  @IsNumber()
  style?: number;

  /**
   * Set to true to use the premium version of the specified style if available, otherwise the standard version will be used. The default value is false. You can find more information about Premium Voices in the Text-To-Speech guide.
   */
  @IsOptional()
  @IsBoolean()
  premium?: boolean;
}
