import { VonageResponse } from '../VonageResponse';
import {
  OutputTemplateConverterStrategyConfig,
  MultipleResponsesOutputTemplateConverterStrategy,
  mergeInstances,
} from '@jovotech/output';
import { NormalizedOutputTemplate } from '@jovotech/framework';
import { convertMessageToVonageTalk } from './utilities';

export class VonageOutputTemplateConversionStrategy extends MultipleResponsesOutputTemplateConverterStrategy<
  VonageResponse,
  OutputTemplateConverterStrategyConfig
> {
  readonly platformName: string = 'vonage';

  responseClass = VonageResponse;

  convertOutput(output: NormalizedOutputTemplate): VonageResponse {
    const response: VonageResponse = this.normalizeResponse({
      $type: 'vonage',
    }) as VonageResponse;

    const message = output.message;
    if (message) response.action = convertMessageToVonageTalk(message);

    if (output.platforms?.vonage?.nativeResponse) {
      mergeInstances(response, {
        action: output.platforms.vonage.nativeResponse,
      });
    }

    // todo: implement the other output type (like quick response)

    return response;

    // const quickReplies = output.quickReplies;
    // const nativeQuickReplies = platformOutput?.nativeQuickReplies;
    // if (quickReplies?.length || nativeQuickReplies?.length) {
    //   const lastResponseWithMessage = responses
    //     .slice()
    //     .reverse()
    //     .find((response) => !!response.message);
    //   if (lastResponseWithMessage?.message) {
    //     lastResponseWithMessage.message.quick_replies = [];
    //     if (nativeQuickReplies?.length) {
    //       lastResponseWithMessage.message.quick_replies.push(...nativeQuickReplies);
    //     }
    //     if (quickReplies?.length) {
    //       lastResponseWithMessage.message.quick_replies.push(
    //         ...quickReplies.map(this.convertQuickReplyToFacebookMessengerQuickReply),
    //       );
    //     }
    //   }
    // }
  }

  convertResponse(response: VonageResponse): NormalizedOutputTemplate {
    return {};
  }

  protected sanitizeOutput(
    output: NormalizedOutputTemplate,
    index: number | undefined,
  ): NormalizedOutputTemplate {
    return output;
  }
}
