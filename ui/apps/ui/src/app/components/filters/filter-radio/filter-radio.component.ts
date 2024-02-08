import { Component, Input, OnInit } from '@angular/core';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { map, tap } from 'rxjs';

import { CustomRoute } from '@collections/services/custom-route.service';
import { FilterRadioUtils } from './radio-utils';
import { FormControl, FormGroup } from '@angular/forms';

@Component({
  selector: 'ess-filter-radio',
  template: `
    <div class="filter">
      <ess-filter-label
        [label]="label"
        [filter]="filter"
        [tooltipText]="tooltipText"
        [expandArrow]="expandArrow"
      ></ess-filter-label>
      <div class="filter-radio-item" *ngFor="let status of statuses">
        <label>
          <input
            #radioInput
            type="radio"
            [value]="status.value"
            [(ngModel)]="chosenStatus"
            (change)="onStatusChange()"
            (click)="resetStatus(status.value)"
          />
          <span class="radio-label">{{ status.label }}</span>
        </label>
      </div>
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
      .radio-item {
        display: flex;
        width: 206px;
        height: 34px;
        flex-direction: column;
        justify-content: center;
      }
      .radio-label {
        margin-left: 5px;
        color: rgba(0, 0, 0, 0.85);
        font-family: Inter;
        font-size: 13px;
        font-style: normal;
        font-weight: 400;
        line-height: normal;
      }
    `,
  ],
})
@UntilDestroy()
export class FilterRadioComponent implements OnInit {
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

  form = new FormGroup({
    status: new FormControl(),
  });

  constructor(
    private _customRoute: CustomRoute,

    private _filterRadioUtils: FilterRadioUtils
  ) {}

  statuses = [
    { label: 'Ongoing', value: 'ongoing' },
    { label: 'Closed', value: 'closed' },
    { label: 'Scheduled', value: 'scheduled' },
  ];
  chosenStatus = '';

  ngOnInit() {
    this._customRoute.fqMap$
      .pipe(
        untilDestroyed(this),
        map((fqMap) => fqMap[this.filter] as string | undefined),
        tap((statusfq: string | undefined) => {
          if (!statusfq) {
            return;
          } else {
            this.chosenStatus = statusfq[0];
          }
        })
      )
      .subscribe();
  }

  async resetStatus(value: string) {
    if (value == this.chosenStatus) {
      this.chosenStatus = '';
      await this.onStatusChange();
    }
  }

  async onStatusChange() {
    await this._filterRadioUtils.replaceFilter(this.filter, this.chosenStatus);
  }
}
