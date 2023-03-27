import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { InteroperabilityGuidelinesDetailsPageComponent } from '@pages/interoperability-guidelines-details-page/interoperability-guidelines-details-page.component';
import { BackToSearchBarModule } from '@components/back-to-search-bar/back-to-search-bar.module';
import { InteroperabilityGuidelinesAboutComponent } from '@components/interoperability/interoperability-guidelines-about.component';

@NgModule({
  declarations: [
    InteroperabilityGuidelinesDetailsPageComponent,
    InteroperabilityGuidelinesAboutComponent,
  ],
  imports: [
    CommonModule,
    BackToSearchBarModule,
    RouterModule.forChild([
      {
        path: '',
        component: InteroperabilityGuidelinesDetailsPageComponent,
      },
    ]),
  ],
})
export class InteroperabilityGuidelinesDetailsPageModule {}
