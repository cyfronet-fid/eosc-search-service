import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SubHeaderComponent } from './sub-header.component';
import { NzBreadCrumbModule } from 'ng-zorro-antd/breadcrumb';
import { AppRoutingModule } from '../app-routing.module';

@NgModule({
  declarations: [SubHeaderComponent],
  imports: [CommonModule, NzBreadCrumbModule, AppRoutingModule],
  exports: [SubHeaderComponent],
})
export class SubHeaderModule {}
