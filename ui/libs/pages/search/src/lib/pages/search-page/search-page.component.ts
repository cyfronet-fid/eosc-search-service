import { Component, Inject, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import {combineLatest, map, Observable, switchMap, tap} from 'rxjs';
import {
  FiltersRepository, FiltersService,
  ICollectionSearchMetadata, IPage,
  ISet,
  PrimaryResultsRepository,
  PrimaryResultsService,
  SEARCH_SET_LIST,
} from '@eosc-search-service/search';
import { CdkVirtualScrollViewport } from '@angular/cdk/scrolling';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { ICollectionSearchMetadata, PrimaryResultsService } from '../../../../../../search/src/lib/state/results/results.service';
import {CategoriesRepository} from "@eosc-search-service/common";

@UntilDestroy()
@Component({
  selector: 'ess-search-service-page',
  templateUrl: './search-page.component.html',
  styleUrls: ['./search-page.component.scss']
})
export class SearchPageComponent implements OnInit {
  @ViewChild(CdkVirtualScrollViewport, { static: false })
  viewport?: CdkVirtualScrollViewport;
  results$ = this._resultsRepository.results$;
  categories: any[] = [];
  collections$: Observable<ICollectionSearchMetadata[]> = this._route.data.pipe(
    map((data) => data['activeSet'] as ISet),
    map((set) => set.collections)
  );
  filters$ = this._filtersRepository.entries$.pipe(
    tap((f) => console.log('filters', f))
  );
  // loadNextPage$ = new BehaviorSubject<void>(undefined);
  resultsCount$ = this._resultsRepository.maxResults$;
  activeSet$ = this._route.data.pipe(map((data) => data['activeSet']));
  loading$ = this._resultsRepository.loading$;
  pages$: Observable<IPage[]> = this._resultsRepository.pages$;
  activePage$: Observable<number | null> = this._route.queryParams.pipe(map(params => Number(params["page"]) || 0));
  maxPage$ = this._resultsRepository.maxPage$;

  currentCategories$ = this._categoriesRepository.currentCategories$;
  activeId$ = this._categoriesRepository.activeId$;
  categoriesTree$ = this._categoriesRepository.tree$;

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
      .subscribe(({ categories }) => this._categoriesRepository.setCategories(categories));
  }

  selectPage(page: number) {
    this._resultsService.loadPage$(page).subscribe();
  }

  toggleShowMore(id: string) {
    this._filtersService.showMore$(id).subscribe();
  }

  searchFilter(id: string, query: string) {
    combineLatest({
      params: this._route.queryParams,
      activeSet: this._route.data.pipe(map((data) => data['activeSet'] as ISet)),
    }).pipe(
      switchMap(({params, activeSet}) => this._filtersService.searchFilters$(id, query, params, activeSet))
    ).subscribe();
  }
}
