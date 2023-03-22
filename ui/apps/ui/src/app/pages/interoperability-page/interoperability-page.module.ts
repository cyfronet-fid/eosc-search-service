import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { SearchInputModule } from '../../components/search-input/search-input.module';
import { InteroperabilityPageComponent } from '@pages/interoperability-page/interoperability-page.component';

@NgModule({
  declarations: [InteroperabilityPageComponent],
  imports: [
    CommonModule,
    RouterModule.forChild([
      {
        path: '',
        component: InteroperabilityPageComponent,
      },
    ]),
    SearchInputModule,
  ],
})
export class InteroperabilityPageModule {}
