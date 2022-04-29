/* eslint-disable @typescript-eslint/no-explicit-any  */

import { Component, Input } from '@angular/core';

@Component({
  selector: 'ess-recommendation',
  template: `
    <div class="card__container">
      <p class="fs-4 text-secondary">{{ resource.label }}</p>
      <ngb-rating
        [max]="resource.rating"
        [rate]="resource.rating"
        [readonly]="true"
      >
      </ngb-rating>
      ({{ resource.rating }})
      <p class="text-muted">
        <small>{{ resource.description }}</small>
      </p>
      <p>
        <small>Organisation: {{ resource.organisation }}</small>
      </p>
    </div>
  `,
})
export class RecommendationComponent {
  @Input()
  resource!: any | null;
}
