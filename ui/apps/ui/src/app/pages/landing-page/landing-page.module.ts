import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LandingPageComponent } from './landing-page.component';
import { RouterModule } from '@angular/router';
import { SearchInputModule } from '../../components/search-input/search-input.module';

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
    SearchInputModule,
  ],
})
export class LandingPageModule {}
