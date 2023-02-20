import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BackToSearchBarComponent } from '@components/back-to-search-bar/back-to-search-bar.component';
import { RouterModule } from '@angular/router';

@NgModule({
  declarations: [BackToSearchBarComponent],
  imports: [CommonModule, RouterModule],
  exports: [BackToSearchBarComponent],
})
export class BackToSearchBarModule {}
