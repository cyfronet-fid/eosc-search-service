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

@UntilDestroy()
@Component({
  selector: 'ess-filter-range',
  template: ` <div class="filter">
    <span class="filter-title"
      ><b>{{ label }}</b></span
    >
    <span (click)="resetAllActiveEntities()">
      &nbsp; &nbsp;
      <a href="javascript:void(0)" class="clear-button">clear all</a>
    </span>
    <nz-slider
      nzRange
      [nzMarks]="marks"
      [nzTipFormatter]="formatTooltip"
      [nzMin]="min"
      [nzMax]="max"
      [nzStep]="step"
      [ngModel]="range$.value"
      (ngModelChange)="range$.next($event)"
    ></nz-slider>
  </div>`,
  styles: [
    `
      .filter {
        margin-bottom: 10px;
      }
      .filter-title {
        padding-bottom: 6px;
        display: inline-block;
      }
    `,
  ],
})
export class FilterRangeComponent implements OnInit {
  @Input()
  label!: string;

  @Input()
  filter!: string;

  min = 0;
  max = 40 * 60 * 60;
  step = 60;

  range$ = new BehaviorSubject<[number, number]>([this.min, this.max]);

  marks: NzMarks = {
    0: '0h',
    [this.max]: `+${Math.floor(moment.duration(this.max * 1000).asHours())}h`,
  };

  constructor(
    private _customRoute: CustomRoute,
    private _router: Router,
    private _filtersConfigsRepository: FiltersConfigsRepository
  ) {}

  ngOnInit(): void {
    this.range$
      .pipe(
        untilDestroyed(this),
        skip(1),
        distinctUntilChanged(),
        debounceTime(1000)
      )
      .subscribe(async ([start, end]) => {
        const fqMap = this._customRoute.fqMap();
        fqMap[this.filter] = [
          start === this.min ? null : start,
          end >= this.max ? null : end,
        ];
        const filtersConfigs = this._filtersConfigsRepository.get(
          this._customRoute.collection()
        ).filters;
        await this._router.navigate([], {
          queryParams: {
            fq: deserializeAll(fqMap, filtersConfigs),
          },
          queryParamsHandling: 'merge',
        });
      });

    this._customRoute.fqMap$
      .pipe(
        untilDestroyed(this),
        map((fqMap) => fqMap[this.filter] as string | undefined),
        tap((range: string | undefined) => {
          if (!range && isEqual([this.min, this.max], this.range$.value)) {
            return;
          }

          if (!range) {
            this.range$.next([this.min, this.max]);
            return;
          }

          const [start, end] = range.split(` ${RANGE_SPLIT_SIGN} `);

          const parsedStart =
            start === EMPTY_RANGE_SIGN ? 0 : moment.duration(start).asSeconds();
          const parsedEnd =
            end === EMPTY_RANGE_SIGN
              ? this.max
              : moment.duration(end).asSeconds();
          if (!isEqual([parsedStart, parsedEnd], this.range$.value)) {
            this.range$.next([parsedStart, parsedEnd]);
          }
        })
      )
      .subscribe();
  }

  formatTooltip(seconds: number): string {
    return toRangeTimeFormat(seconds);
  }

  async resetAllActiveEntities() {
    await this._router.navigate([], {
      queryParams: {
        fq: this._customRoute.fq().filter((fq) => !fq.startsWith(this.filter)),
      },
      queryParamsHandling: 'merge',
    });
  }
}
