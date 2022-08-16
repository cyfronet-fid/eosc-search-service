import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FilterMultiselectComponent } from './filter-multiselect.component';
import { CheckboxesTreeComponent } from './checkboxes-tree.component';
import { NzSkeletonModule } from 'ng-zorro-antd/skeleton';
import { NzTreeViewModule } from 'ng-zorro-antd/tree-view';
import {ScrollingModule} from "@angular/cdk/scrolling";
import {NzIconModule} from "ng-zorro-antd/icon";
import {ReactiveFormsModule} from "@angular/forms";

@NgModule({
  declarations: [FilterMultiselectComponent, CheckboxesTreeComponent],
    imports: [CommonModule, NzSkeletonModule, NzTreeViewModule, ScrollingModule, NzIconModule, ReactiveFormsModule],
  exports: [FilterMultiselectComponent],
})
export class FilterMultiselectModule {}
