import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { PrivacyPolicyComponent } from '@pages/privacy-policy/privacy-policy.component';
import { SearchBarModule } from '@components/search-bar/search-bar.module';

@NgModule({
  declarations: [PrivacyPolicyComponent],
  imports: [
    CommonModule,
    SearchBarModule,
    RouterModule.forChild([
      {
        path: '',
        component: PrivacyPolicyComponent,
      },
    ]),
  ],
})
export class PrivacyPolicyModule {}
