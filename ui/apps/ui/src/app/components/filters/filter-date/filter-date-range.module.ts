import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FilterDateRangeComponent } from './filter-date-range.component';
import { NzDatePickerModule } from 'ng-zorro-antd/date-picker';
import { FormsModule } from '@angular/forms';
import { FilterLabelModule } from '@components/filters/filters-layouts/filter-label.module';

@NgModule({
  declarations: [FilterDateRangeComponent],
  imports: [CommonModule, NzDatePickerModule, FormsModule, FilterLabelModule],
  exports: [FilterDateRangeComponent],
})
export class FilterDateRangeModule {}
