import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { SearchInputModule } from '../../components/search-input/search-input.module';
import { InteroperabilityPageComponent } from '@pages/interoperability-page/interoperability-page.component';
import { BackToSearchBarModule } from '@components/back-to-search-bar/back-to-search-bar.module';
import { BasicSearchInputModule } from '@components/basic-search-input/basic-search-input.module';
import { InteroperabilityGuidelineModule } from '@components/interoperability/interoperability-guideline.module';

@NgModule({
  declarations: [InteroperabilityPageComponent],
  imports: [
    CommonModule,
    BackToSearchBarModule,
    RouterModule.forChild([
      {
        path: '',
        component: InteroperabilityPageComponent,
      },
    ]),
    SearchInputModule,
    BasicSearchInputModule,
    InteroperabilityGuidelineModule,
  ],
})
export class InteroperabilityPageModule {}
