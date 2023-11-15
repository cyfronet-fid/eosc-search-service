import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FilterMultiselectDropdownComponent } from '@components/filters/filter-multiselect-dropdown/filter-multiselect-dropdown.component';
import { FormsModule } from '@angular/forms';
import { NzTreeSelectModule } from 'ng-zorro-antd/tree-select';
import { NgbTooltipModule } from '@ng-bootstrap/ng-bootstrap';

@NgModule({
  declarations: [FilterMultiselectDropdownComponent],
  imports: [CommonModule, FormsModule, NzTreeSelectModule, NgbTooltipModule],
  exports: [FilterMultiselectDropdownComponent],
})
export class FilterMultiselectDropdownModule {}
