import { JovoUser } from '@jovotech/framework';
import { Vonage } from './Vonage';

export class VonageUser extends JovoUser<Vonage> {
  get id(): string | undefined {
    return this.jovo.$request.from;
  }

  get phone(): string {
    return this.jovo.$request.from;
  }

  get called(): string {
    return this.jovo.$request.to;
  }
}
