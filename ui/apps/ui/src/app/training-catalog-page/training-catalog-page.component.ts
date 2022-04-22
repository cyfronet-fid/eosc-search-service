import { Component } from '@angular/core';

@Component({
  selector: 'ui-training-catalog-page',
  template: `
    <div class="row" id="dashboard__main">
      <div class="col-3" id="dashboard__filters">
        <core-categories [categories]="categories"></core-categories>
      </div>
      <div class="col-9">
        <ui-trainings [trainings]="trainings"></ui-trainings>
      </div>
    </div>
  `,
})
export class TrainingCatalogPageComponent {
  categories = [];
  trainings = [];
}
