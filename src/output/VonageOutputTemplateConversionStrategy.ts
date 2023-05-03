import { VonageResponse } from '../VonageResponse';
import {
  MessageMaxLength,
  MultipleResponsesOutputTemplateConverterStrategy,
  OutputTemplateConverterStrategyConfig,
} from '@jovotech/output';
import { JovoResponse, MessageValue, NormalizedOutputTemplate } from '@jovotech/framework';
import { MESSAGE_TEXT_MAX_LENGTH } from './constant';
import { TalkAction } from './actions/TalkAction';
import { convertMessageToVonageTalk, createInputAction } from './utilities';
import { InputType } from './actions/InputAction';

import { Action, ActionAction } from './actions/ActionBase';
import { NormalizedVonageOutputTemplate } from './models';

export class VonageOutputTemplateConversionStrategy extends MultipleResponsesOutputTemplateConverterStrategy<
  VonageResponse,
  OutputTemplateConverterStrategyConfig
> {
  readonly platformName = 'vonage';

  // fake response because the normalizeResponse is overwritten
  readonly responseClass = VonageResponse;

  protected sanitizeOutput(
    output: NormalizedOutputTemplate,
    index: number | undefined,
  ): NormalizedOutputTemplate {
    const pathPrefix = index ? `[${index}]` : '';

    // idea: use the quickResponse as dtmf input??

    if (output.message) {
      output.message = this.sanitizeMessage(output.message, `${pathPrefix}.message`);
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

  convertOutput(output: NormalizedOutputTemplate): VonageResponse[] {
    const responses: VonageResponse[] = [];

    const makeResponse: (message: Action) => VonageResponse = (message) =>
      this.normalizeResponse({
        action: message,
      }) as VonageResponse;

    const message = output.message;
    if (message) responses.push(makeResponse(convertMessageToVonageTalk(message)));

    const platformOutput = output.platforms?.[this.platformName] as
      | NormalizedVonageOutputTemplate
      | undefined;

    if (platformOutput?.nativeResponse) {
      responses.push(makeResponse(platformOutput.nativeResponse.action));
    }

    // todo: implement the other responses?

    return responses;
  }

  convertResponse(response: VonageResponse): NormalizedOutputTemplate {
    const output: NormalizedOutputTemplate = {};

    console.log('ConvertResponse called');

    // todo: eventually improve this code.

    if (response.action.action === ActionAction.Talk) {
      output.message = (response as unknown as TalkAction).text;
    }
    return output;
  }
}
