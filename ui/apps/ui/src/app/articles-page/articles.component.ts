import { Component, EventEmitter, Input, Output } from '@angular/core';
import { IArticle } from './article.interface';

@Component({
  selector: 'ui-articles',
  template: `
    <div id="results">
      <ui-article
        *ngFor="let article of articles"
        [article]="article"
        (click)="setActive.emit(article)"
      ></ui-article>
    </div>
  `,
})
export class ArticlesComponent {
  @Input()
  articles!: IArticle[] | null;

  @Output()
  setActive = new EventEmitter<IArticle>();
}
