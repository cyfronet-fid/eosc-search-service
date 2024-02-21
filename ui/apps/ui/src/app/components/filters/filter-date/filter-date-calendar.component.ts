import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CustomRoute } from '@collections/services/custom-route.service';
import { FiltersConfigsRepository } from '@collections/repositories/filters-configs.repository';
import moment from 'moment';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { map, tap } from 'rxjs';
import {
  DATE_RANGE_SPLIT_SIGN,
  EMPTY_DATE_SIGN,
} from '@collections/filters-serializers/date.deserializer';
import { FilterDateUtils } from '@components/filters/filter-date/date-utils';

@UntilDestroy()
@Component({
  selector: 'ess-filter-date-calendar',
  template: `
    <div class="filter">
      <ess-filter-label
        [label]="label"
        [filter]="filter"
        [isExpanded]="isExpanded"
        [tooltipText]="tooltipText"
        (isExpandedChanged)="isExpandedChanged($event)"
        [expandArrow]="expandArrow"
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
export class FilterDateCalendarComponent implements OnInit {
  @Input()
  label!: string;

  @Input()
  filter!: string;

  @Input()
  isExpanded!: boolean;

  @Input()
  expandArrow: boolean | undefined;

  @Input()
  tooltipText!: string;

  startDate: Date | null = null;
  endDate: Date | null = null;

  constructor(
    private _customRoute: CustomRoute,
    private _router: Router,
    private _filtersConfigsRepository: FiltersConfigsRepository,
    private _filterDateUtils: FilterDateUtils
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
    await this._filterDateUtils.replaceRange(
      this.filter,
      startDate,
      this.endDate
    );
  }

  async onEndDateChange(endDate: Date) {
    await this._filterDateUtils.replaceRange(
      this.filter,
      this.startDate,
      endDate
    );
  }

  isExpandedChanged(newExpanded: boolean) {
    this.isExpanded = newExpanded;
  }
}
