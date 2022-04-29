import { Component, Input } from '@angular/core';
import { ITraining } from './training.interface';

@Component({
  selector: 'ui-trainings',
  template: `
    <section id="dashboard__recommended-resources">
      <p>
        <b>Recommended trainings</b>
        &nbsp;&nbsp;
        <span class="text-secondary">Browse recommended trainings (20)</span>
      </p>

      <ui-training
        *ngFor="let training of trainings"
        [training]="training"
      ></ui-training>
    </section>
  `,
})
export class TrainingsComponent {
  @Input()
  trainings!: ITraining[] | null;
}
