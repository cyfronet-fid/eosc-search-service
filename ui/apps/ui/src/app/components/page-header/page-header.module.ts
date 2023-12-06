import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PageHeaderComponent } from './page-header.component';
import { NzBreadCrumbModule } from 'ng-zorro-antd/breadcrumb';
import { SortByFunctionalityComponent } from '@components/sort-by-functionality/sort-by-functionality.component';
import { ReactiveFormsModule } from '@angular/forms';
import { DownloadResultsModule } from '@components/download-results/download-results.module';
import { FilterMultiselectDropdownModule } from '@components/filters/filter-multiselect-dropdown/filter-multiselect-dropdown.module';

@NgModule({
  declarations: [PageHeaderComponent, SortByFunctionalityComponent],
  imports: [
    CommonModule,
    NzBreadCrumbModule,
    ReactiveFormsModule,
    DownloadResultsModule,
    FilterMultiselectDropdownModule,
  ],
  exports: [PageHeaderComponent, SortByFunctionalityComponent],
})
export class PageHeaderModule {}
