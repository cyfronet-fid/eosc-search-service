import * as languagesJSON from './languages.json';

export const languages = (languagesJSON as unknown as { default: unknown })
  .default as ILanguages;

export interface ILanguages {
  [languageAlphaCode2: string]: ILanguage;
}

export interface ILanguage {
  name: string;
  nativeName: string;
}
