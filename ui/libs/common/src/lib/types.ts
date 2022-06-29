import {NzTreeNodeOptions} from "ng-zorro-antd/tree";

export interface CommonSettings {
  backendApiPath: string;
  // search: {
  //   collection: string;
  //   apiPath: string;
  // };
  search: any
}

export interface ICategory {
  id: string;
  count: number;
  label: string;
  filters: string[];
  level: number;

  isLeaf?: boolean;
  parentId?: string;
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
