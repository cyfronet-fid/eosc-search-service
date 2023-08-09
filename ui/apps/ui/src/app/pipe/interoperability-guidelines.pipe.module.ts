import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  InteroperabilityGuidelinesFilterPipe,
  InteroperabilityGuidelinesTransformDatePipe,
  TransformArrayDescriptionPipe,
} from '../pipe/interoperability-guidelines-filter.pipe';

@NgModule({
  declarations: [
    InteroperabilityGuidelinesFilterPipe,
    InteroperabilityGuidelinesTransformDatePipe,
    TransformArrayDescriptionPipe,
  ],
  imports: [CommonModule],
  exports: [
    InteroperabilityGuidelinesFilterPipe,
    InteroperabilityGuidelinesTransformDatePipe,
    TransformArrayDescriptionPipe,
  ],
})
export class InteroperabilityGuidelinesPipeModule {}
