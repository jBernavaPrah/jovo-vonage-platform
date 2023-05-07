import { VonageResponse } from '../VonageResponse';
import {
  mergeInstances,
  MessageMaxLength,
  OutputTemplateConverterStrategyConfig,
  SingleResponseOutputTemplateConverterStrategy,
} from '@jovotech/output';
import { MessageValue, NormalizedOutputTemplate } from '@jovotech/framework';
import { MESSAGE_TEXT_MAX_LENGTH } from './constant';
import { Action, TalkAction } from './actions';
import { convertMessageToVonageTalk } from './utilities';

import { ActionAction } from './actions';

export class VonageOutputTemplateConversionStrategy extends SingleResponseOutputTemplateConverterStrategy<
  VonageResponse,
  OutputTemplateConverterStrategyConfig
> {
  readonly platformName = 'vonage' as const;

  constructor() {
    super();
  }

  // fake response because the normalizeResponse is overwritten
  readonly responseClass = VonageResponse;

  toResponse(output: NormalizedOutputTemplate): VonageResponse {
    // idea: use the quickResponse as dtmf input??

    const response: VonageResponse = this.normalizeResponse({
      action: {},
    });

    const message = output.message;
    if (message) response.action = convertMessageToVonageTalk(message);

    if (output.platforms?.vonage?.nativeResponse) {
      mergeInstances(response, output.platforms.vonage.nativeResponse);
    }

    // todo: implement the other output type (like quick response)

    return response;
  }

  fromResponse(response: VonageResponse): NormalizedOutputTemplate {
    // todo: eventually improve this code.
    const output: NormalizedOutputTemplate = {};

    if (response.action?.action === ActionAction.Talk) {
      output.message = (response as unknown as TalkAction).text;
    }
    return output;
  }

  protected sanitizeOutput(output: NormalizedOutputTemplate): NormalizedOutputTemplate {
    if (output.message) {
      output.message = this.sanitizeMessage(output.message, `message`);
    }

    return output;
  }

  protected sanitizeMessage(
    message: MessageValue,
    path: string,
    maxLength: MessageMaxLength = MESSAGE_TEXT_MAX_LENGTH,
    offset?: number,
  ): MessageValue {
    return super.sanitizeMessage(message, path, maxLength, offset);
  }
}
