import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ColoredTagsComponent } from './colored-tags.component';
import { RouterModule } from '@angular/router';
import { InteroperabilityGuidelinesPipeModule } from '../../pipe/interoperability-guidelines.pipe.module';

@NgModule({
  declarations: [ColoredTagsComponent],
  imports: [CommonModule, RouterModule, InteroperabilityGuidelinesPipeModule],
  exports: [ColoredTagsComponent],
})
export class ColoredTagsModule {}
