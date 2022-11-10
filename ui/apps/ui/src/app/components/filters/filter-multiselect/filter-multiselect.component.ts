import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { FilterMultiselectService } from './filter-multiselect.service';
import { FilterTreeNode } from '../types';
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
} from '@collections/filters-serializers/filters-serializers.utils';
import { isEqual, keyBy } from 'lodash-es';
import _ from 'lodash';

@UntilDestroy()
@Component({
  selector: 'ess-filter-multiselect',
  template: `
    <div class="filter" *ngIf="hasEntities$ | async">
      <ess-filter-label [label]="label" [filter]="filter"></ess-filter-label>

      <input
        *ngIf="hasShowMore$ | async"
        [attr.placeholder]="'Search in ' + label.toLowerCase() + '...'"
        class="query-input form-control form-control-sm"
        [formControl]="queryFc"
      />
      <ess-first-n-values
        *ngIf="!showMore; else showAll"
        [activeEntities]="(activeEntities$ | async) ?? []"
        [nonActiveEntities]="(nonActiveEntities$ | async) ?? []"
        [query]="query"
        (toggleActive)="toggleActive($event)"
      ></ess-first-n-values>
      <ng-template #showAll>
        <ess-show-all
          *ngIf="showMore"
          [activeEntities]="(activeEntities$ | async) ?? []"
          [nonActiveEntities]="(nonActiveEntities$ | async) ?? []"
          [query]="query"
          (toggleActive)="toggleActive($event)"
        ></ess-show-all>
      </ng-template>
      <span *ngIf="hasShowMore$ | async" (click)="showMore = !showMore">
        <a href="javascript:void(0)" class="show-more">{{
          showMore ? 'show less' : 'show more'
        }}</a>
      </span>

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
        position: relative;
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
  label!: string;

  @Input()
  filter!: string;

  isLoading$ = this._filterMultiselectService.isLoading$;
  entitiesCount$ = this._filterMultiselectService.entitiesCount$;
  hasEntities$ = this._filterMultiselectService.hasEntities$;

  activeEntities$ = this._filterMultiselectService.activeEntities$;
  nonActiveEntities$ = this._filterMultiselectService.nonActiveEntities$;

  showMore = false;
  hasShowMore$ = this._filterMultiselectService.hasShowMore$;

  queryFc = new UntypedFormControl('');
  query: string | null = null;

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

  async toggleActive(event: [FilterTreeNode, boolean]) {
    const [node, currentIsSelected] = event;
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { filter: _, value, isSelected } = node;
    if (isSelected === currentIsSelected) {
      return;
    }

    if (currentIsSelected) {
      await this._setAsActive(value);
      return;
    }
    await this._setAsNonActive(value);
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
        this._filterMultiselectService.setActiveIds(toArray(activeIds));
      });
  }

  _recalculateOnChanges() {
    combineLatest(
      this._customRoute.fqWithExcludedFilter$(this.filter),
      this._customRoute.q$
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
          this._filterMultiselectService._fetchCounts$(this.filter, {
            ...this._customRoute.params(),
            fq,
          })
        )
      )
      .subscribe((entities) => {
        this._filterMultiselectService.updateEntitiesCounts(
          entities as FilterTreeNode[]
        );
        this._filterMultiselectService.setLoading(false);
      });
  }
  _initFilterValues() {
    this._filterMultiselectService.setLoading(true);
    combineLatest(
      this._filterMultiselectService._fetchAllValues$(
        this.filter,
        this._customRoute.params()['collection'] as string
      ),
      this._filterMultiselectService._fetchCounts$(this.filter, {
        ...this._customRoute.params(),
        fq: this._customRoute.fqWithExcludedFilter(this.filter),
      })
    )
      .pipe(
        map(
          ([allValues, counts]) =>
            _(allValues)
              .keyBy('id')
              .merge(keyBy(counts, 'id'))
              .values()
              .value() as FilterTreeNode[]
        )
      )
      .subscribe((entities) => {
        const activeIds = toArray(this._customRoute.fqMap()[this.filter]);
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

  async _setAsNonActive(value: string) {
    await this._router.navigate([], {
      queryParams: {
        fq: removeFilterValue(
          this._customRoute.fqMap(),
          this.filter,
          value,
          this._filtersConfigsRepository.get(this._customRoute.collection())
            .filters
        ),
      },
      queryParamsHandling: 'merge',
    });
  }

  async _setAsActive(value: string) {
    await this._router.navigate([], {
      queryParams: {
        fq: this._addFilterValue(this.filter, value),
      },
      queryParamsHandling: 'merge',
    });
  }

  _addFilterValue(filterName: string, value: string): string[] {
    const fqMap = this._customRoute.fqMap();
    const filtersConfigs = this._filtersConfigsRepository.get(
      this._customRoute.collection()
    ).filters;
    if (
      !!fqMap[filterName] &&
      (fqMap[filterName] as string[]).includes(value)
    ) {
      return deserializeAll(fqMap, filtersConfigs);
    }

    fqMap[filterName] = fqMap[filterName]
      ? ([...fqMap[filterName], value] as string[])
      : [value];
    return deserializeAll(fqMap, filtersConfigs);
  }
}
