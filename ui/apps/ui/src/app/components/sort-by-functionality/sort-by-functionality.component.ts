import { Component, Input, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Router } from '@angular/router';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { CustomRoute } from '@collections/services/custom-route.service';
import { sanitizeQuery } from '@components/search-input/query.sanitizer';
import { filter, map, switchMap } from 'rxjs';
import {
  DEFAULT_SORT,
  isSortOption,
  sortType,
} from '@components/sort-by-functionality/sort-value.type';
import { ConfigService } from '../../services/config.service';
import { NavConfigsRepository } from '@collections/repositories/nav-configs.repository';

@UntilDestroy()
@Component({
  selector: 'ess-sort-by-functionality',
  template: ` <div class="col-sm-4 sort_container">
    <div *ngIf="this.collection !== 'project'">
      <label for="sorts" i18n>Sort By</label>
      <select
        [formControl]="selectedSortOptionControl"
        id="sorts"
        class="form-select"
      >
        <option value="default" i18n>Best match</option>
        <option value="dmr" i18n>Date - Most recent</option>
        <option value="dlr" i18n>Date – Least recent</option>
        <option [hidden]="disableSortByPopularity$() | async" value="mp" i18n>
          Downloads & Views
        </option>
        <option [hidden]="disableSortByRelevance$() | async" value="r" i18n>
          Recommended
        </option>
      </select>
    </div>

    <div *ngIf="this.collection === 'project'">
      <label for="sorts" i18n>Sort By</label>
      <select
        [formControl]="selectedSortOptionControl"
        id="sorts"
        class="form-select"
      >
        <option value="default" i18n>Best match</option>
        <option value="pdmr" i18n>Date - Most recent</option>
        <option value="pdlr" i18n>Date – Least recent</option>
      </select>
    </div>
  </div>`,
  styles: [
    `
      :host {
        display: contents;
      }

      label {
        display: inline-block;
        width: 100px;
        font-family: 'Inter';
        font-style: normal;
        font-weight: 400;
        font-size: 14px;
        line-height: 20px;
        color: #4f4f4f;
      }

      select {
        display: inline-block;
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
        margin-top: 5px;
        align-items: center;
        flex-direction: row;
        justify-content: flex-end;
      }
    `,
  ],
})
export class SortByFunctionalityComponent implements OnInit {
  @Input()
  type!: string;
  collection: string | null = '';

  public selectedSortOptionControl: FormControl<sortType> =
    new FormControl<sortType>(DEFAULT_SORT, { nonNullable: true });

  constructor(
    private _customRoute: CustomRoute,
    private _router: Router,
    private _navConfigsRepository: NavConfigsRepository,
    private _configService: ConfigService
  ) {}

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
    this.collection = this._customRoute.collection();
  }

  async updateQueryParams(sortOption: sortType) {
    await this._router.navigate([], {
      queryParams: {
        sort_ui: sanitizeQuery(sortOption) ?? DEFAULT_SORT,
      },
      queryParamsHandling: 'merge',
    });
  }

  disableSortByRelevance$() {
    return this._customRoute.collection$.pipe(
      untilDestroyed(this),
      map((collection) => {
        const navConfig = this._navConfigsRepository.get(collection)!;
        return (
          !!navConfig?.isSortByRelevanceCollectionScopeOff ||
          !this._configService.get().is_sort_by_relevance
        );
      })
    );
  }

  disableSortByPopularity$() {
    return this._customRoute.collection$.pipe(
      untilDestroyed(this),
      map((collection) => {
        const navConfig = this._navConfigsRepository.get(collection)!;
        return !!navConfig?.isSortByPopularityCollectionScopeOff;
      })
    );
  }
}
