import { Component, OnInit } from '@angular/core';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { filter, map, switchMap, tap } from 'rxjs';
import { FetchDataService } from '@collections/services/fetch-data.service';
import { CustomRoute } from '@collections/services/custom-route.service';
import { SearchMetadataRepository } from '@collections/repositories/search-metadata.repository';
import { AdaptersRepository } from '@collections/repositories/adapters.repository';
import {
  ICollectionSearchMetadata,
  IResult,
  ISearchResults,
  adapterType,
} from '@collections/repositories/types';
import {
  MAX_COLLECTION_RESULTS,
  PaginationRepository,
} from '@components/results-with-pagination/pagination.repository';
import { ActivatedRoute, Router } from '@angular/router';
import { combineLatest } from 'rxjs';
import { queryChanger } from '@collections/filters-serializers/utils';

@UntilDestroy()
@Component({
  selector: 'ess-search-service-page',
  template: `

    <div class="top-bar"></div>

    <div class="container d-md-none">
      <div class="row mobile-buttons">
        <div class="col-6">
          <button
            (click)="showFilters = !showFilters"
            class="btn btn-special mobile-show-flters"
            type="button"
          >
            <ng-container *ngIf="!showFilters; else hideFiltersCaption"
              >Show filters</ng-container
            >
            <ng-template #hideFiltersCaption>Hide filters</ng-template>
            <i class="bi bi-filter"></i>
          </button>
        </div>

        <div class="col-6">
          <button
            (click)="showCollections = !showCollections"
            class="btn btn-special mobile-show-collections"
            type="button"
          >
            <ng-container *ngIf="!showCollections; else hideCollectionsCaption"
              >All catalogs</ng-container
            >
            <ng-template #hideCollectionsCaption>Hide catalogs</ng-template>
            <i class="bi bi-chevron-down"></i>
          </button>
        </div>
      </div>
    </div>

    <div
      [ngClass]="{
        'mobile-collections-hidden': !showCollections,
        'mobile-collections-show': showCollections
      }"
    >
      <ess-collections-navigation></ess-collections-navigation>

    </div>



    <div class="container--xxl">
      <div class="dashboard" style="position: relative">
        <div class="row" id="dashboard__main">
          <div
            class="col-sm-3 col-12 left-column"
            [ngClass]="{
              'mobile-filters-hidden': !showFilters,
              'mobile-filters-show': showFilters
            }"
            id="dashboard__filters"
          >
            <ess-filters
              *ngIf="(response?.results ?? []).length > 0"
            ></ess-filters>
          </div>

          <div class="col-sm-7 col-12 center-column">

            <ess-search-bar></ess-search-bar>

            <ess-page-header
              [resultsCount]="response?.numFound ?? 0"
              [sortByOptionOff]="
                (response?.results ?? [])[0]?.sortByOptionOff ?? false
              "
            ></ess-page-header>
            <ess-active-filters></ess-active-filters>

            <ess-results-with-pagination
              [response]="response"
            ></ess-results-with-pagination>
          </div>
          <div
            class="col-sm-2 col-12 right-column"
            *ngIf="
              (response?.results ?? []).length > 0 &&
              (response?.results ?? [])[0].type.value !== 'guideline'
            "
          >
            <h5>Nagłówek</h5>
            <ul class="right-menu">
              <li><a href="#">Polskie zespoły badawcze</a></li>
              <li><a href="#">Dostawcy usług</a></li>
              <li><a href="#">Instytucje</a></li>
              <li><a href="#">Wzorce interoperacyjności</a></li>
              <li><a href="#">Ludzie</a></li>
              <li><a href="#">Katalog Europejski</a></li>
              </ul>
          </div>
        </div>
      </div>
    </div>
    <div class="suggested" style="background-color: #EFF1FF;">
      <ess-recommendations></ess-recommendations>
    </div>
  `,
  styles: [
    `
      #dashboard__main {
        /*min-height: 900px;*/
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

      .results:last-child {
        margin-bottom: 100px;
      }

      .filters {
        padding: 0 15px 15px 15px;
      }
      .filter {
        margin-bottom: 10px;
      }
      .filter-title {
        padding-bottom: 6px;
        display: block;
      }
      .ant-tree {
        background: none !important;
      }
    `,
  ],
})
export class SearchPageComponent implements OnInit {
  public showFilters = false;
  public showCollections = false;
  response: ISearchResults<IResult> | null = null;

  constructor(
    private _customRoute: CustomRoute,
    private _router: Router,
    private _route: ActivatedRoute,
    private _fetchDataService: FetchDataService,
    private _searchMetadataRepository: SearchMetadataRepository,
    private _adaptersRepository: AdaptersRepository
  ) {}

  ngOnInit() {
    this._customRoute.params$
      .pipe(
        untilDestroyed(this),
        filter(({ collection }) => !!collection),
        switchMap((routerParams) => {
          const { collection } = routerParams;
          const metadata = this._searchMetadataRepository.get(
            collection
          ) as ICollectionSearchMetadata;
          const adapter = this._adaptersRepository.get(collection)
            ?.adapter as adapterType;
          const searchMetadata = {
            rows: MAX_COLLECTION_RESULTS,
            ...routerParams,
            ...metadata.params,
            q: queryChanger(routerParams.q),
          };
          return this._fetchDataService
            .fetchResults$(searchMetadata, metadata.facets, adapter)
            .pipe(untilDestroyed(this));
        })
      )
      .subscribe((response) => (this.response = response));

    // update on changes
    combineLatest(
      this._route.paramMap.pipe(
        untilDestroyed(this),
        map((paramMap) => paramMap.get('collection'))
      ),
      this._route.queryParamMap.pipe(untilDestroyed(this))
    )
      .pipe(
        map((params) => params[0]),
        tap((collection) =>
          this._customRoute._updateParamsBy(
            collection as string,
            this._router.url
          )
        )
      )
      .subscribe();
  }
}
