import { BaseComponent, Component, Global } from '@jovotech/framework';
import { TalkActionOutput } from '../src/output/templates/TalkActionOutput';

@Global()
@Component()
// eslint-disable-next-line @typescript-eslint/no-unused-vars
export class TestComponent extends BaseComponent {
  async LAUNCH(): Promise<void> {
    return this.$send('welcome');
  }

  bot(): Promise<void> {
    return this.$send({ message: `bot` });
  }

  goodbye(): Promise<void> {
    return this.$send({ message: `goodbye`, listen: false });
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
