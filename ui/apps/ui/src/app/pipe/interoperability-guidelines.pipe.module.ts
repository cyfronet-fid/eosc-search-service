import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  InteroperabilityGuidelinesFilterPipe,
  InteroperabilityGuidelinesTransformDatePipe,
  InteroperabilityGuidelinesTypeFilterPipe,
} from '../pipe/interoperability-guidelines-filter.pipe';

@NgModule({
  declarations: [
    InteroperabilityGuidelinesFilterPipe,
    InteroperabilityGuidelinesTypeFilterPipe,
    InteroperabilityGuidelinesTransformDatePipe,
  ],
  imports: [CommonModule],
  exports: [
    InteroperabilityGuidelinesFilterPipe,
    InteroperabilityGuidelinesTypeFilterPipe,
    InteroperabilityGuidelinesTransformDatePipe,
  ],
})
export class InteroperabilityGuidelinesPipeModule {}
