import {Component, Input, OnInit} from '@angular/core';
import {BehaviorSubject, map} from "rxjs";
import {getFqsFromUrl, removeFq} from "@eosc-search-service/search";
import {ActivatedRoute, Router} from "@angular/router";
import { CollectionSearchMetadata } from '../../../../../../search/src/lib/collections/collection.model';


interface IActiveFilter {
  label: string;
  filter: string;
  value: string;
}

@Component({
  selector: 'ess-active-filters',
  template: `
    <section *ngIf="$any(activeFilters$ | async)?.length > 0" id="filters">
      <span
        id="clear-all-badge"
        style="cursor: pointer"
        (click)="clearAll()"
      >
        Clear all filters
      </span>

      <div class="badge" *ngFor="let activeFilter of activeFilters$ | async">
        <span>{{ activeFilter.label }}: </span>
        <span><i>{{ activeFilter.value }} </i></span>
        <span class="close-btn" (click)="removeFilter(activeFilter)">x</span>
      </div>
    </section>
  `,
  styles: [`
    #filters {
      margin-bottom: 15px;
    }
    .ant-tree {
      background: none !important;
    }
    #clear-all-badge {
      background-color: #0b5ed7;
      font-size: 14px;
      padding: 14px;
      border: 1px solid rgba(0, 0, 0, 0.3);
      color: rgba(0, 0, 0, 0.6);
      border-radius: .25rem;
      color: #fff;
      font-weight: bold;
      margin-right: 8px;
      margin-bottom: 8px;
    }
    .badge {
      color: rgba(0, 0, 0, 0.6);
      margin-right: 8px;
      margin-bottom: 8px;
      font-size: 14px;
      padding: 14px 52px 14px 14px;
      border: 1px solid rgba(0, 0, 0, 0.3);
      position: relative;
    }
    .badge .close-btn {
       cursor: pointer;
       background-color: #0b5ed7;
       color: #fff;
       font-size: 14px;
       position: absolute;
       right: -1px;
       border-radius: 0 0.25rem 0.25rem 0;
       top: -1px;
       padding: 15px 17px;
    }
  `]
})
export class ActiveFiltersComponent implements OnInit {
  filterToField$ = new BehaviorSubject<{ [filter: string]: string }>({});
  activeFilters$ = new BehaviorSubject<IActiveFilter[]>([]);
  constructor(private _route: ActivatedRoute, private _router: Router) { }

  @Input()
  set collections(collections: CollectionSearchMetadata<any>[] | null) {
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
}
