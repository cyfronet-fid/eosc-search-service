import { Component, Input } from '@angular/core';
import { ITraining } from './training.interface';
import { ILanguages, languages } from './language.interface';

@Component({
  selector: 'ui-training',
  template: `
    <div class="card__container dashboard__recommended-resource">
      <div class="recommended-resource__details">
        <p class="fs-4 text-secondary">{{ training?.title }}</p>
        <ngb-rating
          [max]="training?.rating || 0"
          [rate]="training?.rating || 0"
          [readonly]="true"
        >
        </ngb-rating>
        ({{ training?.rating }})
        <p class="text-muted">
          <small>{{ training?.description }}</small>
        </p>
        <p>
          <small>Organisation: {{ training?.organization }}</small>
        </p>
        <p>
          <small>Author: {{ training?.author }}</small>
        </p>
        <p>
          <small>Language: {{ toLanguage(training) }}</small>
        </p>
        <button class="btn btn-primary">Read more</button>
      </div>
    </div>
  `,
})
export class TrainingComponent {
  @Input()
  training!: ITraining | null;

  @Input()
  languages: ILanguages = languages;

  toLanguage(training: ITraining | null): string {
    if (!training || !training.languageAlphaCode2) {
      return '';
    }

    return `${languages[training.languageAlphaCode2].nativeName} (${
      languages[training.languageAlphaCode2].name
    })`;
  }
}
