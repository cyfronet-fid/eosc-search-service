import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { VerticalFiltersComponent } from './vertical-filters.component';
import { VerticalFilterComponent } from './vertical-filter.component';
import { NzTreeModule } from 'ng-zorro-antd/tree';

@NgModule({
  declarations: [VerticalFiltersComponent, VerticalFilterComponent],
  imports: [CommonModule, NzTreeModule],
  exports: [VerticalFiltersComponent],
})
export class VerticalFitlersModule {}
