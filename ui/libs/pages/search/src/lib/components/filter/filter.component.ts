import {Component, EventEmitter, Input, Output} from '@angular/core';
import {addFq, IFilter, removeFq,} from '@eosc-search-service/search';
import {ActivatedRoute, Router} from '@angular/router';
import {FlatNode} from '@eosc-search-service/layout';
import {FormControl} from "@angular/forms";
import {debounceTime} from "rxjs";
import {UntilDestroy, untilDestroyed} from "@ngneat/until-destroy";

@UntilDestroy()
@Component({
  selector: 'ess-filter',
  template: `
    <div class="filter" *ngIf="filter">
      <span class="filter-title"
        ><b>{{ filter.title }}</b></span
      >
      <input *ngIf="filter.showMore" [attr.placeholder]="'Search in ' + filter.title" class="query-input form-control form-control-sm" [formControl]="queryFc">
      <ess-checkboxes-tree
        [data]="filter.data"
        (checkboxesChange)="addFilter($event)"
      ></ess-checkboxes-tree>
      <a class="show-more" href="javascript:undefined" (click)="toggleShowMore.emit()" i18n
        >Show more</a
      >
    </div>
  `,
  styles: [
    `
      .query-input {
        margin-bottom: 5px;
      }

      #filters {
        padding: 0 15px 15px 15px;
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
export class FilterComponent {
  @Input() filter: IFilter | null = null;
  @Output() toggleShowMore = new EventEmitter<void>();
  // @Output() addFilter = new EventEmitter
  @Output() searchFilter = new EventEmitter<string>();

  queryFc = new FormControl('');

  constructor(private _route: ActivatedRoute, private _router: Router) {
    this.queryFc.valueChanges.pipe(debounceTime(300), untilDestroyed(this)).subscribe(value => this.searchFilter.emit(value))
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
}
