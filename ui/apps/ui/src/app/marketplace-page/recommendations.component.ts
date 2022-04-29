/* eslint-disable @typescript-eslint/no-explicit-any  */

import { Component, Input } from '@angular/core';

@Component({
  selector: 'ui-recommendations',
  template: `
    <section id="dashboard__recommendations">
      <p>
        <b>Recommended for you</b>
        &nbsp;&nbsp;
        <span class="text-secondary"
          >See more recommendations in Your EOSC</span
        >
      </p>
      <div class="row">
        <div
          *ngFor="let resource of recommendations"
          class="col-4 dashboard__recommendation"
        >
          <ui-recommendation [resource]="resource"> </ui-recommendation>
        </div>
      </div>
    </section>
  `,
})
export class RecommendationsComponent {
  @Input()
  recommendations!: any[] | null;
}
