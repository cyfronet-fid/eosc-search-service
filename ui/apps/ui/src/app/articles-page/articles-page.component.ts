import { Component, OnDestroy, OnInit } from '@angular/core';
import { SearchService } from '../search/search.service';
import { ActivatedRoute, Router } from '@angular/router';
import { ArticlesStore } from './articles.store';
import { IArticle } from './article.interface';
import { Subscription, filter, map } from 'rxjs';

@Component({
  selector: 'ui-articles-page',
  templateUrl: './articles-page.component.html',
})
export class ArticlesPageComponent implements OnInit, OnDestroy {
  articles$ = this._articlesStore.articles$;
  articlesSize$ = this._articlesStore.articlesSize$;
  activeArticle$ = this._articlesStore.activeArticle$;

  hasNextPage$ = this._searchService.hasNextPage$;
  hasPrevPage$ = this._searchService.hasPrevPage$;
  currentResultsNumber$ = this._searchService.currentResultsNumber$;

  private _setActiveSub$: Subscription | null = null;

  constructor(
    private _searchService: SearchService,
    private _articlesStore: ArticlesStore,
    private _route: ActivatedRoute,
    private _router: Router
  ) {}

  ngOnInit() {
    this._setActiveSub$ = this._route.queryParams
      .pipe(
        map((params) => params['articleId']),
        filter((id) => !!id)
      )
      .subscribe(async (id) =>
        this._articlesStore.setActive({ id } as IArticle)
      );
  }

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
