import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  InteroperabilityGuidelinesFilterPipe,
  InteroperabilityGuidelinesTransformDatePipe,
} from '../pipe/interoperability-guidelines-filter.pipe';

@NgModule({
  declarations: [
    InteroperabilityGuidelinesFilterPipe,
    InteroperabilityGuidelinesTransformDatePipe,
  ],
  imports: [CommonModule],
  exports: [
    InteroperabilityGuidelinesFilterPipe,
    InteroperabilityGuidelinesTransformDatePipe,
  ],
})
export class InteroperabilityGuidelinesPipeModule {}
