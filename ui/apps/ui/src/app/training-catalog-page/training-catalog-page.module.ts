import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TrainingCatalogPageComponent } from './training-catalog-page.component';
import { TrainingsComponent } from './trainings.component';
import { CategoriesModule, MultiselectWithSearchModule } from '@ui/core';
import { TrainingComponent } from './training.component';
import { NgbRatingModule } from '@ng-bootstrap/ng-bootstrap';
import { TrainingFiltersComponent } from './training-filters.component';
import { NzRadioModule } from 'ng-zorro-antd/radio';
import { FormsModule } from '@angular/forms';

@NgModule({
  declarations: [
    TrainingCatalogPageComponent,
    TrainingsComponent,
    TrainingComponent,
    TrainingFiltersComponent,
  ],
  imports: [
    CommonModule,
    CategoriesModule,
    NgbRatingModule,
    MultiselectWithSearchModule,
    NzRadioModule,
    FormsModule,
  ],
})
export class TrainingCatalogPageModule {}
