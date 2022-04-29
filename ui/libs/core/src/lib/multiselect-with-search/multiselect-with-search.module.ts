import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MultiselectWithSearchComponent } from './multiselect-with-search.component';
import { NzTreeModule } from 'ng-zorro-antd/tree';

@NgModule({
  declarations: [MultiselectWithSearchComponent],
  imports: [CommonModule, NzTreeModule],
  exports: [MultiselectWithSearchComponent],
})
export class MultiselectWithSearchModule {}
