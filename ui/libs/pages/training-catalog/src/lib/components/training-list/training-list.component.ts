import { Component, Input } from '@angular/core';
import { ITraining } from '../../state';

@Component({
  selector: 'ess-training-list',
  template: `
    <section id="dashboard__recommended-resources">
      <p>
        <b>Recommended trainings</b>
        &nbsp;&nbsp;
        <span class="text-secondary">Browse recommended trainings (20)</span>
      </p>

      <ess-training
        *ngFor="let training of trainings"
        [training]="training"
      ></ess-training>
    </section>
  `,
})
export class TrainingListComponent {
  @Input() trainings: ITraining[] = [];
}
