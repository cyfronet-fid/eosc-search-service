import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FilterDateComponent } from './filter-date.component';
import { NzDatePickerModule } from 'ng-zorro-antd/date-picker';
import { FormsModule } from '@angular/forms';
import { FilterLabelModule } from '@components/filters/filters-layouts/filter-label.module';

@NgModule({
  declarations: [FilterDateComponent],
  imports: [CommonModule, NzDatePickerModule, FormsModule, FilterLabelModule],
  exports: [FilterDateComponent],
})
export class FilterDateModule {}
