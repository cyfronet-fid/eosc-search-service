import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { AcceptableUsePolicyComponent } from '@pages/acceptable-use-policy/acceptable-use-policy.component';
import { BackToSearchBarModule } from '@components/back-to-search-bar/back-to-search-bar.module';

@NgModule({
  declarations: [AcceptableUsePolicyComponent],
  imports: [
    CommonModule,
    BackToSearchBarModule,
    RouterModule.forChild([
      {
        path: '',
        component: AcceptableUsePolicyComponent,
      },
    ]),
  ],
})
export class AcceptableUsePolicyModule {}
