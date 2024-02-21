import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CustomRoute } from '@collections/services/custom-route.service';
import { deserializeAll } from '@collections/filters-serializers/filters-serializers.utils';
import { FiltersConfigsRepository } from '@collections/repositories/filters-configs.repository';
import {
  BehaviorSubject,
  debounceTime,
  distinctUntilChanged,
  map,
  skip,
  switchMap,
  tap,
} from 'rxjs';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import moment from 'moment';
import { NzMarks } from 'ng-zorro-antd/slider';
import {
  EMPTY_RANGE_SIGN,
  RANGE_SPLIT_SIGN,
} from '@collections/filters-serializers/range.deserializer';
import { isEqual } from 'lodash-es';
import { toRangeTimeFormat } from '@collections/filters-serializers/range.serializer';
import { FilterRangeService } from '@components/filters/filter-range/filter-range.service';
import { DEFAULT_MAX_DURATION } from '@components/filters/filter-range/utils';

@UntilDestroy()
@Component({
  selector: 'ess-filter-range',
  template: ` <div class="filter" *ngIf="newMax$ | async as newMax">
    <ess-filter-label
      [label]="label"
      [filter]="filter"
      [isExpanded]="isExpanded"
      [tooltipText]="tooltipText"
      (isExpandedChanged)="isExpandedChanged($event)"
      [expandArrow]="expandArrow"
    ></ess-filter-label>
    <div *ngIf="isExpanded">
      <nz-slider
        nzRange
        [nzMarks]="calculateMarks(newMax)"
        [nzTipFormatter]="formatTooltip"
        [nzMin]="0"
        [nzMax]="newMax"
        [nzStep]="step"
        [ngModel]="range$.value"
        (ngModelChange)="range$.next($event)"
      ></nz-slider>
    </div>
  </div>`,
  styles: [
    `
      .filter {
        margin-bottom: 10px;
        padding-bottom: 5px;
        position: relative;
        border-bottom: 1px solid #d9dee2;
      }
    `,
  ],
  providers: [FilterRangeService],
})
export class FilterRangeComponent implements OnInit {
  @Input()
  label!: string;

  @Input()
  filter!: string;

  @Input()
  isExpanded!: boolean;

  @Input()
  tooltipText!: string;

  @Input()
  expandArrow: boolean | undefined;

  step = 60;

  newMax$ = this._filterRangeService._fetchMaxDuration();

  range$ = new BehaviorSubject<[number, number]>([0, DEFAULT_MAX_DURATION]);

  constructor(
    private _customRoute: CustomRoute,
    private _router: Router,
    private _filtersConfigsRepository: FiltersConfigsRepository,
    private _filterRangeService: FilterRangeService
  ) {}

  ngOnInit(): void {
    this.newMax$.subscribe((max) => {
      this.range$
        .pipe(
          untilDestroyed(this),
          skip(1),
          distinctUntilChanged(),
          debounceTime(1000),
          switchMap(([start, end]) => {
            const fqMap = this._customRoute.fqMap();
            fqMap[this.filter] = [
              start === 0 ? null : start,
              end >= max ? null : end,
            ];
            const filtersConfigs = this._filtersConfigsRepository.get(
              this._customRoute.collection()
            ).filters;
            return this._router.navigate([], {
              queryParams: {
                fq: deserializeAll(fqMap, filtersConfigs),
              },
              queryParamsHandling: 'merge',
            });
          }),
          untilDestroyed(this)
        )
        .subscribe();

      this._customRoute.fqMap$
        .pipe(
          untilDestroyed(this),
          map((fqMap) => fqMap[this.filter] as string | undefined),
          tap((range: string | undefined) => {
            if (!range && isEqual([0, max], this.range$.value)) {
              return;
            }

            if (!range) {
              this.range$.next([0, max]);
              return;
            }

            const [start, end] = range.split(` ${RANGE_SPLIT_SIGN} `);

            const parsedStart =
              start === EMPTY_RANGE_SIGN
                ? 0
                : moment.duration(start).asSeconds();
            const parsedEnd =
              end === EMPTY_RANGE_SIGN ? max : moment.duration(end).asSeconds();
            if (!isEqual([parsedStart, parsedEnd], this.range$.value)) {
              this.range$.next([parsedStart, parsedEnd]);
            }
          })
        )
        .subscribe();
    });
  }

  formatTooltip(seconds: number): string {
    return toRangeTimeFormat(seconds);
  }

  isExpandedChanged(newExpanded: boolean) {
    this.isExpanded = newExpanded;
  }

  calculateMarks(max: number): NzMarks {
    return {
      0: '0h',
      [max]: `+${Math.floor(moment.duration(max * 1000).asHours())}h`,
    };
  }
}
