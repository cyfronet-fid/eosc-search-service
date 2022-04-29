import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'ess-article-list-pagination',
  template: `
    <h3>Results {{ pageResultsNumber }} of {{ foundResultsNumber }}</h3>
    <div class="row">
      <div class="col d-grid gap-1">
        <button
          class="btn btn-light"
          type="button"
          [disabled]="hasPrevPage === false"
          (click)="prevPage.emit()"
        >
          << Prev
        </button>
      </div>
      <div class="col d-grid gap-1">
        <button
          class="btn btn-light"
          type="button"
          [disabled]="hasNextPage === false"
          (click)="nextPage.emit()"
        >
          Next >>
        </button>
      </div>
    </div>
  `,
})
export class ArticleListPaginationComponent {
  @Input()
  pageResultsNumber!: number;
  @Input()
  foundResultsNumber!: number;
  @Input()
  hasPrevPage!: boolean;
  @Input()
  hasNextPage!: boolean;

  @Output()
  prevPage = new EventEmitter<void>();
  @Output()
  nextPage = new EventEmitter<void>();
}
