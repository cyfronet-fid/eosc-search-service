import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SearchInputComponent } from './search-input.component';
import { RouterModule } from '@angular/router';
import { ReactiveFormsModule } from '@angular/forms';

@NgModule({
  declarations: [SearchInputComponent],
  imports: [CommonModule, RouterModule, ReactiveFormsModule],
  exports: [SearchInputComponent],
})
export class SearchInputModule {}
