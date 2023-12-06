import { Component, Input } from '@angular/core';
import {
  IFilterConfig,
  IUIFilterTreeNode,
} from '@collections/repositories/types';
import { NzTreeNode, NzTreeNodeOptions } from 'ng-zorro-antd/tree';
import {
  deserializeAll,
  removeFilterValue,
  serializeAll,
} from '@collections/filters-serializers/filters-serializers.utils';
import { CustomRoute } from '@collections/services/custom-route.service';
import { Router } from '@angular/router';
import { FiltersConfigsRepository } from '@collections/repositories/filters-configs.repository';
import { IFqMap } from '@collections/services/custom-route.type';

@Component({
  selector: 'ess-filter-multiselect-dropdown',
  template: `
    <div *ngIf="isLoading || show" id="container">
      <div id="dropdown-filter-title">
        <b> {{ formatLabel(label) }} </b>
        <div id="tooltipIcon">
          <img
            src="assets/tooltip_prompt.svg"
            [ngbTooltip]="tooltipText"
            alt="Tooltip prompt icon"
            *ngIf="!!tooltipText"
            class="tooltip-prompt-icon"
          />
        </div>
      </div>

      <nz-tree-select
        class="global-select"
        [(ngModel)]="value"
        [nzNodes]="_data"
        [nzDisplayWith]="customShow"
        (ngModelChange)="onChange($event)"
        [nzShowExpand]="false"
        nzDropdownClassName="global-dropdown"
        nzShowSearch
        nzShowLine="true"
        nzCheckable
        [nzDisabled]="isLoading"
        nzAllowClear="false"
        nzPlaceHolder="All selection"
        nzPlacement="bottomLeft"
      >
      </nz-tree-select>
    </div>
  `,
  styles: [
    `
      #dropdown-filter-title {
        display: flex;
        flex-direction: row;
      }

      #container {
        display: flex;
        flex-direction: column;
      }

      .tooltip-prompt-icon {
        margin-left: 5px;
        width: 1.12em;
      }

      ::ng-deep .global-dropdown {
        border-radius: 8px;
        padding: 10px;
      }

      ::ng-deep .global-select {
        width: 240px;
        border-radius: 10px;
      }
    `,
  ],
})
export class FilterMultiselectDropdownComponent {
  value: string[] = [];

  _data: NzTreeNodeOptions[] = [];
  _previousData: IUIFilterTreeNode[] = [];

  @Input()
  label = '';

  @Input()
  isLoading = false;

  @Input()
  show = true;

  @Input()
  tooltipText!: string;

  @Input()
  filterId!: string;

  onChange($event: string[]): void {
    const newData: [IUIFilterTreeNode, boolean][] = this._previousData.map(
      (x) => [x, $event.includes(x.id)]
    );

    this.toggleActive(newData);
  }

  @Input()
  set data(data: IUIFilterTreeNode[]) {
    this._previousData = data;

    this._data = data.map((x) => {
      if (x.isSelected) this.value.push(x.value);

      return {
        title: `${x.name} (${x.count})`,
        key: x.id,
        isLeaf: true,
      };
    });
  }

  customShow(node: NzTreeNode): string {
    return node.title.split('(')[0].trim();
  }

  formatLabel(label: string): string {
    const allFilters = this._filtersConfigsRepository.get(
      this._customRoute.collection()
    ).filters;
    const fqMap = serializeAll(this._customRoute.fq(), allFilters);
    const count = fqMap[this.filterId]?.length;
    return count > 0 ? `${label} (${count})` : label;
  }

  constructor(
    private _customRoute: CustomRoute,
    private _router: Router,
    private _filtersConfigsRepository: FiltersConfigsRepository
  ) {}

  // TODO: Move below somewhere else
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
}
