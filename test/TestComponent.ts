import { BaseComponent, Component, Global } from '@jovotech/framework';
import { createInputAction, InputType, LanguageEnum, TalkActionOutput } from '../src';

@Global()
@Component()
// eslint-disable-next-line @typescript-eslint/no-unused-vars
export class TestComponent extends BaseComponent {
  async LAUNCH(): Promise<void> {
    return this.$send('welcome');
  }

  async multiple(): Promise<void> {
    await this.$send({ message: `multiple1` });
    await this.$send({ message: `multiple2` });
    return this.$send({ message: `multiple3` });
  }

  bot(): Promise<void> {
    return this.$send({ message: `bot` });
  }

  goodbye(): Promise<void> {
    return this.$send({ message: `goodbye`, listen: false });
  }

  custom(): Promise<void> {
    return this.$send({
      platforms: {
        vonage: {
          nativeResponse: createInputAction([InputType.speech], {
            speech: {
              endInSilence: 0.4,
              maxDuration: 1,
              startTimeout: 1,
              language: this.$request.getLocale(),
            },
          }),
        },
      },
    });
  }

  empty(): void {
    return;
  }

  silence(): Promise<void> {
    return this.$send('silence');
  }

  barge(): Promise<void> {
    return this.$send(TalkActionOutput, {
      message: `barge`,
      bargeIn: true,
    });
  }
}
