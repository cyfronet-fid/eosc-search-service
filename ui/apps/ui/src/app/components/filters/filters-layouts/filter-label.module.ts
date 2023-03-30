import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FilterLabelComponent } from '@components/filters/filters-layouts/filter-label.component';
import { InteroperabilityGuidelinesPipeModule } from '../../../pipe/interoperability-guidelines.pipe.module';

@NgModule({
  declarations: [FilterLabelComponent],
  imports: [CommonModule, InteroperabilityGuidelinesPipeModule],
  exports: [FilterLabelComponent],
})
export class FilterLabelModule {}
