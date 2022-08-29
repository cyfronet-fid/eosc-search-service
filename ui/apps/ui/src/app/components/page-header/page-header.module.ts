import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PageHeaderComponent } from './page-header.component';
import { NzBreadCrumbModule } from 'ng-zorro-antd/breadcrumb';

@NgModule({
  declarations: [PageHeaderComponent],
  imports: [CommonModule, NzBreadCrumbModule],
  exports: [PageHeaderComponent],
})
export class PageHeaderModule {}
