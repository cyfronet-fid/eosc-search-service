import {ChangeDetectionStrategy, Component, EventEmitter, Input, Output, ViewEncapsulation} from '@angular/core';
import {IPage} from "@eosc-search-service/search";

@Component({
  selector: 'ess-pagination',
  template: `
    <ul class="pagination">
      <ng-container *ngFor="let page of pages; last as $last">
        <li class="page-item" [ngClass]="{active: activePage === page.index}">
          <a class="page-link" href="javascript:undefined" (click)="pageSelected.emit(page.index)">{{page.index + 1}}</a>
        </li>
        <li *ngIf="$last && (maxPage ?? 0) > page.index + 1" class="page-item">
          <a class="page-link" href="javascript:undefined" (click)="pageSelected.emit(page.index + 1)">{{page.index + 2}}</a>
        </li>
      </ng-container>
    </ul>
  `,
  styles: [
    `:host {
      display: block;
    }`
  ],
  encapsulation: ViewEncapsulation.Emulated,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PaginationComponent {
  @Input() pages: IPage[] = [];
  @Input() maxPage: number | null = null;
  @Input() loading = false;
  @Input() activePage = 0;
  @Output() pageSelected = new EventEmitter<number>();
}
