import { Component, Input, OnInit } from '@angular/core';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { map, tap } from 'rxjs';

import { CustomRoute } from '@collections/services/custom-route.service';
import { FilterCheckboxUtils } from './checkbox-utils';

@Component({
  selector: 'ess-filter-checkbox-resource-type',
  template: `
    <div class="filter">
      <ess-filter-label
        [label]="label"
        [filter]="filter"
        [tooltipText]="tooltipText"
        [expandArrow]="expandArrow"
      ></ess-filter-label>
      <div *ngFor="let choice of data | keyvalue" class="filter-list-item">
        <label>
          <input
            [(ngModel)]="choice.value['checked']"
            type="checkbox"
            [value]="choice.value['value']"
            (change)="onChange($event)"
          />
          <span class="checkmark"></span>
          {{ choice.value['label'] }}
        </label>
      </div>
    </div>
  `,
  styles: [],
})
@UntilDestroy()
export class FilterCheckboxResourceTypeComponent implements OnInit {
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

  constructor(
    private _customRoute: CustomRoute,

    private _filterCheckboxUtils: FilterCheckboxUtils
  ) {}
  data: Record<string, Record<string, string | boolean>> = {
    publication: {
      label: 'Publications',
      value: 'publication',
      checked: false,
    },
    dataset: { label: 'Research data', value: 'dataset', checked: false },
    software: { label: 'Software', value: 'software', checked: false },
    other: { label: 'Other research products', value: 'other', checked: false },
  };

  chosenResources: string[] = [];

  ngOnInit() {
    this._customRoute.fqMap$
      .pipe(
        untilDestroyed(this),
        map((fqMap) => fqMap[this.filter] as string | undefined),
        tap((resourceTypeFq: string | undefined) => {
          if (!resourceTypeFq) {
            return;
          }
          for (const value of resourceTypeFq) {
            this.updateCheckbox(value);
          }
        })
      )
      .subscribe();
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  async onChange($event: any) {
    if ($event.target.checked) {
      this.chosenResources.push($event.target.value);
      await this._filterCheckboxUtils.addFilter(
        this.filter,
        $event.target.value
      );
    } else {
      this.chosenResources.splice(
        this.chosenResources.indexOf($event.target.value),
        1
      );
      await this._filterCheckboxUtils.removeFilter(
        this.filter,
        $event.target.value
      );
    }
  }

  updateCheckbox(value: string) {
    this.data[value]['checked'] = !this.data[value]['checked'];
  }
}
