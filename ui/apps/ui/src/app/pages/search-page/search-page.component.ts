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
import { MAX_COLLECTION_RESULTS } from '@components/results-with-pagination/pagination.repository';
import { ActivatedRoute, Router } from '@angular/router';
import { combineLatest } from 'rxjs';
import { queryChanger } from '@collections/filters-serializers/utils';

@UntilDestroy()
@Component({
  selector: 'ess-search-service-page',
  template: `
    <ess-search-bar></ess-search-bar>
    <ess-collections-navigation></ess-collections-navigation>
    <div class="container--xxl">
      <div class="dashboard" style="position: relative">
        <div class="row" id="dashboard__main">
          <div class="col-sm-3 col-12 left-column" id="dashboard__filters">
            <ess-filters
              *ngIf="(response?.results ?? []).length > 0"
            ></ess-filters>
          </div>
          <div class="col-sm-7 col-12 center-column">
            <ess-page-header
              [resultsCount]="response?.numFound ?? 0"
            ></ess-page-header>
            <ess-active-filters></ess-active-filters>

            <ess-results-with-pagination
              [response]="response"
            ></ess-results-with-pagination>
          </div>
          <div class="col-sm-2 col-12 right-column">
            <h5>Suggested</h5>
            <ess-recommendations></ess-recommendations>
          </div>
        </div>
      </div>
    </div>
    <ess-interoperability-navigation-bar></ess-interoperability-navigation-bar>
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
