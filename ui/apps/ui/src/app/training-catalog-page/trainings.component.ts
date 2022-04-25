import { Component, Input } from '@angular/core';
import { ITraining } from './training.interface';

@Component({
  selector: 'ui-trainings',
  template: ` <p>trainings works!</p>`,
})
export class TrainingsComponent {
  @Input()
  trainings!: ITraining[] | null;
}
