import { Component, Input } from '@angular/core';
import {IArticle} from "@eosc-search-service/search";

@Component({
  selector: 'ess-article',
  template: `
    <div class="card__container dashboard__search-result">
      <div class="row">
        <div class="col-12 search-result__details">
          <a
            [href]="toUrl(article)"
            target="_blank"
            class="fs-4 text-secondary"
          >
            {{ article.title }}
          </a>
          <ngb-rating [max]="5" [rate]="5" [readonly]="true"> </ngb-rating>
          <p class="text-muted">
            <small>{{ article.title }}</small>
          </p>
          <p>
            <small>Authors: {{ toAuthors(article) }}</small>
          </p>
        </div>
      </div>
    </div>
  `,
  styles: [],
})
export class SimplifiedArticleComponent {
  @Input() article!: IArticle;

  toUrl = (article: IArticle | undefined): string =>
    'https://explore.openaire.eu/search/publication?articleId=' +
    ('' + article?.id).substring(3);
  toAuthors = (article: IArticle | null) =>
    (article?.author_names || []).join('; ');
}
