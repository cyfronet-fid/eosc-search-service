import { Component } from '@angular/core';
import { MocksService } from './mocks.service';
import { ActivatedRoute } from '@angular/router';
import { IArticle } from './articles-page/article.interface';
import { SearchService } from './search/search.service';
import { ArticlesStore } from './articles-page/articles.store';
import { environment } from '../environments/environment';

@Component({
  selector: 'ui-root',
  template: `
    <core-main-header
      backendUrl="/${environment.backendApiPath}"
    ></core-main-header>
    <div class="container--xxl">
      <core-search (searchedValue)="getByQuery($event)"></core-search>
      <div class="dashboard">
        <ui-sub-header></ui-sub-header>
        <br /><br /><br />
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

  getByQuery = (q: string) =>
    this._searchService
      .getByQuery$<IArticle>(q)
      .subscribe((articles) => this._articlesStore.set(articles));
}
