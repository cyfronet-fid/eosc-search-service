import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FilterDateComponent } from './filter-date.component';
import { NzDatePickerModule } from 'ng-zorro-antd/date-picker';
import { FormsModule } from '@angular/forms';

@NgModule({
  declarations: [FilterDateComponent],
  imports: [CommonModule, NzDatePickerModule, FormsModule],
  exports: [FilterDateComponent],
})
export class FilterDateModule {}
