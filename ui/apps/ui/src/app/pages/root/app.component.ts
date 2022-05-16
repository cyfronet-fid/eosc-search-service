import { Component } from '@angular/core';
import { MocksService } from '@eosc-search-service/common';
import { ActivatedRoute } from '@angular/router';
import { IArticle } from '@eosc-search-service/search';
import { SearchService } from '@eosc-search-service/search';
import { ArticlesStore } from '@eosc-search-service/search';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'ess-root',
  template: `
    <ess-main-header
      backendUrl="${environment.backendApiPath}"
    ></ess-main-header>
    <div class="container--xxl">
      <ess-search-input (searchedValue)="getByQuery($event)"></ess-search-input>
      <div class="dashboard">
        <ess-sub-nav></ui-sub-nav>
        <ess-sub-header></ui-sub-header>
        <router-outlet></router-outlet>
      </div>
    </div>
  `,
})
export class AppComponent {
  constructor(
    private _searchService: SearchService,
    private _articlesStore: ArticlesStore,
    private _mocksService: MocksService,
    private _route: ActivatedRoute
  ) {}

  getByQuery(q: string): void {
    this._searchService
      .getByQuery$<IArticle>(q)
      .subscribe((articles) => this._articlesStore.set(articles));
  }
}
