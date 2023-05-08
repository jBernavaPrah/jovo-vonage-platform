import { App } from '@jovotech/framework';
import { NlpjsNlu } from '@jovotech/nlu-nlpjs';
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import { LangEn } from '@nlpjs/lang-en';
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import { LangIt } from '@nlpjs/lang-it';
import { VonagePlatform } from '../../src';
import { GlobalComponent } from './GlobalComponent';

const nlp = new NlpjsNlu({
  modelsPath: './test/_app/models',
  languageMap: {
    en: LangEn,
    it: LangIt,
  },
  enabled: true,
});

const app = new App({
  components: [GlobalComponent],
  plugins: [
    new VonagePlatform({
      plugins: [nlp],
      verifyToken: 'ABC',
    }),
  ],
});

export { app };
