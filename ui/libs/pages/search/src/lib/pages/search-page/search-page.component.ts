import { Component, Inject, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import {map, Observable} from 'rxjs';
import {
  ISet,
  PrimaryResultsRepository,
  SEARCH_SET_LIST,
} from '@eosc-search-service/search';
import { CdkVirtualScrollViewport } from '@angular/cdk/scrolling';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { ICollectionSearchMetadata, PrimaryResultsService } from '../../../../../../search/src/lib/state/results/results.service';
import {CategoriesRepository} from "@eosc-search-service/common";

@UntilDestroy()
@Component({
  selector: 'ess-search-service-page',
  template: `
    <div class="container--xxl">
      <div class="search-bar">
        <div class="row">
          <div class="col-sm-3 col-12">
            <a href="/">
              <img
                id="logo"
                src="assets/eosc-logo-color.png"
                i18n-alt
                alt="EOSC logo"
              />
            </a>
          </div>
          <div class="col-sm-9 col-12 search-row">
            <ess-search-input></ess-search-input>
          </div>
        </div>
      </div>
      <div class="dashboard">
        <ess-sub-nav></ess-sub-nav>
        <ess-sub-header
          [activeSet]="activeSet$ | async"
          [resultsCount]="resultsCount$ | async"
          [categoriesTree]="(categoriesTree$ | async) || []"
        ></ess-sub-header>
        <div class="loading-block" *ngIf="loading$ | async; else dataLoadedRef">
          <nz-spin nzSimple></nz-spin>
        </div>
        <ng-template #dataLoadedRef>
          <div
            *ngIf="
              $any(filters$ | async)?.length > 0 &&
                $any(results$ | async)?.length > 0;
              else noFilterRef
            "
            class="row"
            id="dashboard__main"
          >
            <div class="col-sm-3 col-12 left-column" id="dashboard__filters">
              <ess-categories
                *ngIf="((currentCategories$ | async) || []).length > 0"
                [currentCategories]="(currentCategories$ | async) || []"
                [activeId]="activeId$ | async"
              ></ess-categories>
              <ess-filters [filters]="filters$ | async"></ess-filters>
            </div>
            <div class="col-sm-9 col-12 right-column">
              <ess-active-filters
                [collections]="collections$ | async"
              ></ess-active-filters>
              <nz-empty *ngIf="(results$ | async)?.length === 0"></nz-empty>
              <cdk-virtual-scroll-viewport
                #viewport
                *ngIf="$any(results$ | async)?.length > 0"
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
            <ess-active-filters
              [collections]="collections$ | async"
            ></ess-active-filters>
            <nz-empty *ngIf="(results$ | async)?.length === 0"></nz-empty>
            <cdk-virtual-scroll-viewport
              #viewport
              *ngIf="$any(results$ | async)?.length > 0"
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
        max-width: 200px;
        margin-top: 25px;
      }
      #dashboard__main {
        min-height: 900px;
      }

      .ant-empty {
        margin-top: 50px;
        margin-bottom: 100px;
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
  @ViewChild(CdkVirtualScrollViewport, { static: false })
  viewport?: CdkVirtualScrollViewport;
  results$ = this._resultsRepository.results$;
  collections$: Observable<ICollectionSearchMetadata[]> = this._route.data.pipe(
    map((data) => data['activeSet'] as ISet),
    map((set) => set.collections)
  );
  filters$ = this._resultsRepository.filters$;
  resultsCount$ = this._resultsRepository.maxResults$;
  activeSet$ = this._route.data.pipe(map((data) => data['activeSet']));
  loading$ = this._resultsRepository.loading$;

  currentCategories$ = this._categoriesRepository.currentCategories$;
  activeId$ = this._categoriesRepository.activeId$;
  categoriesTree$ = this._categoriesRepository.tree$;

  constructor(
    private _route: ActivatedRoute,
    //refactor new services
    private _resultsService: PrimaryResultsService,
    private _resultsRepository: PrimaryResultsRepository,
    private _categoriesRepository: CategoriesRepository,
    @Inject(SEARCH_SET_LIST) private _search_sets: ISet[]
  ) {}

  ngOnInit() {
    this._resultsService
      .connectToURLQuery$(this._route)
      .pipe(untilDestroyed(this))
      .subscribe();
    this.activeSet$
      .pipe(untilDestroyed(this))
      .subscribe(({ categories }) => this._categoriesRepository.setCategories(categories));
  }

  loadNext() {
    const end = this.viewport?.getRenderedRange().end;
    const total = this.viewport?.getDataLength();
    if (total === 0) {
      return;
    }
    if (end === total) {
      this._resultsService.loadNextPage();
    }
  }
}
