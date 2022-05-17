import { Component, EventEmitter, Input, Output } from '@angular/core';
import {IArticle} from "@eosc-search-service/search";

@Component({
  selector: 'ess-article-list',
  template: `
    <div id="results">
      <ess-article
        *ngFor="let article of articles"
        [article]="article"
        (click)="setActive.emit(article)"
      ></ess-article>
    </div>
  `,
})
export class ArticleListComponent {
  @Input()
  articles: IArticle[] = [];

  @Output()
  setActive = new EventEmitter<IArticle>();
}
