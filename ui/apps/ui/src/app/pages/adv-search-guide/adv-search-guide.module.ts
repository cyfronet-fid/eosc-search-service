import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { AdvSearchGuideComponent } from './adv-search-guide.component';
import { BackToSearchBarModule } from '@components/back-to-search-bar/back-to-search-bar.module';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

@NgModule({
  declarations: [AdvSearchGuideComponent],
  imports: [
    NgbModule,
    CommonModule,
    BackToSearchBarModule,
    RouterModule.forChild([
      {
        path: '',
        component: AdvSearchGuideComponent,
      },
    ]),
  ],
})
export class AdvSearchGuideModule {}
