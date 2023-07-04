import {
  BaseOutput,
  Output,
  OutputOptions,
  OutputTemplate,
} from '@jovotech/framework';
import { TalkAction } from '../actions';

export interface TextActionOutputOptions
  extends OutputOptions,
    Pick<TalkAction, 'bargeIn' | 'language' | 'style' | 'loop'> {}

@Output()
export class TalkActionOutput extends BaseOutput<TextActionOutputOptions> {
  build(): OutputTemplate | OutputTemplate[] | Promise<OutputTemplate | OutputTemplate[]> {
    return {
      message: this.options.message,
      platforms: {
        vonage: {
          nativeResponse: {
            bargeIn: this.options.bargeIn ?? false,
            ...(this.options.language ? { language: this.options.language } : {}),
            ...(this.options.style ? { style: this.options.style } : {}),
            ...(this.options.loop ? { loop: this.options.loop } : {}),
          },
        },
      },
    };
  }
}
