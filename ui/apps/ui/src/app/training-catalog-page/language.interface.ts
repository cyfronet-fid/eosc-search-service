export interface ILanguages {
  default: { [alphaCode2: string]: ILanguage };
}

export interface ILanguage {
  name: string;
  nativeName: string;
}
