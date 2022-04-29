/* eslint-disable @typescript-eslint/no-explicit-any  */

import { Component, Input } from '@angular/core';

@Component({
  selector: 'ess-resource',
  template: `
    <div class="card__container dashboard__recommended-resource">
      <div class="row">
        <div class="col-3 recommended-resource__img">
          <img src="{{ resource.imgSrc }}" alt="" />
        </div>
        <div class="col-9 recommended-resource__details">
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
          <div class="row">
            <div class="col">
              <div class="form-check">
                <input
                  class="form-check-input"
                  type="checkbox"
                  value=""
                  id="compare"
                />
                <label class="form-check-label" for="compare">
                  Default checkbox
                </label>
              </div>
            </div>
            <div class="col">
              <div class="form-check">
                <input
                  class="form-check-input"
                  type="checkbox"
                  value=""
                  id="favourite"
                />
                <label class="form-check-label" for="favourite">
                  Default checkbox
                </label>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
})
export class ResourceComponent {
  @Input()
  resource!: any | null;
}
