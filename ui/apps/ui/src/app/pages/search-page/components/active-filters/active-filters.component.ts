import {Component, Input, OnInit} from '@angular/core';
import {BehaviorSubject, map} from "rxjs";
import {getFqsFromUrl, removeFq} from "@eosc-search-service/search";
import {ActivatedRoute, Router} from "@angular/router";
import { ICollectionSearchMetadata } from '../../../../../../../../libs/search/src/lib/state/results/results.service';
import {IActiveFilter, IFilterConfiguration} from "@eosc-search-service/common";

@Component({
  selector: 'ess-active-filters',
  template: `
    <section *ngIf="$any(activeFilters$ | async)?.length > 0 || (q$ | async) !== '*'" class="filters">
      <span
        *ngIf="$any(activeFilters$ | async)?.length > 0"
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
        <span class="close-btn btn-primary" (click)="removeFilter(activeFilter)">x</span>
      </div>
    </section>
  `,
  styles: [`

  `]
})
export class ActiveFiltersComponent implements OnInit {
  filtersConfigurations$ = new BehaviorSubject<IFilterConfiguration[]>([]);
  activeFilters$ = new BehaviorSubject<IActiveFilter[]>([]);
  q$ = this._route.queryParamMap
    .pipe(map(params => params.get('q')))

  constructor(private _route: ActivatedRoute, private _router: Router) { }

  @Input()
  set collections(collections: ICollectionSearchMetadata[] | null) {
    this.filtersConfigurations$.next(
      (collections || [])
        .map((collection) => collection.filtersConfigurations)
        .reduce((acc, filterConfigurations) => [ ...acc, ...filterConfigurations ], [])
    );
  }

  ngOnInit(): void {
    this._route.queryParamMap
      .pipe(
        map(() => getFqsFromUrl(this._router.url)),
        map((fqs) => fqs.map((fq) => fq.split(':') as [string, string])),
        map((filtersValues) =>
          filtersValues.map(([activeFilter, value]) => ({
            ...this.filtersConfigurations$.getValue().find(({ filter }) => filter === activeFilter),
            value,
          } as IActiveFilter))
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
