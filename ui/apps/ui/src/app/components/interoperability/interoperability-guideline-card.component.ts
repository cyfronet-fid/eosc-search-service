import { Component, Input } from '@angular/core';

@Component({
  selector: 'ess-interoperability-guideline-card',
  templateUrl: './interoperability-guideline-card.component.html',
  styleUrls: ['./interoperability-guideline-card.component.scss'],
})
export class InteroperabilityGuidelineCardComponent {
  @Input() authorName!: string;
  @Input() type!: string;
  @Input() description!: string;
}
