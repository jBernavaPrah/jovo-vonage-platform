import { JovoResponse } from '@jovotech/framework';
import { IsArray, IsObject, ValidateNested } from '@jovotech/output';

import { Action } from './output';
import { TransformAction } from './output/decorators/transformation/TransformAction';

export class VonageResponse extends JovoResponse {
  @IsObject()
  @ValidateNested()
  @TransformAction()
  action!: Action;

  hasSessionEnded(): boolean {
    return false;
  }
}

//
// export class VonageResponse extends JovoResponse {
//   @IsEnum(VonageActionEnum)
//   action!: VonageActionEnum;
//   /**
//    * A string of up to 1,500 characters (excluding SSML tags) containing the message to be synthesized in the Call or Conversation. A single comma in text adds a short pause to the synthesized speech. To add a longer pause a break tag needs to be used in SSML. To use SSML tags, you must enclose the text in a speak element.
//    */
//   @ValidateIf((o: VonageResponse) => o.action === VonageActionEnum.talk)
//   @IsNotEmpty()
//   @IsString()
//   text!: string;
//
//   /**
//    * Set to true so this action is terminated when the user interacts with the application either with DTMF or ASR voice input. Use this feature to enable users to choose an option without having to listen to the whole message in your Interactive Voice Response (IVR). If you set bargeIn to true the next non-talk action in the NCCO stack must be an input action. The default value is false.
//    *
//    * Once bargeIn is set to true it will stay true (even if bargeIn: false is set in a following action) until an input action is encountered
//    */
//   @ValidateIf((o: VonageResponse) => o.action === VonageActionEnum.talk)
//   @IsOptional()
//   @IsBoolean()
//   bargeIn?: boolean = false;
//
//   /**
//    * The number of times text is repeated before the Call is closed. The default value is 1. Set to 0 to loop infinitely.
//    */
//   @ValidateIf((o: VonageResponse) => o.action === VonageActionEnum.talk)
//   @IsOptional()
//   @IsNumber()
//   @Min(0)
//   loop?: number = 1;
//
//   /**
//    * The volume level that the speech is played. This can be any value between -1 to 1 with 0 being the default.
//    */
//   @ValidateIf((o: VonageResponse) => o.action === VonageActionEnum.talk)
//   @IsOptional()
//   @IsNumber()
//   @Min(-1)
//   @Max(1)
//   level?: number = 0;
//
//   /**
//    * The language (BCP-47 format) for the message you are sending. Default: en-US. Possible values are listed in the Text-To-Speech guide.
//    */
//   @ValidateIf((o: VonageResponse) => o.action === VonageActionEnum.talk)
//   @IsOptional()
//   @IsEnum(VonageLanguageEnum)
//   language?: string = 'en-US';
//
//   /**
//    * The vocal style (vocal range, tessitura and timbre). Default: 0. Possible values are listed in the Text-To-Speech guide.
//    */
//   @ValidateIf((o: VonageResponse) => o.action === VonageActionEnum.talk)
//   @IsOptional()
//   @IsNumber()
//   style?: number = 0;
//
//   /**
//    * Set to true to use the premium version of the specified style if available, otherwise the standard version will be used. The default value is false. You can find more information about Premium Voices in the Text-To-Speech guide.
//    */
//   @ValidateIf((o: VonageResponse) => o.action === VonageActionEnum.talk)
//   @IsOptional()
//   @IsBoolean()
//   premium?: boolean = false;
//
//   /**
//    * Acceptable input type, can be set as [ "dtmf" ] for DTMF input only, [ "speech" ] for ASR only, or [ "dtmf", "speech" ] for both.
//    */
//   @ValidateIf((o: VonageResponse) => o.action === VonageActionEnum.input)
//   @IsEnum(VonageInputType)
//   @ArrayUnique()
//   @ArrayNotEmpty()
//   type!: VonageInputType[];
//
//   /**
//    * DTMF settings.
//    */
//   @ValidateIf(
//     (o: VonageResponse) =>
//       o.action === VonageActionEnum.input && o.type.some((t) => t === VonageInputType.dtmf),
//   )
//   @Type(() => VonageInputDTMF)
//   @ValidateNested()
//   dtmf!: VonageInputDTMF;
//
//   @ValidateIf(
//     (o: VonageResponse) =>
//       o.action === VonageActionEnum.input && o.type.some((t) => t === VonageInputType.speech),
//   )
//   @Type(() => VonageInputSpeech)
//   @ValidateNested()
//   speech!: VonageInputSpeech;
//
//   /**
//    * Vonage sends the digits pressed by the callee to this URL 1) after timeOut pause in activity or when # is pressed for DTMF or 2) after user stops speaking or 30 seconds of speech for speech input.
//    */
//   @ValidateIf((o: VonageResponse) => o.action === VonageActionEnum.input)
//   @IsOptional()
//   @IsUrl()
//   eventUrl?: string;
//
//   /**
//    * he HTTP method used to send event information to event_url The default value is POST.
//    */
//   @ValidateIf((o: VonageResponse) => o.action === VonageActionEnum.input)
//   @IsEnum(VonageEventMethodEnum)
//   @IsOptional()
//   eventMethod?: VonageEventMethodEnum = VonageEventMethodEnum.POST;
//
//   hasSessionEnded(): boolean {
//     return false;
//   }
// }
