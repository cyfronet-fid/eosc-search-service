import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FilterRangeComponent } from './filter-range.component';
import { NzSliderModule } from 'ng-zorro-antd/slider';
import { FormsModule } from '@angular/forms';
import { FilterLabelModule } from '@components/filters/filters-layouts/filter-label.module';

@NgModule({
  declarations: [FilterRangeComponent],
  imports: [CommonModule, NzSliderModule, FormsModule, FilterLabelModule],
  exports: [FilterRangeComponent],
})
export class FilterRangeModule {}
