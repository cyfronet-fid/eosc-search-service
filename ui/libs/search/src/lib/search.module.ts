import { ModuleWithProviders, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ArticlesStore } from './collections/articles.store';
import { ISearchResults } from './services';
import { CommonSettings, ESS_SETTINGS } from '@eosc-search-service/common';
import {MAIN_SEARCH_SET, SEARCH_SET_LIST} from "./search.providers";
import {ISet} from "./sets";

@NgModule({
  declarations: [],
  imports: [CommonModule],
  exports: [],
  providers: [
    // SearchService,
    ArticlesStore,
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

export interface IStore<T> {
  set(results: ISearchResults<T>): void;
  setActive(item: T): void;
}
