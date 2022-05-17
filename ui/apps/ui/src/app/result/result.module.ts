import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ResultComponent } from './result.component';

@NgModule({
  declarations: [ResultComponent],
  exports: [ResultComponent, ResultComponent],
  imports: [CommonModule],
})
export class ResultModule {}
