import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FilterDateYearComponent } from './filter-date-year.component';
import { NzDatePickerModule } from 'ng-zorro-antd/date-picker';
import { FormsModule } from '@angular/forms';
import { FilterLabelModule } from '@components/filters/filters-layouts/filter-label.module';

@NgModule({
  declarations: [FilterDateYearComponent],
  imports: [CommonModule, NzDatePickerModule, FormsModule, FilterLabelModule],
  exports: [FilterDateYearComponent],
})
export class FilterDateYearModule {}
