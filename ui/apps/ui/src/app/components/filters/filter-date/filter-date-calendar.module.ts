import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FilterDateCalendarComponent } from './filter-date-calendar.component';
import { NzDatePickerModule } from 'ng-zorro-antd/date-picker';
import { FormsModule } from '@angular/forms';
import { FilterLabelModule } from '@components/filters/filters-layouts/filter-label.module';

@NgModule({
  declarations: [FilterDateCalendarComponent],
  imports: [CommonModule, NzDatePickerModule, FormsModule, FilterLabelModule],
  exports: [FilterDateCalendarComponent],
})
export class FilterDateCalendarModule {}
