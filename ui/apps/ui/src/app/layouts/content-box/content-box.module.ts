import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ContentBoxComponent } from '../content-box/content-box.component';
import { RouterModule } from '@angular/router';

@NgModule({
  declarations: [ContentBoxComponent],
  imports: [CommonModule, RouterModule],
  exports: [ContentBoxComponent],
})
export class ContentBoxModul {}
