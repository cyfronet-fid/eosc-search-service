import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FilterRangeComponent } from './filter-range.component';
import { NzSliderModule } from 'ng-zorro-antd/slider';
import { FormsModule } from '@angular/forms';

@NgModule({
  declarations: [FilterRangeComponent],
  imports: [CommonModule, NzSliderModule, FormsModule],
  exports: [FilterRangeComponent],
})
export class FilterRangeModule {}
