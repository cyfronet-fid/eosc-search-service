/* eslint-disable @typescript-eslint/no-explicit-any  */

import { Component, Input } from '@angular/core';

@Component({
  selector: 'ui-resources',
  template: `
    <section id="dashboard__recommended-resources">
      <p>
        <b>Recommended resources</b>
        &nbsp;&nbsp;
        <span class="text-secondary">Browse recommended resources (20)</span>
      </p>
      <ng-container *ngFor="let recommendedResource of resources">
        <div class="card__container dashboard__recommended-resource">
          <div class="row">
            <div class="col-3 recommended-resource__img">
              <img src="{{ recommendedResource.imgSrc }}" />
            </div>
            <div class="col-9 recommended-resource__details">
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
      </ng-container>
    </section>
  `,
})
export class ResourcesComponent {
  @Input()
  resources!: any[] | null;
}
