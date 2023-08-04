import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NzTreeViewModule } from 'ng-zorro-antd/tree-view';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { FiltersComponent } from './filters.component';
import { FilterMultiselectModule } from './filter-multiselect/filter-multiselect.module';
import { FilterDateYearModule } from '@components/filters/filter-date/filter-date-year.module';
import { FilterDateCalendarModule } from '@components/filters/filter-date/filter-date-calendar.module';
import { FilterRangeModule } from '@components/filters/filter-range/filter-range.module';
import { FilterService } from '@components/filters/filters.service';

@NgModule({
  declarations: [FiltersComponent],
  imports: [
    CommonModule,
    NzTreeViewModule,
    NzIconModule,
    FilterMultiselectModule,
    FilterDateYearModule,
    FilterDateCalendarModule,
    FilterRangeModule,
  ],
  providers: [FilterService],
  exports: [FiltersComponent],
})
export class FiltersModule {}
