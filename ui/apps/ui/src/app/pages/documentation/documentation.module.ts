import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { DocumentationComponent } from '@pages/documentation/documentation.component';
import { BackToSearchBarModule } from '@components/back-to-search-bar/back-to-search-bar.module';

@NgModule({
  declarations: [DocumentationComponent],
  imports: [
    CommonModule,
    BackToSearchBarModule,
    RouterModule.forChild([
      {
        path: '',
        component: DocumentationComponent,
      },
    ]),
  ],
})
export class DocumentationModule {}
