import { App } from '@jovotech/framework';
import { TestComponent } from './TestComponent';
import { VonagePlatform } from '../src';
import { KeywordNluPlugin } from '@jovotech/plugin-keywordnlu';

const app = new App({
  components: [TestComponent],
  plugins: [
    new KeywordNluPlugin({
      keywordMap: {
        en: {
          barge: 'barge',
          empty: 'empty',
          goodbye: 'goodbye',
          bot: 'bot',
          custom: 'custom',
          multiple: 'multiple',
        },
        it: {
          barge: 'barge',
          empty: 'empty',
          goodbye: 'goodbye',
          bot: 'bot',
          custom: 'custom',
          multiple: 'multiple',
        },
      },
    }),
    new VonagePlatform({
      fallbackCountryLanguageMap: {
        GB: 'en-GB',
        IT: 'it-IT',
        CH: 'de-DE',
      },
      fallbackLanguage: 'en-GB',
      eventUrl: 'http://test.com',
    }),
  ],
  logging: true,
});

export default app;
