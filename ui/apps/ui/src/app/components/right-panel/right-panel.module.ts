import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { RightPanelComponent } from './right-panel.component';
import { NzMenuModule } from 'ng-zorro-antd/menu';

@NgModule({
  declarations: [RightPanelComponent],
  imports: [CommonModule, RouterModule, NzMenuModule],
  exports: [RightPanelComponent],
})
export class RightPanelModule {}
