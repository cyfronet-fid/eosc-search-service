import {InjectionToken} from "@angular/core";
import {ISet} from "@eosc-search-service/search";

export const MAIN_SEARCH_SET = new InjectionToken<ISet>('MainSearchSet');
export const SEARCH_SET_LIST = new InjectionToken<ISet[]>('SearchSetList');
