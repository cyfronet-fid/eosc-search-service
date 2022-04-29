import { Component, Input } from '@angular/core';
import {IArticle} from "@eosc-search-service/search";

@Component({
  selector: 'ess-detailed-article',
  template: `
    <h2 class="text-secondary">{{ article?.title }}</h2>
    <p><small>Published: 01 Jan 2013</small></p>
    <p><small>Publisher: University</small></p>
    <p><small>OPEN ACCESS GERMAN</small></p>
    <p>
      <small>Authors: {{ article?.author_names?.join(', ') }}</small>
    </p>

    <div class="row">
      <div class="col-9">
        <article>
          <b>Summary</b>
          <p class="text-secondary">
            {{ article?.description?.join(' ') }}
          </p>
        </article>
      </div>
      <div class="col-3">
        <div class="card__container">
          <p>
            Additional functionalities are available on OpenAIRE Explore page
          </p>
          <button class="btn btn-outline-primary">
            See at OpenAIRE Explore
          </button>
        </div>
      </div>
    </div>
    <div id="extras">
      <b>Download from</b>
      <ul>
        <li>
          <a href="#">Test test</a>
        </li>
      </ul>
    </div>
  `,
})
export class DetailedArticleComponent {
  @Input()
  article!: IArticle | undefined;
}
