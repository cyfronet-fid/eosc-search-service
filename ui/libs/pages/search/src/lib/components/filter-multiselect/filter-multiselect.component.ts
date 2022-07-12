import {Component, EventEmitter, Input, OnChanges, Output, SimpleChanges, ViewChild} from '@angular/core';
import {addFq, IFilter, INITIAL_FILTER_OPTION_COUNT, removeFq} from '@eosc-search-service/search';
import { ActivatedRoute, Router } from '@angular/router';
import { FormControl } from '@angular/forms';
import { debounceTime } from 'rxjs';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import {assertNotNull} from "@eosc-search-service/types";
import {FlatNode, TreeNode} from "@eosc-search-service/common";

@UntilDestroy()
@Component({
  selector: 'ess-filter-multiselect',
  template: `
    <div class="filter" *ngIf="filter">
      <span class="filter-title"
        ><b>{{ filter.title }}</b></span
      >
      <input
        *ngIf="filter.showMore"
        [attr.placeholder]="'Search in ' + filter.title"
        class="query-input form-control form-control-sm"
        [formControl]="queryFc"
      />
      <div [ngClass]="{filter__viewport: filter.showMore}" (scroll)="onScroll($event)" #content>
        <ess-checkboxes-tree
          [data]="dataTrimmed"
          (checkboxesChange)="addFilter($event)"
        ></ess-checkboxes-tree>
      </div>
      <a
        *ngIf="isShowMoreVisible || filter.showMore"
        class="show-more"
        href="javascript:undefined"
        (click)="toggleShowMore.emit()"
        >
        <ng-container *ngIf="!filter.showMore; else showLessRef" i18n>Show more</ng-container>
        <ng-template #showLessRef><ng-container i18n>Show less</ng-container></ng-template>
      </a
      >
    </div>
  `,
  styles: [
    `
      .filter__viewport {
        max-height: 400px;
        overflow: auto;
      }

      .query-input {
        margin-bottom: 5px;
      }

      .filter {
        margin-bottom: 10px;
      }
      .filter-title {
        padding-bottom: 6px;
        display: block;
      }
      .ant-tree {
        background: none !important;
      }

      .show-more {
        font-size: 11px;
      }
    `,
  ],
})
export class FilterMultiselectComponent implements OnChanges {
  @ViewChild('content', {static: false}) content?: any;
  @Input() filter: IFilter | null = null;
  @Output() toggleShowMore = new EventEmitter<void>();
  // @Output() addFilter = new EventEmitter
  @Output() searchFilter = new EventEmitter<string>();
  @Output() fetchMore = new EventEmitter<string>();
  get isShowMoreVisible(): boolean {
    if (this.filter === null) {
      return false;
    }
    return !this.filter.showMore && this.filter.data.length > INITIAL_FILTER_OPTION_COUNT;

  }
  queryFc = new FormControl('');
  dataTrimmed: TreeNode[] = [];

  constructor(private _route: ActivatedRoute, private _router: Router) {
    this.queryFc.valueChanges
      .pipe(debounceTime(300), untilDestroyed(this))
      .subscribe((value) => this.searchFilter.emit(value));
  }

  addFilter = async (selected: [FlatNode, boolean]) => {
    const [node, isSelected] = selected;
    const { value, filter } = node;
    const fq = isSelected
      ? addFq(this._router.url, filter, value)
      : removeFq(this._router.url, filter, value);
    await this._router.navigate([], {
      queryParams: { fq },
      queryParamsHandling: 'merge',
    });
  };

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['filter']) {
      const filter = changes['filter'].currentValue;
        if (filter == null) {
          this.dataTrimmed = []
        }
        else if (filter.showMore === true) {
          this.dataTrimmed = filter.data;
        }
        else {
          this.dataTrimmed = filter.data.slice(0, INITIAL_FILTER_OPTION_COUNT);
        }
    }
  }


  onScroll($event: Event) {
    if (this.filter?.showMore !== true) {
      return;
    }
    const target: any = $event.target;
    assertNotNull(target)
    const currentPosition = target.scrollTop + target.offsetHeight;
    if (currentPosition === target.scrollHeight) {
      this.fetchMore.emit(this.queryFc.value)
    }
  }
}
