import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TagsComponent } from './tags.component';
import { InteroperabilityGuidelinesPipeModule } from '../../pipe/interoperability-guidelines.pipe.module';

@NgModule({
  declarations: [TagsComponent],
  imports: [CommonModule, InteroperabilityGuidelinesPipeModule],
  exports: [TagsComponent],
})
export class TagsModule {}
