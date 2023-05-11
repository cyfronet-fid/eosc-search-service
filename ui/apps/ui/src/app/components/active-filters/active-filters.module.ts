import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActiveFiltersComponent } from './active-filters.component';
import { FilterLabelModule } from '@components/filters/filters-layouts/filter-label.module';
import { InteroperabilityGuidelinesPipeModule } from '../../pipe/interoperability-guidelines.pipe.module';

@NgModule({
  declarations: [ActiveFiltersComponent],
  imports: [
    CommonModule,
    FilterLabelModule,
    InteroperabilityGuidelinesPipeModule,
  ],
  exports: [ActiveFiltersComponent],
})
export class ActiveFiltersModule {}
