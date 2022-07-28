import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  OnChanges,
  Output,
  SimpleChanges,
  ViewEncapsulation,
} from '@angular/core';
import { IPage } from '@eosc-search-service/search';

@Component({
  selector: 'ess-pagination',
  template: `
    <ul class="pagination">
      <ng-container *ngFor="let page of displayPages; last as $last; first as $first">
        <li
          *ngIf="$first"
          class="page-item"
          [ngClass]="{ disabled: activePage === 0 || loading}"
        >
          <a
            class="page-link"
            href="javascript:undefined"
            (click)="pageSelected.emit(0)"
          >&lt;&lt;</a
          >
        </li>
        <li
          *ngIf="$first"
          class="page-item"
          [ngClass]="{ disabled: activePage === 0 || loading}"
        >
          <a
            class="page-link"
            href="javascript:undefined"
            (click)="pageSelected.emit(activePage - 1)"
            >&lt;</a
          >
        </li>
        <li class="page-item" [ngClass]="{ active: activePage === page.index }">
          <a
            class="page-link"
            href="javascript:undefined"
            [ngClass]="{ disabled: loading}"
            (click)="pageSelected.emit(page.index)"
            >{{ page.index + 1 }}</a
          >
        </li>
        <li *ngIf="$last" class="page-item">
          <a
            class="page-link"
            href="javascript:undefined"
            [ngClass]="{ disabled: loading || (maxPage ?? 0) <= activePage + 1}"
            (click)="pageSelected.emit(activePage + 1)"
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
export class PaginationComponent implements OnChanges {
  readonly PAGE_MARGIN: number = 2;
  @Input() pages: IPage[] = [];
  @Input() maxPage: number | null = null;
  @Input() loading = false;
  @Input() activePage = 0;
  @Output() pageSelected = new EventEmitter<number>();

  displayPages: IPage[] = [];

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['pages'] != null || changes['activePage'] != null) {
      this.displayPages = this.pages.filter(
        (page, index) =>
          index >= this.activePage - this.PAGE_MARGIN &&
          index <= this.activePage + this.PAGE_MARGIN
      );
    }
  }
}
