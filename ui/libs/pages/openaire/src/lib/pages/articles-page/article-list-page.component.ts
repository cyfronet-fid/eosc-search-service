import { Component, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import {ArticlesStore, IArticle, SearchService} from "@eosc-search-service/search";

@Component({
  selector: 'ess-article-list-page',
  template: `
    <ess-horizontal-filters></ess-horizontal-filters>
    <div class="row">
      <div class="col-3">
        <ess-article-list-pagination
          [pageResultsNumber]="(pageResultsNumber$ | async)!"
          [foundResultsNumber]="(foundArticlesNumber$ | async)!"
          [hasNextPage]="!!(hasNextPage$ | async)"
          [hasPrevPage]="!!(hasPrevPage$ | async)"
          (prevPage)="prevPage$()"
          (nextPage)="nextPage$()"
        ></ess-article-list-pagination>
        <ess-article-list
          [articles]="(articles$ | async) ?? []"
          (setActive)="setActive($event)"
        ></ess-article-list>
      </div>
      <div *ngIf="activeArticle$ | async; let activeArticle" class="col-9" id="item-details">
        <ess-detailed-article
          [article]="activeArticle"
        ></ess-detailed-article>
      </div>
    </div>
  `,
})
export class ArticleListPageComponent implements OnDestroy {
  articles$ = this._articlesStore.articles$;
  foundArticlesNumber$ = this._articlesStore.articlesSize$;
  activeArticle$ = this._articlesStore.activeArticle$;

  hasNextPage$ = this._searchService.hasNextPage$;
  hasPrevPage$ = this._searchService.hasPrevPage$;
  pageResultsNumber$ = this._searchService.currentResultsNumber$;

  private _setActiveSub$: Subscription | null = null;

  constructor(
    private _searchService: SearchService,
    private _articlesStore: ArticlesStore,
    private _route: ActivatedRoute,
    private _router: Router
  ) {}

  setActive = (article: IArticle) => this._articlesStore.setActive(article);
  nextPage$ = () =>
    this._searchService
      .nextPage$<IArticle>()
      .toPromise()
      .then((articles) =>
        articles ? this._articlesStore.set(articles) : null
      );
  prevPage$ = async () =>
    await this._searchService
      .prevPage$<IArticle>()
      .toPromise()
      .then((articles) =>
        articles ? this._articlesStore.set(articles) : null
      );
  ngOnDestroy() {
    this._setActiveSub$?.unsubscribe();
  }
}
