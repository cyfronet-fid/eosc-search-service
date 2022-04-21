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
        <ng-container *ngFor="let recommendedResource of recommendations">
          <div class="col-4 dashboard__recommendation">
            <div class="card__container">
              <p class="fs-4 text-secondary">{{ recommendedResource.label }}</p>
              <ngb-rating
                [max]="recommendedResource.rating"
                [rate]="recommendedResource.rating"
                [readonly]="true"
              >
              </ngb-rating>
              ({{ recommendedResource.rating }})
              <p class="text-muted">
                <small>{{ recommendedResource.description }}</small>
              </p>
              <p>
                <small
                  >Organisation: {{ recommendedResource.organisation }}</small
                >
              </p>
            </div>
          </div>
        </ng-container>
      </div>
    </section>
  `,
})
export class RecommendationsComponent {
  @Input()
  recommendations!: any[] | null;
}
