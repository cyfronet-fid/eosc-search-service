import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FiltersComponent } from './filters.component';
import { NzTreeModule } from 'ng-zorro-antd/tree';
import { NzBadgeModule } from 'ng-zorro-antd/badge';
import { CheckboxesTreeModule } from '../checkboxes-tree/checkboxes-tree.module';

@NgModule({
  declarations: [FiltersComponent],
  exports: [FiltersComponent],
  imports: [CommonModule, NzTreeModule, NzBadgeModule, CheckboxesTreeModule],
})
export class FiltersModule {}
