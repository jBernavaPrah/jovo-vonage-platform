import { ActionAction, ActionBase } from './ActionBase';
import { ArrayUnique, Equals, IsArray, IsBoolean, IsString, IsUrl, Type } from '@jovotech/output';

export class ConversationAction extends ActionBase<ActionAction.Conversation | 'conversation'> {
  @Equals(ActionAction.Conversation)
  action!: ActionAction.Conversation | 'conversation';

  /**
   * The name of the Conversation room. Names are namespaced to the application level.
   */
  @IsString()
  name!: string;

  /**
   * A URL to the mp3 file to stream to participants until the conversation starts. By default the conversation starts when the first person calls the virtual number associated with your Voice app. To stream this mp3 before the moderator joins the conversation, set startOnEnter to false for all users other than the moderator.
   */
  @IsUrl()
  musicOnHoldUrl?: string;

  /**
   * The default value of true ensures that the conversation starts when this caller joins conversation name. Set to false for attendees in a moderated conversation.
   */
  @IsBoolean()
  startOnEnter?: boolean = true;

  /**
   * Specifies whether a moderated conversation ends when the moderator hangs up. This is set to false by default, which means that the conversation only ends when the last remaining participant hangs up, regardless of whether the moderator is still on the call. Set endOnExit to true to terminate the conversation when the moderator hangs up.
   */
  @IsBoolean()
  endOnExit?: boolean = false;

  /**
   * Set to true to record this conversation. For standard conversations, recordings start when one or more attendees connects to the conversation. For moderated conversations, recordings start when the moderator joins. That is, when an NCCO is executed for the named conversation where startOnEnter is set to true. When the recording is terminated, the URL you download the recording from is sent to the event URL. You can override the default recording event URL and default HTTP method by providing custom eventUrl and eventMethod options in the conversation action definition.
   * By default audio is recorded in MP3 format. See the recording guide for more details.
   */
  @IsBoolean()
  record?: boolean = false;

  /**
   * A list of leg UUIDs that this participant can be heard by. If not provided, the participant can be heard by everyone. If an empty list is provided, the participant will not be heard by anyone
   */
  @IsArray()
  @ArrayUnique()
  canSpeak?: string[];

  /**
   * A list of leg UUIDs that this participant can hear. If not provided, the participant can hear everyone. If an empty list is provided, the participant will not hear any other participants
   */
  @IsArray()
  @ArrayUnique()
  canHear?: string[];

  @IsBoolean()
  mute?: boolean = false;

  hasSessionEnded(): boolean {
    return false;
  }
}
