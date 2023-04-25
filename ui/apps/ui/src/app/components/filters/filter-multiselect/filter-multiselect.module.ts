import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FilterMultiselectComponent } from './filter-multiselect.component';
import { CheckboxesTreeComponent } from './checkboxes-tree.component';
import { NzSkeletonModule } from 'ng-zorro-antd/skeleton';
import { NzTreeViewModule } from 'ng-zorro-antd/tree-view';
import { ScrollingModule } from '@angular/cdk/scrolling';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { ReactiveFormsModule } from '@angular/forms';
import { FilterLabelModule } from '@components/filters/filters-layouts/filter-label.module';
import { FirstNValuesComponent } from './first-n-values.component';
import { NzSpinModule } from 'ng-zorro-antd/spin';
import { ShowAllComponent } from './show-all.component';
import { InteroperabilityGuidelinesPipeModule } from '../../../pipe/interoperability-guidelines.pipe.module';

@NgModule({
  declarations: [
    FilterMultiselectComponent,
    CheckboxesTreeComponent,
    FirstNValuesComponent,
    ShowAllComponent,
  ],
  imports: [
    CommonModule,
    NzSkeletonModule,
    NzTreeViewModule,
    ScrollingModule,
    NzIconModule,
    ReactiveFormsModule,
    FilterLabelModule,
    NzSpinModule,
    InteroperabilityGuidelinesPipeModule,
  ],
  exports: [FilterMultiselectComponent],
})
export class FilterMultiselectModule {}
