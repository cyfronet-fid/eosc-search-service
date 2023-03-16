import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PageHeaderComponent } from './page-header.component';
import { NzBreadCrumbModule } from 'ng-zorro-antd/breadcrumb';
import { SortByFunctionalityComponent } from '@components/sort-by-functionality/sort-by-functionality.component';
import { ReactiveFormsModule } from '@angular/forms';

@NgModule({
  declarations: [PageHeaderComponent, SortByFunctionalityComponent],
  imports: [CommonModule, NzBreadCrumbModule, ReactiveFormsModule],
  exports: [PageHeaderComponent],
})
export class PageHeaderModule {}
