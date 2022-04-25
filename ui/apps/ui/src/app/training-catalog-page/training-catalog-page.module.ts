import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TrainingCatalogPageComponent } from './training-catalog-page.component';
import { TrainingsComponent } from './trainings.component';
import { CategoriesModule } from '@ui/core';
import { TrainingComponent } from './training.component';
import { NgbRatingModule } from '@ng-bootstrap/ng-bootstrap';

@NgModule({
  declarations: [
    TrainingCatalogPageComponent,
    TrainingsComponent,
    TrainingComponent,
  ],
  imports: [CommonModule, CategoriesModule, NgbRatingModule],
})
export class TrainingCatalogPageModule {}
