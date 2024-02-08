import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FilterDateStartEndComponent } from './filter-date-start-end.component';
import { NzDatePickerModule } from 'ng-zorro-antd/date-picker';
import { FormsModule } from '@angular/forms';
import { FilterLabelModule } from '@components/filters/filters-layouts/filter-label.module';

@NgModule({
  declarations: [FilterDateStartEndComponent],
  imports: [CommonModule, NzDatePickerModule, FormsModule, FilterLabelModule],
  exports: [FilterDateStartEndComponent],
})
export class FilterDateStartEndModule {}
