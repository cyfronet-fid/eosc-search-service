import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DescriptionComponent } from './description.component';
import { RouterModule } from '@angular/router';

@NgModule({
  declarations: [DescriptionComponent],
  imports: [CommonModule, RouterModule],
  exports: [DescriptionComponent],
})
export class DescriptionModule {}
