import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { FilterMultiselectService } from './filter-multiselect.service';
import { FilterTreeNode } from '../types';
import { FilterMultiselectRepository } from './filter-multiselect.repository';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { debounceTime, map, skip, switchMap, tap } from 'rxjs';
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

@UntilDestroy()
@Component({
  selector: 'ess-filter-multiselect',
  template: `
    <div class="filter" *ngIf="hasEntities$ | async">
      <ess-filter-label
        [label]="label + ' (' + (entitiesCount$ | async) + ')'"
        [filter]="filter"
      ></ess-filter-label>

      <input
        [attr.placeholder]="'Search in ' + label.toLowerCase() + '...'"
        class="query-input form-control form-control-sm"
        [formControl]="queryFc"
      />
      <ess-first-n-values
        *ngIf="!showMore"
        [activeEntities]="(activeEntities$ | async) ?? []"
        [nonActiveEntities]="(nonActiveEntities$ | async) ?? []"
        (toggleActive)="toggleActive($event)"
      ></ess-first-n-values>
      <ess-show-all
        *ngIf="showMore"
        [activeEntities]="(activeEntities$ | async) ?? []"
        [nonActiveEntities]="(nonActiveEntities$ | async) ?? []"
        (toggleActive)="toggleActive($event)"
      ></ess-show-all>
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
  activeEntities$ = this._filterMultiselectService.activeEntities$;
  nonActiveEntities$ = this._filterMultiselectService.nonActiveEntities$;
  entitiesCount$ = this._filterMultiselectService.entitiesCount$;
  hasEntities$ = this._filterMultiselectService.hasEntities$;

  showMore = false;
  hasShowMore$ = this._filterMultiselectService.hasShowMore$;

  queryFc = new UntypedFormControl('');

  constructor(
    private _customRoute: CustomRoute,
    private _router: Router,
    private _filtersConfigsRepository: FiltersConfigsRepository,
    private _filterMultiselectService: FilterMultiselectService
  ) {}

  ngOnInit() {
    this._filterMultiselectService
      ._loadAllAvailableValues$(
        this.filter,
        this._customRoute.params()['collection'] as string
      )
      .pipe(
        untilDestroyed(this),
        tap(() =>
          this._filterMultiselectService.setActiveIds(
            toArray(this._customRoute.fqMap()[this.filter])
          )
        ),
        switchMap(() =>
          this._filterMultiselectService
            ._updateCounts$(this.filter, {
              ...this._customRoute.params(),
              fq: this._customRoute.fqWithExcludedFilter(this.filter),
            })
            .pipe(untilDestroyed(this))
        )
      )
      .subscribe();

    this._customRoute.fqMap$
      .pipe(
        untilDestroyed(this),
        skip(1),
        map((fqMap) => fqMap[this.filter] ?? []),
        tap((activeIds) =>
          this._filterMultiselectService.setActiveIds(toArray(activeIds))
        )
      )
      .subscribe();

    // load on changes other than collection
    combineLatest(
      this._customRoute
        .fqWithExcludedFilter$(this.filter)
        .pipe(untilDestroyed(this)),
      this._customRoute.q$.pipe(untilDestroyed(this))
    )
      .pipe(
        skip(1),
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        map(([fq, _]) => fq),
        switchMap((fq) =>
          this._filterMultiselectService._updateCounts$(this.filter, {
            ...this._customRoute.params(),
            fq,
          })
        )
      )
      .subscribe();

    this.queryFc.valueChanges
      .pipe(untilDestroyed(this), debounceTime(500))
      .subscribe((query) => this._filterMultiselectService.setQuery(query));
  }

  async toggleActive(event: [FilterTreeNode, boolean]) {
    const [node, currentIsSelected] = event;
    const { filter, value, isSelected } = node;
    if (isSelected === currentIsSelected) {
      return;
    }

    if (currentIsSelected) {
      await this._router.navigate([], {
        queryParams: {
          fq: this._addFilterValue(filter, value),
        },
        queryParamsHandling: 'merge',
      });
      return;
    }
    await this._router.navigate([], {
      queryParams: {
        fq: removeFilterValue(
          this._customRoute.fqMap(),
          filter,
          value,
          this._filtersConfigsRepository.get(this._customRoute.collection())
            .filters
        ),
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
