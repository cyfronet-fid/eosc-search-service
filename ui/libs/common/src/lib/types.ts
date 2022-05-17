import {NzTreeNodeOptions} from "ng-zorro-antd/tree";

export interface CommonSettings {
  backendApiPath: string;
  search: {
    collection: string;
    apiPath: string;
  };
}

export interface ICategory {
  id: string;
  label: string;
  count: number;
}

export interface EoscCommonWindow extends Window {
  eosccommon: {
    renderMainFooter: (cssSelector: string) => void;
    renderMainHeader: (cssSelector: string, elementAttr?: object) => void;
    renderEuInformation: (cssSelector: string) => void;
  };
}

export interface IMultiselectWithSearchParams {
  label: string;
  buckets: NzTreeNodeOptions[];
}
