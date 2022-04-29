import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'ui-articles-pagination',
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
export class ArticlesPaginationComponent {
  @Input()
  pageResultsNumber!: number | null;
  @Input()
  foundResultsNumber!: number | null;
  @Input()
  hasPrevPage!: boolean | null;
  @Input()
  hasNextPage!: boolean | null;

  @Output()
  prevPage = new EventEmitter<void>();
  @Output()
  nextPage = new EventEmitter<void>();
}
