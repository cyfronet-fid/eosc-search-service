import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { RightMenuComponent } from './right-menu.component';

@NgModule({
  declarations: [RightMenuComponent],
  imports: [CommonModule, RouterModule],
  exports: [RightMenuComponent],
})
export class RightMenuModule {}
