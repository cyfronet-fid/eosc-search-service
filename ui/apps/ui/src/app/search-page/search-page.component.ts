import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { BehaviorSubject, concatMap, debounceTime, map, skip, tap } from 'rxjs';
import { TrainingService } from '../training-service/training.service';
import { SearchService } from '../search-service/search.service';
import { IResult, ITag } from '../result/result.model';
import { CdkVirtualScrollViewport } from '@angular/cdk/scrolling';
import { IArticle } from '../collections/research-products/research-products.model';
import { IService } from '../collections/services/service.model';
import { CollectionSearchMetadata } from '../collections/collection.model';
import { getCollections } from './utils';

@Component({
  selector: 'ui-search-service-page',
  template: `
    <div class="container--xxl">
      <div class="search-bar">
        <div class="row">
          <div class="col-3">
            <a href="/">
              <img id="logo" src="assets/eosc-logo-color.png" alt="EOSC logo" />
            </a>
          </div>
          <div class="col-9" style="padding: 0">
            <core-search></core-search>
          </div>
        </div>
      </div>
      <div class="dashboard">
        <ui-sub-nav></ui-sub-nav>
        <ui-sub-header></ui-sub-header>
        <ng-container
          *ngIf="
            categories.length === 0 && $any(filters$ | async)?.length === 0
          "
        >
          <nz-empty *ngIf="(results$ | async)?.length === 0"></nz-empty>
          <cdk-virtual-scroll-viewport
            itemSize="100"
            style="height: 1000px; margin-bottom: 50px"
            (scrolledIndexChange)="loadNext()"
          >
            <ui-result
              *cdkVirtualFor="let result of results$ | async"
              [title]="result.title"
              [description]="result.description"
              [type]="result.type"
              [typeUrlPath]="result.typeUrlPath"
              [tags]="toTags(result)"
            ></ui-result>
          </cdk-virtual-scroll-viewport>
        </ng-container>
        <div
          *ngIf="categories.length > 0 || $any(filters$ | async)?.length > 0"
          class="row"
          id="dashboard__main"
        >
          <div class="col-3" id="dashboard__filters">
            <ui-filters [filters]="filters$ | async"></ui-filters>
          </div>
          <div class="col-9">
            <nz-empty *ngIf="(results$ | async)?.length === 0"></nz-empty>
            <cdk-virtual-scroll-viewport
              itemSize="100"
              style="height: 1200px; margin-bottom: 50px"
              (scrolledIndexChange)="loadNext()"
            >
              <ui-result
                *cdkVirtualFor="let result of results$ | async"
                [title]="result.title"
                [description]="result.description"
                [type]="result.type"
                [typeUrlPath]="result.typeUrlPath"
                [tags]="toTags(result)"
              ></ui-result>
            </cdk-virtual-scroll-viewport>
          </div>
        </div>
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
  loadNextPage$ = new BehaviorSubject<void>(undefined);

  constructor(
    private _router: Router,
    private _route: ActivatedRoute,
    private _searchService: SearchService,
    private _trainingService: TrainingService
  ) {}

  ngOnInit() {
    this._route.queryParams.subscribe(
      async () => await this._loadResults(getCollections(this._router.url))
    );
    this.loadNextPage$
      .pipe(
        skip(1),
        debounceTime(300),
        concatMap(() => this._searchService.nextPage$<IArticle | IService>()),
        map((results) => [...this.results$.getValue(), ...results])
      )
      .subscribe((results) => this.results$.next(results));
  }

  toTags = (result: IResult): ITag[] => {
    return result.fieldsToTags
      .filter((field: string) => !!result[field])
      .map((field: string) => ({
        type: field,
        value: result[field],
        originalField: result.fieldToFilter[field],
      }));
  };

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

  async _loadResults(collections: CollectionSearchMetadata<any>[]) {
    const results = await this._searchService.get$(...collections);
    this.results$.next(results);
    this.categories = [
      {
        id: '',
        label: 'Category #1',
        count: 24,
      },
    ];

    ////// MOCK FOR TRAININGS ////////
    const path = this._router.url.split('?')[0];
    if (path === '/trainings') {
      await this._loadTrainingsMock();
    }
  }

  async _loadTrainingsMock() {
    const [path, params] = this._router.url.split('?');
    const parsedParams = new URLSearchParams(params);
    if (path === '/trainings') {
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
