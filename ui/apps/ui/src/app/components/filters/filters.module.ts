import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NzTreeViewModule } from 'ng-zorro-antd/tree-view';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { FiltersComponent } from './filters.component';
import { FilterMultiselectModule } from './filter-multiselect/filter-multiselect.module';
import { FilterDateModule } from '@components/filters/filter-date/filter-date.module';
import { FilterRangeModule } from '@components/filters/filter-range/filter-range.module';

@NgModule({
  declarations: [FiltersComponent],
  imports: [
    CommonModule,
    NzTreeViewModule,
    NzIconModule,
    FilterMultiselectModule,
    FilterDateModule,
    FilterRangeModule,
  ],
  exports: [FiltersComponent],
})
export class FiltersModule {}
