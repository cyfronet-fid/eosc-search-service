import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CollectionsNavigationComponent } from './collections-navigation.component';
import { RouterModule } from '@angular/router';

@NgModule({
  declarations: [CollectionsNavigationComponent],
  imports: [CommonModule, RouterModule],
  exports: [CollectionsNavigationComponent],
})
export class CollectionsNavigationModule {}
