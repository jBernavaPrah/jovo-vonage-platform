import { BaseOutput, Output, OutputOptions, OutputTemplate } from '@jovotech/framework';
import { ActionAction } from '../actions/ActionBase';
import { plainToInstance } from 'class-transformer';
import { InputAction, InputType } from '../actions/InputAction';

export interface InputActionOutputOptions extends OutputOptions {
  type: InputAction['type'];
}

@Output()
export class InputActionOutput extends BaseOutput<InputActionOutputOptions> {
  build(): OutputTemplate | OutputTemplate[] | Promise<OutputTemplate | OutputTemplate[]> {
    const createInput = (obj: InputAction) => plainToInstance(InputAction, obj);
    return {
      message: this.options.message,
      platforms: {

        vonage: {
          nativeResponse: {
            action: createInput({
              type: this.options.type,
              action: ActionAction.Input,
            }),
          },
        },
        core: {
          nativeResponse: {
            // instead here I have them ()
            output: undefined,
          },
        },
      },
    };
  }
}
