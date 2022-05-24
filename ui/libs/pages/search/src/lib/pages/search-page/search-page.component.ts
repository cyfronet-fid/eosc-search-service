import { Component, Inject, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import {
  BehaviorSubject,
  combineLatest,
  concatMap,
  debounceTime,
  finalize,
  map,
  of,
  ReplaySubject,
  skip,
  switchMap,
  tap,
} from 'rxjs';
import {
  getCollections,
  IResult,
  ISet,
  ITag,
  SearchService,
  TrainingService,
} from '@eosc-search-service/search';
import { CdkVirtualScrollViewport } from '@angular/cdk/scrolling';
import { SEARCH_SET_LIST } from '@eosc-search-service/search';
import { from } from 'rxjs';
import {UntilDestroy, untilDestroyed} from "@ngneat/until-destroy";
import { IService } from '../../../../../../search/src/lib/collections/services/service.model';
import { CollectionSearchMetadata } from '../../../../../../search/src/lib/collections/collection.model';
import { IArticle } from '../../../../../../search/src/lib/collections/publications/publications.model';

@UntilDestroy()
@Component({
  selector: 'ess-search-service-page',
  template: `
    <div class="container--xxl">
      <div class="search-bar">
        <div class="row">
          <div class="col-3">
            <a href="/">
              <img
                id="logo"
                src="assets/eosc-logo-color.png"
                i18n-alt
                alt="EOSC logo"
              />
            </a>
          </div>
          <div class="col-9" style="padding: 0">
            <ess-search-input></ess-search-input>
          </div>
        </div>
      </div>
      <div class="dashboard">
        <ess-sub-nav></ess-sub-nav>
        <ess-sub-header
          [activeSet]="activeSet$ | async"
          [resultsCount]="resultsCount$ | async"
        ></ess-sub-header>
        <div class="loading-block" *ngIf="loading$ | async; else dataLoadedRef">
          <nz-spin nzSimple></nz-spin>
        </div>
        <ng-template #dataLoadedRef>
          <div
            *ngIf="
              (categories.length > 0 || $any(filters$ | async)?.length > 0) &&
                $any(results$ | async)?.length > 0;
              else noFilterRef
            "
            class="row"
            id="dashboard__main"
          >
            <div class="col-3" id="dashboard__filters">
              <ess-filters [filters]="filters$ | async"></ess-filters>
            </div>
            <div class="col-9">
              <ess-active-filters [collections]="collections$ | async"></ess-active-filters>
              <nz-empty *ngIf="(results$ | async)?.length === 0"></nz-empty>
              <cdk-virtual-scroll-viewport
                itemSize="100"
                style="height: 1200px; margin-bottom: 50px"
                (scrolledIndexChange)="loadNext()"
              >
                <ess-result
                  *cdkVirtualFor="let result of results$ | async"
                  [title]="result.title"
                  [description]="result.description"
                  [type]="result.type"
                  [url]="result.url"
                  [typeUrlPath]="'/search/' + result.typeUrlPath"
                  [tags]="result.tags"
                ></ess-result>
              </cdk-virtual-scroll-viewport>
            </div>
          </div>
          <ng-template #noFilterRef>
            <ess-active-filters [collections]="collections$ | async"></ess-active-filters>
            <nz-empty *ngIf="(results$ | async)?.length === 0"></nz-empty>
            <cdk-virtual-scroll-viewport
              itemSize="100"
              style="height: 1000px; margin-bottom: 50px"
              (scrolledIndexChange)="loadNext()"
            >
              <ess-result
                *cdkVirtualFor="let result of results$ | async"
                [title]="result.title"
                [description]="result.description"
                [type]="result.type"
                [typeUrlPath]="'/search/' + result.typeUrlPath"
                [tags]="result.tags"
              ></ess-result>
            </cdk-virtual-scroll-viewport>
          </ng-template>
        </ng-template>
      </div>
    </div>
  `,
  styles: [
    `
      #logo {
        max-width: 120px;
      }
      #dashboard__main {
        min-height: 900px;
      }

      .ant-empty {
        margin-top: 50px;
      }

      .loading-block {
        width: 100%;
        min-height: 300px;
        text-align: center;
        padding: 100px 50px;
      }
    `,
  ],
})
export class SearchPageComponent implements OnInit {
  @ViewChild(CdkVirtualScrollViewport) viewport:
    | CdkVirtualScrollViewport
    | undefined;
  results$ = new BehaviorSubject<IResult[]>([]);
  categories: any[] = [];
  filters$ = this._searchService.filters$;
  collections$ = this.filters$.pipe(map(filters => filters.map(([collection, facets]) => collection)));
  loadNextPage$ = new BehaviorSubject<void>(undefined);
  resultsCount$ = this._searchService.maxResultsNumber$;
  activeSet$ = this._route.data.pipe(map((data) => data['activeSet']));
  loading$ = new ReplaySubject(1);

  constructor(
    private _router: Router,
    private _route: ActivatedRoute,
    private _searchService: SearchService,
    private _trainingService: TrainingService,
    @Inject(SEARCH_SET_LIST) private _search_sets: ISet[]
  ) {}

  ngOnInit() {
    this.loading$.next(true);
    combineLatest(
      this._route.queryParams,
      this._route.data.pipe(map((data) => data['activeSet']))
    )
      .pipe(
        tap(() => this.loading$.next(true)),
        switchMap(() =>
          this._loadResults(
            getCollections(this._router.url, this._search_sets)
          ).pipe(finalize(() => this.loading$.next(false)))
        ),
        untilDestroyed(this)
      )
      .subscribe();

    this.loadNextPage$
      .pipe(
        skip(1),
        debounceTime(300),
        concatMap(() => this._searchService.nextPage$<IArticle | IService>()),
        map((results) => [...this.results$.getValue(), ...results]),
        untilDestroyed(this)
      )
      .subscribe((results) => this.results$.next(results));
  }

  loadNext() {
    const end = this.viewport?.getRenderedRange().end;
    const total = this.viewport?.getDataLength();
    if (total === 0) {
      return;
    }

    const hasNextPage = this._searchService.hasNextPage$.getValue();
    if (end === total && hasNextPage) {
      this.loadNextPage$.next();
    }
  }

  _loadResults(collections: CollectionSearchMetadata<any>[]) {
    return this._searchService.get$(...collections).pipe(
      tap((results) => {
        this.results$.next(results);
      }),
      switchMap(() => {
        this.categories = [
          {
            id: '',
            label: 'Category #1',
            count: 24,
          },
        ];

        ////// MOCK FOR TRAININGS ////////
        const path = this._router.url.split('?')[0];
        if (path === '/search/trainings') {
          return from(this._loadTrainingsMock());
        }
        return of(null);
      })
    );
  }

  async _loadTrainingsMock() {
    const [path, params] = this._router.url.split('?');
    const parsedParams = new URLSearchParams(params);
    if (path === '/search/trainings') {
      const trainings = await this._trainingService.getByQuery$(
        parsedParams.get('q') || '*'
      );
      this.results$.next(trainings);
      this.filters$.next([]);
      this.categories = [];
      this._searchService.maxResultsNumber$.next(trainings.length);
    }
  }
}
