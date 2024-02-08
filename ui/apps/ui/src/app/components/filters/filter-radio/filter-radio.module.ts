import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NgbTooltipModule } from '@ng-bootstrap/ng-bootstrap';

import { FilterRadioComponent } from './filter-radio.component';
import { FilterLabelModule } from '../filters-layouts/filter-label.module';

@NgModule({
  declarations: [FilterRadioComponent],
  imports: [CommonModule, FormsModule, NgbTooltipModule, FilterLabelModule],
  exports: [FilterRadioComponent],
})
export class FilterRadioModule {}
