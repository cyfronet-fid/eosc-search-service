import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ReactiveFormsModule } from '@angular/forms';
import { BasicSearchInputComponent } from '@components/basic-search-input/basic-search-input.component';

@NgModule({
  declarations: [BasicSearchInputComponent],
  imports: [CommonModule, RouterModule, ReactiveFormsModule],
  exports: [BasicSearchInputComponent],
})
export class BasicSearchInputModule {}
