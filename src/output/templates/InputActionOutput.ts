import { BaseOutput, Output, OutputOptions, OutputTemplate } from '@jovotech/framework';
import { ActionAction } from '../actions';
import { plainToInstance } from 'class-transformer';
import { InputAction, InputType } from '../actions';

export interface InputActionOutputOptions extends OutputOptions {
  type?: InputAction['type'];
}

@Output()
export class InputActionOutput extends BaseOutput<InputActionOutputOptions> {
  build(): OutputTemplate {
    const createInput = (obj: InputAction) => plainToInstance(InputAction, obj);
    return {
      message: undefined,
      platforms: {
        vonage: {
          nativeResponse: createInput({
            type: this.options.type ?? [InputType.speech],
            action: ActionAction.Input,
          }),
        },
      },
    };
  }
}
