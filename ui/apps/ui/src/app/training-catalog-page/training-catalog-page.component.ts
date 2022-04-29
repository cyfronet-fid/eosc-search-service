import { Component } from '@angular/core';
import * as trainingsJSON from './training-catalog-data.mock.json';
import { ITraining } from './training.interface';

@Component({
  selector: 'ui-training-catalog-page',
  template: `
    <div class="row" id="dashboard__main">
      <div class="col-3" id="dashboard__filters">
        <core-categories [categories]="categories"></core-categories>
        <ui-training-filters></ui-training-filters>
      </div>
      <div class="col-9">
        <ui-trainings [trainings]="trainings"></ui-trainings>
      </div>
    </div>
  `,
})
export class TrainingCatalogPageComponent {
  categories = [
    {
      label: 'Access physical & e-infrastructures',
      count: 12,
    },
    {
      label: 'Aggregators & integrators',
      count: 3,
    },
  ];
  trainings = (trainingsJSON as unknown as { default: unknown })
    .default as ITraining[];
}
