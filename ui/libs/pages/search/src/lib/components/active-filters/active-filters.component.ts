import {Component, Input, OnInit} from '@angular/core';
import {BehaviorSubject, map} from "rxjs";
import {getFqsFromUrl, removeFq} from "@eosc-search-service/search";
import {ActivatedRoute, Router} from "@angular/router";
import {ICollectionSearchMetadata} from "../../../../../../search/src/lib/state/results/results.service";


interface IActiveFilter {
  label: string;
  filter: string;
  value: string;
}

@Component({
  selector: 'ess-active-filters',
  template: `
    <section *ngIf="$any(activeFilters$ | async)?.length > 0 || (q$ | async) !== '*'" id="filters">
      <span
        id="clear-all-badge"
        class="btn btn-primary"
        style="cursor: pointer"
        (click)="clearAll()"
      >
        Clear all filters
      </span>

      <div class="badge" *ngIf="(q$ | async) !== '*'">
        <span>Searched phrase: </span>
        <span><i>"{{ q$ | async }}" </i></span>
        <span class="close-btn btn-primary" (click)="clearQuery()">x</span>
      </div>
      <div class="badge" *ngFor="let activeFilter of activeFilters$ | async">
        <span>{{ activeFilter.label }}: </span>
        <span><i>{{ activeFilter.value }} </i></span>
        <span class="close-btn" (click)="removeFilter(activeFilter)">x</span>
      </div>
    </section>
  `,
  styles: [`

  `]
})
export class ActiveFiltersComponent implements OnInit {
  filterToField$ = new BehaviorSubject<{ [filter: string]: string }>({});
  activeFilters$ = new BehaviorSubject<IActiveFilter[]>([]);
  q$ = this._route.queryParamMap
    .pipe(map(params => params.get('q')))

  constructor(private _route: ActivatedRoute, private _router: Router) { }

  @Input()
  set collections(collections: ICollectionSearchMetadata[] | null) {
    this.filterToField$.next(
      (collections || [])
        .map((collection) => collection.filterToField)
        .reduce((acc, filterToField) => ({ ...acc, ...filterToField }), {})
    );
  }

  ngOnInit(): void {
    this._route.queryParamMap
      .pipe(
        map(() => getFqsFromUrl(this._router.url)),
        map((fqs) => fqs.map((fq) => fq.split(':') as [string, string])),
        map((filtersValues) =>
          filtersValues.map(([filter, value]) => ({
            label: this.filterToField$.getValue()[filter],
            filter,
            value,
          }))
        )
      )
      .subscribe((activeFilters: IActiveFilter[]) =>
        this.activeFilters$.next(activeFilters)
      );
  }
  removeFilter = async (activeFilter: IActiveFilter) => {
    const { filter, value } = activeFilter;
    await this._router.navigate([], {
      queryParams: { fq: removeFq(this._router.url, filter, value) },
      queryParamsHandling: 'merge',
    });
  };
  clearAll = async () => {
    await this._router.navigate([], {
      queryParams: { fq: null },
      queryParamsHandling: 'merge',
    });
  };
  clearQuery = async () => {
    await this._router.navigate([], {
      queryParams: { q: '*' },
      queryParamsHandling: 'merge'
    })
  }
}
