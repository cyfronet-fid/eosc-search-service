import { Component, Input } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Router } from '@angular/router';
import { UntilDestroy } from '@ngneat/until-destroy';
import { CustomRoute } from '@collections/services/custom-route.service';
import {
  DEFAULT_SORT,
  sortType,
} from '@components/sort-by-functionality/sort-value.type';
import { ConfigService } from '../../services/config.service';

@UntilDestroy()
@Component({
  selector: 'ess-ui-controls-dropdown',
  template: ` <div class="col-sm-4 sort_container">
    <select
      [formControl]="selectedSortOptionControl"
      #urlList
      id="sorts"
      class="form-select"
      (change)="this.gotoURL(urlList.value)"
    >
      <option value="{{ option }}" *ngFor="let option of this.urls">
        {{ option }}
      </option>
      <option value="default">Source</option>
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
export class UiDropdownComponent {
  isSortByRelevanceInstanceScope: boolean =
    ConfigService.config?.is_sort_by_relevance;

  @Input()
  isSortByRelevanceCollectionScopeOff!: boolean;

  @Input()
  type!: string;

  @Input()
  urls!: string[];

  public selectedSortOptionControl: FormControl<sortType> =
    new FormControl<sortType>(DEFAULT_SORT, { nonNullable: true });

  constructor(private _customRoute: CustomRoute, private _router: Router) {}

  gotoURL(url: string) {
    window.open(url, '_blank');
  }
}
