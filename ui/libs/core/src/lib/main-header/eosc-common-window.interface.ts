export interface EoscCommonWindow extends Window {
  eosccommon: {
    renderMainFooter: (cssSelector: string) => void;
    renderMainHeader: (cssSelector: string, elementAttr?: object) => void;
    renderEuInformation: (cssSelector: string) => void;
  };
}
