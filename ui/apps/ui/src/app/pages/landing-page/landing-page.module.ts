import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LandingPageComponent } from './landing-page.component';
import { RouterModule } from '@angular/router';
import { LayoutModule } from '@eosc-search-service/layout';

@NgModule({
  declarations: [LandingPageComponent],
  imports: [
    CommonModule,
    RouterModule.forChild([
      {
        path: '',
        component: LandingPageComponent,
      },
    ]),
    LayoutModule,
  ],
})
export class LandingPageModule {}
