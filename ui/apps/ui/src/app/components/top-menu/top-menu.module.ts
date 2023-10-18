import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { TopMenuComponent } from './top-menu.component';
import { NzMenuModule } from 'ng-zorro-antd/menu';

@NgModule({
  declarations: [TopMenuComponent],
  imports: [CommonModule, RouterModule, NzMenuModule],
  exports: [TopMenuComponent],
})
export class TopMenuModule {}
