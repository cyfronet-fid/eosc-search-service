import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TrainingCatalogPageComponent } from './training-catalog-page.component';
import { TrainingsComponent } from './trainings.component';
import { CategoriesModule } from '@ui/core';

@NgModule({
  declarations: [TrainingCatalogPageComponent, TrainingsComponent],
  imports: [CommonModule, CategoriesModule],
})
export class TrainingCatalogPageModule {}
