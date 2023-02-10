import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  Output,
  ViewEncapsulation,
} from '@angular/core';
import { range } from 'lodash-es';
import { PaginationData } from '@ngneat/elf-pagination';

const PAGE_MARGIN = 2;
const INITIAL_PAGES_SIZE = 5;
const MIN_PAGE_NR = 0;

@Component({
  selector: 'ess-pagination',
  template: `
    <ul class="pagination">
      <ng-container
        *ngFor="let pageNr of displayPagesNrs; last as $last; first as $first"
      >
        <li
          *ngIf="$first"
          class="page-item"
          [ngClass]="{ disabled: currentPage === 1 || loading }"
        >
          <a
            class="page-link"
            href="javascript:undefined"
            (click)="activePageChange.emit(1)"
            >&lt;&lt;</a
          >
        </li>
        <li
          *ngIf="$first"
          class="page-item"
          [ngClass]="{ disabled: currentPage === 1 || loading }"
        >
          <a
            class="page-link"
            href="javascript:undefined"
            (click)="activePageChange.emit(currentPage - 1)"
            >&lt;</a
          >
        </li>
        <li class="page-item" [ngClass]="{ active: currentPage === pageNr }">
          <a
            class="page-link"
            href="javascript:undefined"
            [ngClass]="{ disabled: loading }"
            (click)="activePageChange.emit(pageNr)"
            >{{ pageNr }}</a
          >
        </li>
        <li *ngIf="$last && maxPage > currentPage" class="page-item">
          <a
            class="page-link"
            href="javascript:undefined"
            [ngClass]="{
              disabled: loading || maxPage <= currentPage
            }"
            (click)="activePageChange.emit(currentPage + 1)"
            >&gt;</a
          >
        </li>
      </ng-container>
    </ul>
  `,
  styles: [
    `
      :host {
        display: block;
      }
    `,
  ],
  encapsulation: ViewEncapsulation.Emulated,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PaginationComponent {
  @Input() loading = false;
  @Input()
  set paginationData(paginationData: PaginationData) {
    this.currentPage = paginationData.currentPage;
    this.displayPagesNrs = this._toPagesRange(
      paginationData.currentPage,
      paginationData.lastPage
    );
    this.maxPage = paginationData.lastPage;
  }

  @Output() activePageChange = new EventEmitter<number>();

  currentPage = 1;
  maxPage = 1;
  displayPagesNrs: number[] = [];

  _toPagesRange = (pageNr: number, lastPage: number) => {
    const maxRange = this._toMaxRange(pageNr, lastPage);
    const minRange = this._toMinRange(pageNr, maxRange);
    return range(minRange + 1, maxRange + 1);
  };
  _toMaxRange = (pageNr: number, lastPage: number) => {
    const maxRange =
      pageNr + PAGE_MARGIN < INITIAL_PAGES_SIZE
        ? INITIAL_PAGES_SIZE
        : pageNr + PAGE_MARGIN;
    return maxRange > lastPage ? lastPage : maxRange;
  };
  _toMinRange = (pageNr: number, maxRange: number) => {
    let minRange = pageNr - PAGE_MARGIN < 1 ? 1 : pageNr - PAGE_MARGIN;
    const rangeDiff = maxRange - minRange;
    minRange =
      rangeDiff < INITIAL_PAGES_SIZE ? maxRange - INITIAL_PAGES_SIZE : minRange;
    return minRange < MIN_PAGE_NR ? MIN_PAGE_NR : minRange;
  };
}
