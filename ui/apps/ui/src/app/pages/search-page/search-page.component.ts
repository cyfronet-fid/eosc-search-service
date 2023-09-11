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
import {
  queryChanger,
  queryChangerAdv,
} from '@collections/filters-serializers/utils';

@UntilDestroy()
@Component({
  selector: 'ess-search-service-page',
  template: `
    <ess-search-bar></ess-search-bar>
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
            <ess-filters [results]="response?.results"></ess-filters>
          </div>
          <div class="col-sm-7 col-12 center-column">
            <ess-page-header
              [isSortCollectionScopeOff]="
                (response?.results ?? [])[0]?.isSortCollectionScopeOff ?? false
              "
              [resultsCount]="response?.numFound ?? 0"
              [isSortByRelevanceCollectionScopeOff]="
                (response?.results ?? [])[0]
                  ?.isSortByRelevanceCollectionScopeOff ?? false
              "
            ></ess-page-header>
            <ess-active-filters></ess-active-filters>
            <ess-results-with-pagination
              [response]="response"
            ></ess-results-with-pagination>
          </div>
          <div class="col-sm-2 col-12 right-column">
            <h5>Browse also</h5>
            <ess-right-menu></ess-right-menu>
          </div>
          <!-- <div
            class="col-sm-2 col-12 right-column"
            *ngIf="
              (response?.results ?? []).length > 0 &&
              (response?.results ?? [])[0].type.value !== 'guideline'
            "
          >
            <h5>Suggested</h5>
            <ess-recommendations></ess-recommendations>
          </div> -->
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

  generatePermutations(words: string[]): string[] {
    const permutations: string[] = [];
    function backtrack(startIndex: number) {
      if (startIndex === words.length - 1) {
        permutations.push(words.join(' '));
        return;
      }

      for (let i = startIndex; i < words.length; i++) {
        [words[startIndex], words[i]] = [words[i], words[startIndex]]; // Swap words
        backtrack(startIndex + 1);
        [words[startIndex], words[i]] = [words[i], words[startIndex]]; // Restore original order
      }
    }

    backtrack(0);
    return permutations;
  }

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
          if (routerParams.standard.toString() === 'true') {
            const searchMetadata = {
              rows: MAX_COLLECTION_RESULTS,
              ...routerParams,
              ...metadata.params,
              exact:
                routerParams.exact.toString() === 'true' ? 'true' : 'false',
              q: queryChanger(
                routerParams.q,
                routerParams.exact.toString() === 'true'
              ),
            };

            return this._fetchDataService
              .fetchResults$(searchMetadata, metadata.facets, adapter)
              .pipe(untilDestroyed(this));
          } else {
            let filters: string[] = [];

            const authors: number[] = [];
            const exacts: number[] = [];
            const titles: number[] = [];
            const keywords: number[] = [];
            const allIndexes: number[] = [];

            const fq_o: string[] = routerParams.fq;
            const radioValueAuthor: string = routerParams.radioValueAuthor;
            const radioValueExact: string = routerParams.radioValueExact;
            const radioValueTitle: string = routerParams.radioValueTitle;
            const radioValueKeyword: string = routerParams.radioValueKeyword;

            if (Array.isArray(routerParams.tags)) {
              for (const tag of routerParams.tags) {
                if (tag.startsWith('author:')) {
                  const aut = tag.split(':', 2)[1].trim();
                  const splitted = aut.split(' ');
                  const query_param: string[] = [];
                  splitted.forEach((el: string) => {
                    if (el.trim() !== '') {
                      query_param.push(el.trim());
                    }
                  });
                  const res_permuted = this.generatePermutations(query_param);
                  if (res_permuted.length === 1) {
                    filters.push(
                      'author_names_tg:"' + res_permuted[0].trim() + '"'
                    );
                    authors.push(filters.length - 1);
                  } else {
                    // We need OR case
                    let fin = '';
                    res_permuted.forEach((el: string) => {
                      fin += 'author_names_tg:"' + el.trim() + '"' + ' OR ';
                    });
                    filters.push(fin.slice(0, fin.length - 4));
                    authors.push(filters.length - 1);
                  }
                }
                if (tag.startsWith('exact:')) {
                  filters.push(
                    'title:"' +
                      tag.split(':', 2)[1].trim() +
                      '" OR author_names_tg:"' +
                      tag.split(':', 2)[1].trim() +
                      '" OR description:"' +
                      tag.split(':', 2)[1].trim() +
                      '" OR keywords_tg:"' +
                      tag.split(':', 2)[1].trim() +
                      '" OR tag_list_tg:"' +
                      tag.split(':', 2)[1].trim() +
                      '"'
                  );
                  exacts.push(filters.length - 1);
                }
                if (tag.startsWith('none of:')) {
                  filters.push('!title:"' + tag.split(':', 2)[1].trim() + '"');
                  filters.push(
                    '!author_names_tg:"' + tag.split(':', 2)[1].trim() + '"'
                  );
                  filters.push(
                    '!description:"' + tag.split(':', 2)[1].trim() + '"'
                  );
                  filters.push(
                    '!keywords_tg:"' + tag.split(':', 2)[1].trim() + '"'
                  );
                  filters.push(
                    '!tag_list_tg:"' + tag.split(':', 2)[1].trim() + '"'
                  );
                }
                if (tag.startsWith('in title:')) {
                  filters.push('title:"' + tag.split(':', 2)[1].trim() + '"');
                  titles.push(filters.length - 1);
                }
                if (tag.startsWith('keyword:')) {
                  filters.push(
                    'keywords_tg:"' + tag.split(':', 2)[1].trim() + '"'
                  );
                  keywords.push(filters.length - 1);
                }
                if (tag.startsWith('tagged:')) {
                  filters.push(
                    'tag_list_tg:"' + tag.split(':', 2)[1].trim() + '"'
                  );
                  keywords.push(filters.length - 1);
                }
              }
            } else {
              const tag: string = routerParams.tags;
              if (tag.startsWith('author:')) {
                const aut = tag.split(':', 2)[1].trim();
                const splitted = aut.split(' ');
                const query_param: string[] = [];
                splitted.forEach((el: string) => {
                  if (el.trim() !== '') {
                    query_param.push(el.trim());
                  }
                });
                const res_permuted = this.generatePermutations(query_param);
                if (res_permuted.length === 1) {
                  filters.push(
                    'author_names_tg:"' + res_permuted[0].trim() + '"'
                  );
                  authors.push(filters.length - 1);
                } else {
                  // We need OR case
                  let fin = '';
                  res_permuted.forEach((el: string) => {
                    fin += 'author_names_tg:"' + el.trim() + '"' + ' OR ';
                  });
                  filters.push(fin.slice(0, fin.length - 4));
                  authors.push(filters.length - 1);
                }
              }
              if (tag.startsWith('exact:')) {
                filters.push(
                  'title:"' +
                    tag.split(':', 2)[1].trim() +
                    '" OR author_names_tg:"' +
                    tag.split(':', 2)[1].trim() +
                    '" OR description:"' +
                    tag.split(':', 2)[1].trim() +
                    '" OR keywords_tg:"' +
                    tag.split(':', 2)[1].trim() +
                    '" OR tag_list_tg:"' +
                    tag.split(':', 2)[1].trim() +
                    '"'
                );
                exacts.push(filters.length - 1);
              }
              if (tag.startsWith('none of:')) {
                filters.push('!title:"' + tag.split(':', 2)[1].trim() + '"');
                filters.push(
                  '!author_names_tg:"' + tag.split(':', 2)[1].trim() + '"'
                );
                filters.push(
                  '!description:"' + tag.split(':', 2)[1].trim() + '"'
                );
                filters.push(
                  '!keywords_tg:"' + tag.split(':', 2)[1].trim() + '"'
                );
                filters.push(
                  '!tag_list_tg:"' + tag.split(':', 2)[1].trim() + '"'
                );
              }
              if (tag.startsWith('in title:')) {
                filters.push('title:"' + tag.split(':', 2)[1].trim() + '"');
                titles.push(filters.length - 1);
              }
              if (tag.startsWith('keyword:')) {
                filters.push(
                  'keywords_tg:"' + tag.split(':', 2)[1].trim() + '"'
                );
                keywords.push(filters.length - 1);
              }
              if (tag.startsWith('tagged:')) {
                filters.push(
                  'tag_list_tg:"' + tag.split(':', 2)[1].trim() + '"'
                );
                keywords.push(filters.length - 1);
              }
            }

            if (radioValueAuthor === 'B') {
              let new_aut = '';
              for (const author of authors) {
                new_aut += filters[author] + ' OR ';
                allIndexes.push(author);
              }
              new_aut = new_aut.slice(0, new_aut.length - 4);
              filters.push(new_aut);
            }
            if (radioValueExact === 'B') {
              let new_exc = '';
              for (const exactel of exacts) {
                new_exc += filters[exactel] + ' OR ';
                allIndexes.push(exactel);
              }
              new_exc = new_exc.slice(0, new_exc.length - 4);
              filters.push(new_exc);
            }
            if (radioValueTitle === 'B') {
              let new_title = '';
              for (const exactit of titles) {
                new_title += filters[exactit] + ' OR ';
                allIndexes.push(exactit);
              }
              new_title = new_title.slice(0, new_title.length - 4);
              filters.push(new_title);
            }
            if (radioValueKeyword === 'B') {
              let new_keyword = '';
              for (const keywordel of keywords) {
                new_keyword += filters[keywordel] + ' OR ';
                allIndexes.push(keywordel);
              }
              new_keyword = new_keyword.slice(0, new_keyword.length - 4);
              filters.push(new_keyword);
            }

            filters = filters.filter(
              (value, index) => !allIndexes.includes(index)
            );

            const fq_m = filters.concat(fq_o);

            const searchMetadata = {
              rows: MAX_COLLECTION_RESULTS,
              ...routerParams,
              ...metadata.params,
              exact:
                routerParams.exact.toString() === 'true' ? 'true' : 'false',
              q: queryChangerAdv(
                routerParams.q,
                routerParams.exact.toString() === 'true'
              ),
              fq: fq_m,
            };
            return this._fetchDataService
              .fetchResultsAdv$(searchMetadata, metadata.facets, adapter)
              .pipe(untilDestroyed(this));
          }
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
