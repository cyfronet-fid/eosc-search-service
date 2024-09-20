import { Component, OnInit } from '@angular/core';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { combineLatest, filter, forkJoin, map, switchMap, tap } from 'rxjs';
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
import { ActivatedRoute, Router } from '@angular/router';
import { ICustomRouteProps } from '@collections/services/custom-route.type';
import { FiltersConfigsRepository } from '@collections/repositories/filters-configs.repository';
import {
  constructAdvancedSearchMetadata,
  constructStandardSearchMetadata,
} from '@pages/search-page/utils';
import { SPECIAL_COLLECTIONS } from '@collections/data/config';
import { ConfigService } from '../../services/config.service';

@UntilDestroy()
@Component({
  selector: 'ess-search-service-page',
  templateUrl: './search-page.component.html',
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
      .search-page-container {
        position: relative;
      }

      .feedback-panel {
        position: fixed;
        bottom: 20px;
        right: 20px;
        z-index: 1000;
      }
    `,
  ],
})
export class SearchPageComponent implements OnInit {
  public showFilters = false;
  public showCollections = false;
  response: ISearchResults<IResult> | null = null;
  public clearAll = false;
  isSpecialCollection = false;
  knowledgeHubUrl = this._configService.get().knowledge_hub_url;
  marketplaceUrl = this._configService.get().eu_marketplace_url;

  constructor(
    private _customRoute: CustomRoute,
    private _router: Router,
    private _route: ActivatedRoute,
    private _fetchDataService: FetchDataService,
    private _searchMetadataRepository: SearchMetadataRepository,
    private _adaptersRepository: AdaptersRepository,
    private _filterConfigsRepository: FiltersConfigsRepository,
    private _configService: ConfigService
  ) {}

  ngOnInit() {
    this._customRoute.collection$.subscribe((val) => {
      this.isSpecialCollection = SPECIAL_COLLECTIONS.includes(val);
    });

    combineLatest([
      this._route.paramMap.pipe(map((paramMap) => paramMap.get('collection'))),
      this._route.queryParamMap,
    ])
      .pipe(
        map((params) => params[0]),
        map((collection) =>
          this._customRoute._updateParamsBy(
            collection as string,
            this._router.url
          )
        ),
        filter(({ collection }) => !!collection),
        switchMap((routerParams) => {
          const { collection, q, fq } = routerParams;
          const metadata = this._searchMetadataRepository.get(
            collection
          ) as ICollectionSearchMetadata;
          const adapter = this._adaptersRepository.get(collection)
            ?.adapter as adapterType;
          this.response = null;
          const scope = routerParams.scope.toString();
          const resultsRequest$ =
            routerParams.standard.toString() === 'true'
              ? this._fetchStandardResults$(routerParams, metadata, adapter)
              : this._fetchAdvancedResults$(routerParams, metadata, adapter);
          return forkJoin({
            response: resultsRequest$,
            filters: this._customRoute.fetchFilters$(
              q,
              fq,
              collection as string,
              scope
            ),
          });
        }),
        tap(({ response }) => (this.response = response)),
        untilDestroyed(this)
      )
      .subscribe();
  }

  private _fetchStandardResults$(
    routerParams: ICustomRouteProps,
    metadata: ICollectionSearchMetadata,
    adapter: adapterType
  ) {
    const searchMetadata = constructStandardSearchMetadata(
      routerParams,
      metadata
    );

    return this._fetchDataService.fetchResults$(
      searchMetadata,
      metadata.facets,
      adapter
    );
  }

  private _fetchAdvancedResults$(
    routerParams: ICustomRouteProps,
    metadata: ICollectionSearchMetadata,
    adapter: adapterType
  ) {
    const searchMetadata = constructAdvancedSearchMetadata.call(
      this,
      routerParams,
      metadata
    );
    return this._fetchDataService.fetchResultsAdv$(
      searchMetadata,
      metadata.facets,
      adapter
    );
  }
}
