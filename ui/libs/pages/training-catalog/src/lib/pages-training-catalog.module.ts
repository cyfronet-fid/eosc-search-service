import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import {TrainingCatalogPageComponent} from "./pages";
import {TrainingListComponent} from "./components";
import {TrainingComponent} from "./components";
import {TrainingFiltersComponent} from "./components";
import {LayoutModule} from "@eosc-search-service/layout";
import {NgbRatingModule} from "@ng-bootstrap/ng-bootstrap";
import {NzRadioModule} from "ng-zorro-antd/radio";
import {FormsModule} from "@angular/forms";

@NgModule({
  declarations: [
    TrainingCatalogPageComponent,
    TrainingListComponent,
    TrainingComponent,
    TrainingFiltersComponent,
  ],
  imports: [
    CommonModule,
    LayoutModule,
    NgbRatingModule,
    NzRadioModule,
    FormsModule,
    RouterModule.forChild([
      { path: 'training-catalog', component: TrainingCatalogPageComponent },
    ]),
  ],
  exports: [
    TrainingCatalogPageComponent,
    TrainingListComponent,
    TrainingComponent,
    TrainingFiltersComponent,
  ]
})
export class PagesTrainingCatalogModule {}
