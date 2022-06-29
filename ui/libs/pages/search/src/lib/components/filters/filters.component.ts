import {Component, EventEmitter, Input, Output} from '@angular/core';
import {addFq, getFqsFromUrl, IFacetResponse, removeFq} from '@eosc-search-service/search';
import {BehaviorSubject} from 'rxjs';
import {ActivatedRoute, Router} from '@angular/router';
import {FlatNode, TreeNode,} from '@eosc-search-service/layout';
import { ICollectionSearchMetadata } from '../../../../../../search/src/lib/state/results/results.service';

interface IFilter {
  title: string;
  data: TreeNode[];
}

@Component({
  selector: 'ess-filters',
  template: `
    <section class="filters">
      <h5>Filters</h5>
      <ess-checkboxes-tree></ess-checkboxes-tree>
      <ng-container *ngFor="let filterTree of filtersTree$ | async">
        <ng-container *ngIf="filterTree.data.length > 0">
          <div class="filter">
            <span class="filter-title"><b>{{ filterTree.title }}</b></span>
            <ess-checkboxes-tree
              [data]="filterTree.data"
              (checkboxesChange)="addFilter($event)"
            ></ess-checkboxes-tree>
          </div>
        </ng-container>
      </ng-container>
    </section>
  `,
  styles: [
    `
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
export class FiltersComponent {
  filtersTree$ = new BehaviorSubject<IFilter[]>([]);
  filterToField$ = new BehaviorSubject<{ [filter: string]: string }>({});

  @Output()
  filter = new EventEmitter<[string, string]>();

  // map to nz tree node options
  @Input()
  set filters(
    filters:
      | [
          ICollectionSearchMetadata,
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
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
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
            name: val + '',
            value: val + '',
            count: count + '',
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

}
