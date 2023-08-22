import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { UiDropdownComponent } from './ui-dropdown.component';

@NgModule({
  declarations: [UiDropdownComponent],
  imports: [CommonModule, ReactiveFormsModule],
  exports: [UiDropdownComponent],
})
export class UiControlsModule {}
