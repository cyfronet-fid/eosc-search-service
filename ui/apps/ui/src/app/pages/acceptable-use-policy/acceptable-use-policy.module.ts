import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { AcceptableUsePolicyComponent } from '@pages/acceptable-use-policy/acceptable-use-policy.component';
import { SearchBarModule } from '@components/search-bar/search-bar.module';

@NgModule({
  declarations: [AcceptableUsePolicyComponent],
  imports: [
    CommonModule,
    SearchBarModule,
    RouterModule.forChild([
      {
        path: '',
        component: AcceptableUsePolicyComponent,
      },
    ]),
  ],
})
export class AcceptableUsePolicyModule {}
