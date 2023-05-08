import { BaseComponent, Component, Global, Intents } from '@jovotech/framework';

/*
|--------------------------------------------------------------------------
| Global Component
|--------------------------------------------------------------------------
|
| The global component handlers can be reached from anywhere in the app
| Learn more here: www.jovo.tech/docs/components#global-components
|
*/
@Global()
@Component()
export class GlobalComponent extends BaseComponent {
  LAUNCH() {
    this.$send('Hello! How can I help you?');
    return;
  }

  reservation() {
    return this.$send(`OK from reservation!`);
  }

  @Intents('goodbye')
  response_goodbay() {
    return this.$send({ message: `Good Bye!`, listen: false });
  }

  UNHANDLED() {
    return this.$send(`I didn't understand, can you repeat?`);
  }
}
