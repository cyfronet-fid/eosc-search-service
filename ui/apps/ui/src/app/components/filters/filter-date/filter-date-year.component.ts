import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CustomRoute } from '@collections/services/custom-route.service';
import { FiltersConfigsRepository } from '@collections/repositories/filters-configs.repository';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { map, tap } from 'rxjs';
import { DATE_RANGE_SPLIT_SIGN } from '@collections/filters-serializers/date.deserializer';
import { FilterDateUtils } from '@components/filters/filter-date/date-utils';

@UntilDestroy()
@Component({
  selector: 'ess-filter-date-year',
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
        <nz-range-picker
          nzMode="year"
          [(ngModel)]="dateRange"
          (ngModelChange)="onDateRangeChange($event)"
        ></nz-range-picker>
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
export class FilterDateYearComponent implements OnInit {
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

  dateRange: Date[] | null = null;

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
            this.dateRange = null;
            return;
          }

          dateRange = dateRange as string;
          const [startDate, endDate] = dateRange.split(
            ` ${DATE_RANGE_SPLIT_SIGN} `
          );

          const parsedStartDate = new Date(startDate);
          const parsedEndDate = new Date(endDate);

          if (!parsedStartDate || !parsedEndDate) {
            this.dateRange = null;
            return;
          }

          // override the dates from the query params with
          // start and end of the year respectively
          this.dateRange = [
            new Date(parsedStartDate.getFullYear(), 0, 1),
            new Date(parsedEndDate.getFullYear(), 11, 31),
          ];
        })
      )
      .subscribe();
  }

  async onDateRangeChange(dateRange: Date[]) {
    if (dateRange.length == 0) {
      this.dateRange = null;
      await this._filterDateUtils.replaceRange(this.filter, null, null);
      return;
    }

    const newStart = new Date(dateRange[0].getFullYear(), 0, 1);
    const newEnd = new Date(dateRange[1].getFullYear(), 11, 31);

    this.dateRange = [newStart, newEnd];
    await this._filterDateUtils.replaceRange(this.filter, newStart, newEnd);
  }

  isExpandedChanged(newExpanded: boolean) {
    this.isExpanded = newExpanded;
  }
}
