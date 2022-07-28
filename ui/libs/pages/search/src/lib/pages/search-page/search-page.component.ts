import {
  Component,
  Inject,
  OnInit,
  TrackByFunction,
  ViewChild,
} from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { combineLatest, map, Observable, switchMap, tap } from 'rxjs';
import {
  FiltersRepository,
  FiltersService,
  ICollectionSearchMetadata,
  IFilter,
  IPage,
  ISet,
  PrimaryResultsRepository,
  PrimaryResultsService,
  SEARCH_SET_LIST,
} from '@eosc-search-service/search';
import { CdkVirtualScrollViewport } from '@angular/cdk/scrolling';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { CategoriesRepository } from '@eosc-search-service/common';
import { IHasId } from '@eosc-search-service/types';

@UntilDestroy()
@Component({
  selector: 'ess-search-service-page',
  templateUrl: './search-page.component.html',
  styleUrls: ['./search-page.component.scss'],
})
export class SearchPageComponent implements OnInit {
  @ViewChild(CdkVirtualScrollViewport, { static: false })
  viewport?: CdkVirtualScrollViewport;
  results$ = this._resultsRepository.results$;
  categories: any[] = [];
  collection$: Observable<ICollectionSearchMetadata> = this._route.data.pipe(
    map((data) => data['activeSet'] as ISet),
    map((set) => set.collection)
  );
  filters$: Observable<Array<IFilter & IHasId>> =
    this._filtersRepository.entries$;
  // loadNextPage$ = new BehaviorSubject<void>(undefined);
  resultsCount$ = this._resultsRepository.maxResults$;
  activeSet$ = this._route.data.pipe(map((data) => data['activeSet']));
  loading$ = this._resultsRepository.loading$;
  pages$: Observable<IPage[]> = this._resultsRepository.pages$;
  activePage$: Observable<number | null> = this._route.queryParams.pipe(
    map((params) => Number(params['page']) || 0)
  );
  maxPage$ = this._resultsRepository.maxPage$;

  currentCategories$ = this._categoriesRepository.currentCategories$;
  activeId$ = this._categoriesRepository.activeId$;
  categoriesTree$ = this._categoriesRepository.tree$;

  readonly trackById: TrackByFunction<IHasId> = (index: number, item: IHasId) =>
    item.id;

  constructor(
    private _route: ActivatedRoute,
    //refactor new services
    private _resultsService: PrimaryResultsService,
    private _resultsRepository: PrimaryResultsRepository,
    private _filtersRepository: FiltersRepository,
    private _filtersService: FiltersService,
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
      .subscribe(({ categories }) =>
        this._categoriesRepository.setCategories(categories ?? [])
      );
  }

  selectPage(page: number) {
    this._resultsService.loadPage$(page).subscribe();
  }

  toggleShowMore(id: string) {
    combineLatest({
      params: this._route.queryParams,
      activeSet: this._route.data.pipe(
        map((data) => data['activeSet'] as ISet)
      ),
    })
      .pipe(
        switchMap(({ params, activeSet }) =>
          this._filtersService.showMore$(id, params, activeSet)
        )
      )
      .subscribe();
  }

  searchFilter(id: string, query: string) {
    combineLatest({
      params: this._route.queryParams,
      activeSet: this._route.data.pipe(
        map((data) => data['activeSet'] as ISet)
      ),
    })
      .pipe(
        switchMap(({ params, activeSet }) =>
          this._filtersService.searchFilters$(id, query, params, activeSet)
        )
      )
      .subscribe();
  }

  filterFetchMore(id: string, query: string) {
    combineLatest({
      params: this._route.queryParams,
      activeSet: this._route.data.pipe(
        map((data) => data['activeSet'] as ISet)
      ),
    })
      .pipe(
        switchMap(({ params, activeSet }) =>
          this._filtersService.searchFilters$(
            id,
            query,
            params,
            activeSet,
            true
          )
        )
      )
      .subscribe();
  }
}
