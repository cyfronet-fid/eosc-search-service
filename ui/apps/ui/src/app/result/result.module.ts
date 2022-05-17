import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ResultComponent } from './result.component';
import { AppRoutingModule } from '../app-routing.module';

@NgModule({
  declarations: [ResultComponent],
  exports: [ResultComponent, ResultComponent],
  imports: [CommonModule, AppRoutingModule],
})
export class ResultModule {}
