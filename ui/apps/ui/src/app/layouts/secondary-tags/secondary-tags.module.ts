import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SecondaryTagsComponent } from './secondary-tags.component';
import { InteroperabilityGuidelinesPipeModule } from '../../pipe/interoperability-guidelines.pipe.module';

@NgModule({
  declarations: [SecondaryTagsComponent],
  imports: [CommonModule, InteroperabilityGuidelinesPipeModule],
  exports: [SecondaryTagsComponent],
})
export class SecondaryTagsModule {}
