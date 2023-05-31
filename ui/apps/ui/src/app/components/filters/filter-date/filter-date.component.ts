import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CustomRoute } from '@collections/services/custom-route.service';
import { deserializeAll } from '@collections/filters-serializers/filters-serializers.utils';
import { FiltersConfigsRepository } from '@collections/repositories/filters-configs.repository';
import moment from 'moment';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { map, tap } from 'rxjs';
import {
  DATE_RANGE_SPLIT_SIGN,
  EMPTY_DATE_SIGN,
} from '@collections/filters-serializers/date.deserializer';

@UntilDestroy()
@Component({
  selector: 'ess-filter-date',
  template: `
    <div class="filter">
      <ess-filter-label
        [label]="label"
        [filter]="filter"
        [isExpanded]="isExpanded"
        (isExpandedChanged)="isExpandedChanged($event)"
      ></ess-filter-label>

      <div *ngIf="isExpanded">
        <br />
        <label>Start date</label>
        <nz-date-picker
          nzPlaceHolder="Select start date"
          [nzDisabledDate]="disableStartDate()"
          [(ngModel)]="startDate"
          (ngModelChange)="onStartDateChange($event)"
        ></nz-date-picker>

        <label>End date</label>
        <nz-date-picker
          nzPlaceHolder="Select end date"
          [nzDisabledDate]="disableEndDate()"
          [(ngModel)]="endDate"
          (ngModelChange)="onEndDateChange($event)"
        ></nz-date-picker>
      </div>
    </div>
  `,
  styles: [
    `
      nz-date-picker {
        width: 100%;
        margin-bottom: 10px;
      }
      .filter {
        margin-bottom: 10px;
      }
    `,
  ],
})
export class FilterDateComponent implements OnInit {
  @Input()
  label!: string;

  @Input()
  filter!: string;

  @Input()
  isExpanded!: boolean;

  startDate: Date | null = null;
  endDate: Date | null = null;

  constructor(
    private _customRoute: CustomRoute,
    private _router: Router,
    private _filtersConfigsRepository: FiltersConfigsRepository
  ) {}

  ngOnInit() {
    this._customRoute.fqMap$
      .pipe(
        untilDestroyed(this),
        map((fqMap) => fqMap[this.filter] as string | undefined),
        tap((dateRange: string | undefined) => {
          if (!dateRange) {
            this.startDate = null;
            this.endDate = null;
            return;
          }

          dateRange = dateRange as string;
          const [startDate, endDate] = dateRange.split(
            ` ${DATE_RANGE_SPLIT_SIGN} `
          );

          const parsedStartDate =
            startDate === EMPTY_DATE_SIGN ? null : new Date(startDate);
          if (!moment(parsedStartDate).isSame(this.startDate)) {
            this.startDate = parsedStartDate;
          }

          const parsedEndDate =
            endDate === EMPTY_DATE_SIGN ? null : new Date(endDate);
          if (!moment(parsedEndDate).isSame(this.endDate)) {
            this.endDate = parsedEndDate;
          }
        })
      )
      .subscribe();
  }

  disableStartDate(): (currentDate: Date) => boolean {
    return (currentDate: Date): boolean => {
      if (!this.endDate) {
        return false;
      }

      return moment(currentDate).isAfter(this.endDate);
    };
  }

  disableEndDate(): (currentDate: Date) => boolean {
    return (currentDate: Date): boolean => {
      if (!this.startDate) {
        return false;
      }

      return moment(currentDate).isBefore(this.startDate);
    };
  }

  async onStartDateChange(startDate: Date | null) {
    await this._replaceRange(startDate, this.endDate);
  }

  async onEndDateChange(endDate: Date) {
    await this._replaceRange(this.startDate, endDate);
  }

  async _replaceRange(startDate: Date | null, endDate: Date | null) {
    const fqMap = this._customRoute.fqMap();
    fqMap[this.filter] = [startDate, endDate];
    const filtersConfigs = this._filtersConfigsRepository.get(
      this._customRoute.collection()
    ).filters;
    await this._router.navigate([], {
      queryParams: {
        fq: deserializeAll(fqMap, filtersConfigs),
      },
      queryParamsHandling: 'merge',
    });
  }

  isExpandedChanged(newExpanded: boolean) {
    this.isExpanded = newExpanded;
  }
}
