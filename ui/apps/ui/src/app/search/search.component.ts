import { Component, OnDestroy, OnInit } from '@angular/core';
import { SearchService } from './search.service';
import { ActivatedRoute, Router } from '@angular/router';
import { FormControl } from '@angular/forms';
import { Subscription, debounceTime, filter, map, switchMap, tap } from 'rxjs';
import { ArticlesStore } from '../articles-page/articles.state';
import { IArticle } from '../articles-page/article.interface';

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
    this._queryToValue$ = this._route.queryParams
      .pipe(filter((params) => params['q'] !== '*'))
      .subscribe((params) =>
        this.form.setValue(params['q'] || '', { emitEvent: false })
      );

    this._valueToResults$ = this.form.valueChanges
      .pipe(
        debounceTime(500),
        map((q: string) => q.trim()),
        tap((q: string) =>
          this._router.navigate([], { queryParams: { q: q || null } })
        ),
        switchMap((q: string) => this._searchService.getResults$<IArticle>(q))
      )
      .subscribe((articles) => this._articlesStore.set(articles));
  }

  ngOnDestroy() {
    this._queryToValue$?.unsubscribe();
    this._valueToResults$?.unsubscribe();
  }
}
