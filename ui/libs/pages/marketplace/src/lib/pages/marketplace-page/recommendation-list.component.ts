/* eslint-disable @typescript-eslint/no-explicit-any  */

import { Component, Input } from '@angular/core';

@Component({
  selector: 'ess-recommendation-list',
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
          <ess-recommendation [resource]="resource"> </ess-recommendation>
        </div>
      </div>
    </section>
  `,
})
export class RecommendationListComponent {
  @Input()
  recommendations!: any[] | null;
}
