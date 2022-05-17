import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CheckboxesTreeComponent } from './checkboxes-tree.component';
import { NzTreeViewModule } from 'ng-zorro-antd/tree-view';
import { NzIconModule } from 'ng-zorro-antd/icon';

@NgModule({
  declarations: [CheckboxesTreeComponent],
  exports: [CheckboxesTreeComponent],
  imports: [CommonModule, NzTreeViewModule, NzIconModule],
})
export class CheckboxesTreeModule {}
