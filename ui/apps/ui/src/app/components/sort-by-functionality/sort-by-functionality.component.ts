import { Component, Input, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Router } from '@angular/router';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { CustomRoute } from '@collections/services/custom-route.service';
import { sanitizeQuery } from '@components/search-input/query.sanitizer';
import { filter, switchMap } from 'rxjs';
import {
  DEFAULT_SORT,
  isSortOption,
  sortType,
} from '@components/sort-by-functionality/sort-value.type';

@UntilDestroy()
@Component({
  selector: 'ess-sort-by-functionality',
  template: `<div class="col-sm-4 sort_container">
    <label for="sorts" i18n>Sort By</label>
    <select
      [formControl]="selectedSortOptionControl"
      id="sorts"
      class="form-select"
    >
      <option value="dmr" i18n>Date - Most recent</option>
      <option value="dlr" i18n>Date – Least recent</option>
      <option value="mp" i18n>Most popular</option>
      <!--<option *ngIf="!sortByOptionOff" value="r" i18n>Relevance</option>-->
      <option value="default" i18n>Default</option>
    </select>
  </div>`,
  styles: [
    `
      :host {
        display: contents;
      }

      label {
        width: 100px;
        font-family: 'Inter';
        font-style: normal;
        font-weight: 400;
        font-size: 14px;
        line-height: 20px;
        color: #4f4f4f;
      }

      select {
        font-family: 'Inter';
        font-style: normal;
        font-weight: 500;
        font-size: 14px;
        line-height: 24px;
        color: #101828;
      }

      select:focus {
        -webkit-box-shadow: none;
        box-shadow: none;
        border: 1px solid #ced4da;
      }

      .sort_container {
        width: 18rem;
        display: flex;
        align-items: center;
      }
    `,
  ],
})
export class SortByFunctionalityComponent implements OnInit {
  @Input()
  sortByOptionOff!: boolean;

  public selectedSortOptionControl: FormControl<sortType> =
    new FormControl<sortType>(DEFAULT_SORT, { nonNullable: true });

  constructor(private _customRoute: CustomRoute, private _router: Router) {}

  ngOnInit() {
    this._customRoute.sort_ui$
      .pipe(
        untilDestroyed(this), // TODO: event triggered on clear or change search criteria
        filter((sort_ui) => sort_ui !== this.selectedSortOptionControl.value)
      )
      .subscribe((sort_ui) => {
        this.selectedSortOptionControl.setValue(
          isSortOption(sort_ui) ? sort_ui : DEFAULT_SORT,
          { emitEvent: false }
        );
      });
    this.selectedSortOptionControl.valueChanges
      .pipe(
        untilDestroyed(this),
        switchMap((value) => this.updateQueryParams(value))
      )
      .subscribe();
  }

  async updateQueryParams(sortOption: sortType) {
    await this._router.navigate([], {
      queryParams: {
        sort_ui: sanitizeQuery(sortOption) ?? DEFAULT_SORT,
      },
      queryParamsHandling: 'merge',
    });
  }
}
