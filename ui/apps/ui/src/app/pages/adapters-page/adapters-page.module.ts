import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AdapterDetailPageComponent } from './adapter-detail-page.component';
import { RouterModule } from '@angular/router';
import { BackToSearchBarModule } from '@components/back-to-search-bar/back-to-search-bar.module';
import { IgServicesCardModule } from '../../layouts/ig-services-card/ig-services-card.module';
import { InteroperabilityGuidelinesPipeModule } from '../../pipe/interoperability-guidelines.pipe.module';
import { SliceReleasePipe } from '@pages/adapters-page/slice-release.pipe';

@NgModule({
  imports: [
    CommonModule,
    BackToSearchBarModule,
    RouterModule.forChild([
      {
        path: ':adapterId',
        component: AdapterDetailPageComponent,
      },
    ]),
    IgServicesCardModule,
    InteroperabilityGuidelinesPipeModule,
  ],

  declarations: [AdapterDetailPageComponent, SliceReleasePipe],
  exports: [AdapterDetailPageComponent],
})
export class AdaptersPageModule {}
