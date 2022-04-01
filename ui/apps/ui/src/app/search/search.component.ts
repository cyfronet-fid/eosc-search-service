import { Component, OnDestroy, OnInit } from '@angular/core';
import { SearchService } from './search.service';
import { ActivatedRoute, Router } from '@angular/router';
import { FormControl } from '@angular/forms';
import { Subscription, concatMap, debounceTime, filter, map, tap } from 'rxjs';
import { ArticlesStore } from '../articles-page/articles.store';
import { IArticle } from '../articles-page/article.interface';
import { SolrQueryParams } from './solr-query-params.interface';

@Component({
  selector: 'ui-search',
  template: `
    <div class="search-bar">
      <div class="row">
        <div class="col-3 d-grid">
          <a href=".">
            <img id="logo" src="assets/eosc-logo-color.png" alt="EOSC logo" />
          </a>
        </div>
        <div class="col-6 d-grid vertical-center">
          <input
            type="text"
            id="search"
            class="rounded-pill"
            [formControl]="form"
          />
        </div>
        <div class="col-3 d-grid vertical-center">
          <button id="btn--search" class="btn btn-primary" type="button">
            Navigation
          </button>
        </div>
      </div>
    </div>
  `,
})
export class SearchComponent implements OnInit, OnDestroy {
  form = new FormControl();

  private _queryToValue$: Subscription | null = null;
  private _valueToResults$: Subscription | null = null;

  constructor(
    private _searchService: SearchService,
    private _articlesStore: ArticlesStore,
    private _route: ActivatedRoute,
    private _router: Router
  ) {}

  ngOnInit() {
    // Load search query from URL params
    this._queryToValue$ = this._route.queryParams
      .pipe(
        map((params) => params['q']),
        tap((q: string) => {
          const searchQuery = (q !== '*' && q) || '';
          const emitEvent = q !== '*' && q != this.form.value;
          this.form.setValue(searchQuery, { emitEvent });
        }),
        map((q) => (q && q.trim() !== '' ? q : '*')),
        filter((q) => q === '*'),
        map(
          (q: string) =>
            new SolrQueryParams({
              q,
              qf: q && q.trim() === '*' ? [] : ['title'],
            })
        ),
        concatMap((params: SolrQueryParams) =>
          this._searchService.get$<IArticle>(params)
        )
      )
      .subscribe((articles) => this._articlesStore.set(articles));

    // Load data from search query
    this._valueToResults$ = this.form.valueChanges
      .pipe(
        debounceTime(500),
        map((q: string) => q.trim()),
        tap((q: string) =>
          this._router.navigate([], {
            queryParams: { q: q || '*' },
            queryParamsHandling: 'merge',
          })
        ),
        map(
          (q: string) =>
            new SolrQueryParams({
              q,
              qf: q && q.trim() === '*' ? [] : ['title'],
            })
        ),
        concatMap((params: SolrQueryParams) =>
          this._searchService.get$<IArticle>(params)
        )
      )
      .subscribe((articles) => this._articlesStore.set(articles));
  }

  ngOnDestroy() {
    this._queryToValue$?.unsubscribe();
    this._valueToResults$?.unsubscribe();
  }
}
