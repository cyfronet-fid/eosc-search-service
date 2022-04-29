import { Component } from '@angular/core';
import * as trainingsJSON from './training-catalog-page.data.mock.json';
import { ITraining } from '../../state';

@Component({
  selector: 'ess-training-catalog-page',
  template: `
    <div class="row" id="dashboard__main">
      <div class="col-3" id="dashboard__filters">
        <ess-category-list [categories]="categories"></ess-category-list>
        <ess-training-filters></ess-training-filters>
      </div>
      <div class="col-9">
        <ess-training-list [trainings]="trainings"></ess-training-list>
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
