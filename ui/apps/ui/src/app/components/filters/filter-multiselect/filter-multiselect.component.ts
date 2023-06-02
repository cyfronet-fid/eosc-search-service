import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { FilterMultiselectService } from './filter-multiselect.service';
import { FilterMultiselectRepository } from './filter-multiselect.repository';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import {
  debounceTime,
  distinctUntilChanged,
  map,
  skip,
  switchMap,
  tap,
} from 'rxjs';
import { UntypedFormControl } from '@angular/forms';
import { CustomRoute } from '@collections/services/custom-route.service';
import { combineLatest } from 'rxjs';
import { Router } from '@angular/router';
import { toArray } from '@collections/filters-serializers/utils';
import { FiltersConfigsRepository } from '@collections/repositories/filters-configs.repository';
import {
  deserializeAll,
  removeFilterValue,
  serializeAll,
} from '@collections/filters-serializers/filters-serializers.utils';
import { isEqual, keyBy } from 'lodash-es';
import _ from 'lodash';
import {
  IFacetBucket,
  IFilterConfig,
  IFilterNode,
  IUIFilterTreeNode,
} from '@collections/repositories/types';
import { IFqMap } from '@collections/services/custom-route.type';

@UntilDestroy()
@Component({
  selector: 'ess-filter-multiselect',
  template: `
    <div class="filter" *ngIf="hasEntities$ | async">
      <ess-filter-label
        [label]="label"
        [filter]="filter"
        [isExpanded]="isExpanded"
        [showClearButton]="anyActive"
        [tooltipText]="tooltipText"
        (isExpandedChanged)="isExpandedChanged($event)"
      ></ess-filter-label>

      <input
        *ngIf="hasShowMore$ | async"
        [attr.placeholder]="'Search in ' + label.toLowerCase() + '...'"
        class="query-input form-control form-control-sm"
        [formControl]="queryFc"
        (keyup)="isExpanded = isExpanded || queryFc.value.length > 0"
      />

      <div *ngIf="isExpanded">
        <ess-first-n-values
          *ngIf="!showMore; else showAll"
          [allEntities]="(allEntities$ | async) ?? []"
          [query]="query"
          (toggleActive)="toggleActive($event)"
        ></ess-first-n-values>
        <ng-template #showAll>
          <ess-show-all
            *ngIf="showMore"
            [allEntities]="(allEntities$ | async) ?? []"
            [query]="query"
            (toggleActive)="toggleActive($event)"
          ></ess-show-all>
        </ng-template>
        <span *ngIf="hasShowMore$ | async" (click)="showMore = !showMore">
          <a href="javascript:void(0)" class="show-more">{{
            showMore ? 'show less' : 'show more'
          }}</a>
        </span>
      </div>

      <ng-container *ngIf="isLoading$ | async">
        <div class="mask">
          <nz-spin nzSimple></nz-spin>
        </div>
      </ng-container>
    </div>
  `,
  styles: [
    `
      .filter {
        margin-bottom: 10px;
        padding-bottom: 5px;
        position: relative;
        border-bottom: 1px solid #d9dee2;
      }
      .query-input {
        margin-bottom: 12px;
      }
      .mask {
        width: 100%;
        height: 100%;
        position: absolute;
        background-color: rgba(255, 255, 255, 0.7);
        text-align: center;
        top: 0;
        display: flex;
        flex-direction: column;
        justify-content: center;
        justify-items: center;
      }
    `,
  ],
  providers: [FilterMultiselectService, FilterMultiselectRepository],
})
export class FilterMultiselectComponent implements OnInit {
  @ViewChild('content', { static: false }) content?: unknown;

  @Input()
  isExpanded!: boolean;

  @Input()
  label!: string;

  @Input()
  filter!: string;

  @Input()
  tooltipText!: string;

  @Input()
  onValuesFetch?: (bucketValues: IFacetBucket[]) => IFilterNode[];

  isLoading$ = this._filterMultiselectService.isLoading$;
  entitiesCount$ = this._filterMultiselectService.entitiesCount$;
  hasEntities$ = this._filterMultiselectService.hasEntities$;

  allEntities$ = this._filterMultiselectService.allEntities$;

  showMore = false;
  hasShowMore$ = this._filterMultiselectService.hasShowMore$;

  queryFc = new UntypedFormControl('');
  query: string | null = null;

  anyActive = false;

  constructor(
    private _customRoute: CustomRoute,
    private _router: Router,
    private _filtersConfigsRepository: FiltersConfigsRepository,
    private _filterMultiselectService: FilterMultiselectService
  ) {}

