import {
  Component,
  Input,
  OnChanges,
  OnInit,
  SimpleChanges,
} from '@angular/core';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { debounceTime } from 'rxjs';
import { UntypedFormControl } from '@angular/forms';
import { CustomRoute } from '@collections/services/custom-route.service';
import { Router } from '@angular/router';
import { FiltersConfigsRepository } from '@collections/repositories/filters-configs.repository';
import {
  deserializeAll,
  removeFilterValue,
  serializeAll,
} from '@collections/filters-serializers/filters-serializers.utils';
import {
  IFilterConfig,
  IFilterNode,
  IUIFilterTreeNode,
} from '@collections/repositories/types';
import { IFqMap } from '@collections/services/custom-route.type';

const DEFAULT_RESULTS_SIZE = 10;

@UntilDestroy()
@Component({
  selector: 'ess-filter-multiselect',
  template: `
    <div class="filter" *ngIf="options.length > 0">
      <ess-filter-label
        [label]="label"
        [filter]="filter"
        [isExpanded]="shouldExpand"
        [showClearButton]="anyActive"
        [tooltipText]="tooltipText"
        (isExpandedChanged)="isExpandedChanged($event)"
      ></ess-filter-label>

      <input
        *ngIf="hasShowMore"
        [attr.placeholder]="'Search in ' + label.toLowerCase() + '...'"
        class="query-input form-control form-control-sm"
        [formControl]="queryFc"
      />

      <div *ngIf="shouldExpand">
        <ess-first-n-values
          *ngIf="!showMore; else showAll"
          [allEntities]="options"
          [query]="query"
          (toggleActive)="toggleActive($event)"
        ></ess-first-n-values>
        <ng-template #showAll>
          <ess-show-all
            *ngIf="showMore"
            [allEntities]="options"
            [query]="query"
            (toggleActive)="toggleActive($event)"
          ></ess-show-all>
        </ng-template>
        <span *ngIf="hasShowMore" (click)="showMore = !showMore">
          <a href="javascript:void(0)" class="show-more">{{
            showMore ? 'show less' : 'show more'
          }}</a>
        </span>
      </div>

      <ng-container *ngIf="isLoading">
        <div class="mask">
          <nz-spin nzSimple></nz-spin>
        </div>
      </ng-container>
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
      .query-input {
        margin-bottom: 12px;
      }
      .mask {
        width: 100%;
        height: 100%;
        position: absolute;
        background-color: rgba(255, 255, 255, 0.7);
        text-align: center;
        top: 0;
        display: flex;
        flex-direction: column;
        justify-content: center;
        justify-items: center;
      }
    `,
  ],
})
export class FilterMultiselectComponent implements OnInit, OnChanges {
  @Input()
  isExpanded!: boolean;

  get shouldExpand(): boolean {
    return (
      this.isExpanded || this.options.find((op) => op.isSelected) !== undefined
    );
  }

  @Input()
  label!: string;

  @Input()
  filter!: string;

  @Input()
  tooltipText!: string;

  @Input()
  options: IFilterNode[] = [];

  @Input()
  isLoading = false;

  showMore = false;

  queryFc = new UntypedFormControl('');
  query: string | null = null;

  anyActive = false;

  constructor(
    private _customRoute: CustomRoute,
    private _router: Router,
    private _filtersConfigsRepository: FiltersConfigsRepository
  ) {}

  ngOnInit() {
    // this._initFilterValues();
    // this._recalculateOnChanges();
    this._updateSearchQuery();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['options'] != null) {
      this.anyActive = this.options.find((op) => op.isSelected) !== undefined;
    }
  }

  async toggleActive(changes: [IUIFilterTreeNode, boolean][]) {
    const allFilters = this._filtersConfigsRepository.get(
      this._customRoute.collection()
    ).filters;
    let fqMap = serializeAll(this._customRoute.fq(), allFilters);

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const filtersToRemove = changes.filter(([_, isSelected]) => !isSelected);
    for (const toRemove of filtersToRemove) {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const [{ filter, value }, _] = toRemove;
      const fq = removeFilterValue(fqMap, filter, value, allFilters);
      fqMap = serializeAll(fq, allFilters);
    }

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const filtersToAdd = changes.filter(([_, isSelected]) => isSelected);
    for (const toAdd of filtersToAdd) {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const [{ filter, value }, _] = toAdd;
      const fq = this._addFilterValue(fqMap, allFilters, filter, value);
      fqMap = serializeAll(fq, allFilters);
    }

    await this._router.navigate([], {
      queryParams: {
        fq: deserializeAll(fqMap, allFilters),
      },
      queryParamsHandling: 'merge',
    });
  }

  _updateSearchQuery() {
    this.queryFc.valueChanges
      .pipe(untilDestroyed(this), debounceTime(500))
      .subscribe((query) => (this.query = query));
  }

  _addFilterValue(
    fqMap: IFqMap,
    allFilters: IFilterConfig[],
    filterName: string,
    value: string
  ): string[] {
    if (
      !!fqMap[filterName] &&
      (fqMap[filterName] as string[]).includes(value)
    ) {
      return deserializeAll(fqMap, allFilters);
    }

    fqMap[filterName] = fqMap[filterName]
      ? ([...fqMap[filterName], value] as string[])
      : [value];
    return deserializeAll(fqMap, allFilters);
  }

  isExpandedChanged(newExpanded: boolean) {
    this.isExpanded = newExpanded;
  }

  get hasShowMore(): boolean {
    return (
      this.options.filter(({ level }) => level === 0).length >
      DEFAULT_RESULTS_SIZE
    );
  }
}
