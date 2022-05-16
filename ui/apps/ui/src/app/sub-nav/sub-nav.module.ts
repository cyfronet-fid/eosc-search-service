import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SubNavComponent } from './sub-nav.component';
import { AppRoutingModule } from '../app-routing.module';

@NgModule({
  declarations: [SubNavComponent],
  imports: [CommonModule, AppRoutingModule],
  exports: [SubNavComponent],
})
export class SubNavModule {}