  ngOnInit() {
    this._initFilterValues();
    this._recalculateOnChanges();
    this._setActiveIds();
    this._updateSearchQuery();
  }

  async toggleActive(changes: [IUIFilterTreeNode, boolean][]) {
    const allFilters = this._filtersConfigsRepository.get(
      this._customRoute.collection()
    ).filters;
    let fqMap = serializeAll(this._customRoute.fq(), allFilters);

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const filtersToRemove = changes.filter(([_, isSelected]) => !isSelected);
    for (const toRemove of filtersToRemove) {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const [{ filter, value }, _] = toRemove;
      const fq = removeFilterValue(fqMap, filter, value, allFilters);
      fqMap = serializeAll(fq, allFilters);
    }

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const filtersToAdd = changes.filter(([_, isSelected]) => isSelected);
    for (const toAdd of filtersToAdd) {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const [{ filter, value }, _] = toAdd;
      const fq = this._addFilterValue(fqMap, allFilters, filter, value);
      fqMap = serializeAll(fq, allFilters);
    }

    await this._router.navigate([], {
      queryParams: {
        fq: deserializeAll(fqMap, allFilters),
      },
      queryParamsHandling: 'merge',
    });
  }

  _setActiveIds() {
    this._customRoute.fqMap$
      .pipe(
        untilDestroyed(this),
        skip(1),
        map((fqMap) => toArray(fqMap[this.filter])),
        distinctUntilChanged(isEqual)
      )
      .subscribe((activeIds) => {
        const activeIdsArr = toArray(activeIds);
        this.anyActive = activeIdsArr.length > 0;
        this._filterMultiselectService.setActiveIds(activeIdsArr);
      });
  }

  _recalculateOnChanges() {
    combineLatest(
      this._customRoute
        .fqWithExcludedFilter$(this.filter)
        .pipe(untilDestroyed(this)),
      this._customRoute.q$.pipe(untilDestroyed(this))
    )
      .pipe(
        untilDestroyed(this),
        skip(1),
        tap(() => {
          this._filterMultiselectService.setLoading(true);
        }),
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        map(([fq, _]) => fq),
        switchMap((fq) =>
          this._filterMultiselectService
            ._fetchCounts$(
              this.filter,
              {
                ...this._customRoute.params(),
                fq,
              },
              this.onValuesFetch
            )
            .pipe(untilDestroyed(this))
        )
      )
      .subscribe((entities) => {
        this._filterMultiselectService.updateEntitiesCounts(
          entities as IFilterNode[]
        );
        this._filterMultiselectService.setLoading(false);
      });
  }
  _initFilterValues() {
    this._filterMultiselectService.setLoading(true);
    combineLatest(
      this._filterMultiselectService
        ._fetchAllValues$(
          this.filter,
          this._customRoute.params()['collection'] as string,
          this.onValuesFetch
        )
        .pipe(untilDestroyed(this)),
      this._filterMultiselectService
        ._fetchCounts$(
          this.filter,
          {
            ...this._customRoute.params(),
            fq: this._customRoute.fqWithExcludedFilter(this.filter),
          },
          this.onValuesFetch
        )
        .pipe(untilDestroyed(this))
    )
      .pipe(
        untilDestroyed(this),
        map(
          ([allValues, counts]) =>
            _(allValues)
              .keyBy('id')
              .merge(keyBy(counts, 'id'))
              .values()
              .value() as IFilterNode[]
        )
      )
      .subscribe((entities) => {
        const activeIds = toArray(this._customRoute.fqMap()[this.filter]);
        this.anyActive = activeIds.length > 0;
        this._filterMultiselectService.setEntities(entities);
        this._filterMultiselectService.setActiveIds(activeIds);
        this._filterMultiselectService.setLoading(false);
      });
  }

  _updateSearchQuery() {
    this.queryFc.valueChanges
      .pipe(untilDestroyed(this), debounceTime(500))
      .subscribe((query) => (this.query = query));
  }

  _addFilterValue(
    fqMap: IFqMap,
    allFilters: IFilterConfig[],
    filterName: string,
    value: string
  ): string[] {
    if (
      !!fqMap[filterName] &&
      (fqMap[filterName] as string[]).includes(value)
    ) {
      return deserializeAll(fqMap, allFilters);
    }

    fqMap[filterName] = fqMap[filterName]
      ? ([...fqMap[filterName], value] as string[])
      : [value];
    return deserializeAll(fqMap, allFilters);
  }

  isExpandedChanged(newExpanded: boolean) {
    this.isExpanded = newExpanded;
  }
}
