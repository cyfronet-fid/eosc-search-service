import {ModuleWithProviders, NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {MAIN_SEARCH_SET, SEARCH_SET_LIST} from "./search.providers";
import {ISet} from "./sets";
import {ISearchResults} from "./state";
import {IHasId} from "@eosc-search-service/types";

@NgModule({
  declarations: [],
  imports: [CommonModule],
  exports: [],
  providers: [
  ],
})
export class SearchModule {
  static forRoot(config: {setList: ISet[], mainSet: ISet}): ModuleWithProviders<SearchModule> {
    return {
      ngModule: SearchModule,
      providers: [
        {
          provide: MAIN_SEARCH_SET,
          useValue: config.mainSet,
        },
        {
          provide: SEARCH_SET_LIST,
          useValue: config.setList,
        },
      ],
    };
  }
}

export interface IStore<T extends IHasId> {
  set(results: ISearchResults<T>): void;
  setActive(item: T): void;
}
