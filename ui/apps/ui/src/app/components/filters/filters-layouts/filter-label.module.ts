import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FilterLabelComponent } from '@components/filters/filters-layouts/filter-label.component';
import { InteroperabilityGuidelinesPipeModule } from '../../../pipe/interoperability-guidelines.pipe.module';
import { NgbTooltipModule } from '@ng-bootstrap/ng-bootstrap';

@NgModule({
  declarations: [FilterLabelComponent],
  imports: [
    CommonModule,
    InteroperabilityGuidelinesPipeModule,
    NgbTooltipModule,
  ],
  exports: [FilterLabelComponent],
})
export class FilterLabelModule {}
