import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { CollectionSearchMetadata } from '../collections/collection.model';
import { IFacetResponse } from '../search-service/search-results.interface';
import { BehaviorSubject, map } from 'rxjs';
import { ActivatedRoute, Router } from '@angular/router';
import { addFq, getFqsFromUrl, removeFq } from '../search-page/utils';
import {
  FlatNode,
  TreeNode,
} from '../checkboxes-tree/checkboxes-tree.component';

interface IFilter {
  title: string;
  data: TreeNode[];
}

interface IActiveFilter {
  label: string;
  filter: string;
  value: string;
}

@Component({
  selector: 'ui-filters',
  template: `
    <section id="filters">
      <h5>Filters</h5>
      <div *ngIf="$any(activeFilters$ | async)?.length > 0" class="filter">
        <h6>Active filters</h6>
        <p
          class="badge"
          style="width: 100%; cursor: pointer"
          (click)="clearAll()"
        >
          <span><b>Clear all</b></span>
        </p>

        <div class="badge" *ngFor="let activeFilter of activeFilters$ | async">
          <span>{{ activeFilter.label }}: </span>
          <span>{{ activeFilter.value }}</span>
          <span class="close-btn" (click)="removeFilter(activeFilter)">x</span>
        </div>
      </div>
      <ui-checkboxes-tree></ui-checkboxes-tree>
      <ng-container *ngFor="let filterTree of filtersTree$ | async">
        <ng-container *ngIf="filterTree.data.length > 0">
          <div class="filter">
            <h6>{{ filterTree.title }}</h6>
            <ui-checkboxes-tree
              [data]="filterTree.data"
              (checkboxesChange)="addFilter($event)"
            ></ui-checkboxes-tree>
          </div>
        </ng-container>
      </ng-container>
    </section>
  `,
  styles: [
    `
      #filters {
        padding: 15px;
        margin-left: -15px;
        margin-bottom: 15px;
        background-color: rgba(57, 135, 190, 0.05);
      }
      .filter {
        margin-top: 10px;
      }
      .ant-tree {
        background: none !important;
      }
      .badge {
        color: rgba(0, 0, 0, 0.6);
        font-size: 12px;
        border: 1px solid rgba(0, 0, 0, 0.3);
      }
      .badge .close-btn {
        color: rgba(255, 255, 255, 0.7);
        background-color: rgba(0, 0, 0, 0.3);
        margin-left: 5px;
        margin-right: -5px;
        padding: 2px 6px;
        border-radius: 25px;
        cursor: pointer;
      }
    `,
  ],
})
export class FiltersComponent implements OnInit {
  filtersTree$ = new BehaviorSubject<IFilter[]>([]);
  filterToField$ = new BehaviorSubject<{ [filter: string]: string }>({});
  activeFilters$ = new BehaviorSubject<IActiveFilter[]>([]);

  @Output()
  filter = new EventEmitter<[string, string]>();

  // map to nz tree node options
  @Input()
  set filters(
    filters:
      | [
          CollectionSearchMetadata<any>,
          { [facetName: string]: IFacetResponse }
        ][]
      | null
  ) {
    if (!filters) {
      return;
    }
    const filtersTree: IFilter[] = [];
    this.filterToField$.next(
      filters
        .map(([collection, facets]) => collection)
        .map((collection) => collection.filterToField)
        .reduce((acc, filterToField) => ({ ...acc, ...filterToField }), {})
    );
    const fqs = getFqsFromUrl(this._router.url);
    filters.forEach(([collection, facets]) => {
      Object.keys(facets)
        .filter((facet) => collection.filterToField[facet])
        .forEach((facet) => {
          const filterName = collection.filterToField[facet];
          const existingFilter = filtersTree.find(
            (filter) => filter.title === filterName
          );
          const data = facets[facet].buckets.map(({ val, count }) => ({
            name: val + ` (${count})`,
            value: val + '',
            filter: facet,
            isSelected: fqs.some((filter) => filter === `${facet}:"${val}"`),
          }));
          if (!existingFilter) {
            filtersTree.push({
              title: filterName,
              data,
            });
          } else {
            existingFilter.data.push(...data);
          }
        });
    });
    this.filtersTree$.next(filtersTree);
  }

  constructor(private _route: ActivatedRoute, private _router: Router) {}

  ngOnInit() {
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

  addFilter = async (selected: [FlatNode, boolean]) => {
    const [node, isSelected] = selected;
    const { value, filter } = node;
    const fq = isSelected
      ? addFq(this._router.url, filter, value)
      : removeFq(this._router.url, filter, value);
    await this._router.navigate([], {
      queryParams: { fq },
      queryParamsHandling: 'merge',
    });
  };
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
