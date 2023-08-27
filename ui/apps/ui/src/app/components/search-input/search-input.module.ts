import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SearchInputComponent } from './search-input.component';
import { RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NzTagModule } from 'ng-zorro-antd/tag';
import { NzRadioModule } from 'ng-zorro-antd/radio';

@NgModule({
  declarations: [SearchInputComponent],
  imports: [
    CommonModule,
    RouterModule,
    ReactiveFormsModule,
    NzTagModule,
    FormsModule,
    NzRadioModule,
  ],
  exports: [SearchInputComponent],
})
export class SearchInputModule {}
