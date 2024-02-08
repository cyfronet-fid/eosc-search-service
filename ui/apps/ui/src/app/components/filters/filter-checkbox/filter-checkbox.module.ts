import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NgbTooltipModule } from '@ng-bootstrap/ng-bootstrap';

import { FilterCheckboxResourceTypeComponent } from './filter-checkbox-resource-type.component';
import { FilterCheckboxStatusComponent } from './filter-checkbox-status.component';
import { FilterLabelModule } from '../filters-layouts/filter-label.module';

@NgModule({
  declarations: [
    FilterCheckboxResourceTypeComponent,
    FilterCheckboxStatusComponent,
  ],
  imports: [CommonModule, FormsModule, NgbTooltipModule, FilterLabelModule],
  exports: [FilterCheckboxResourceTypeComponent, FilterCheckboxStatusComponent],
})
export class FilterCheckboxModule {}
