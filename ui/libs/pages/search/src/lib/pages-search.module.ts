import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {RouterModule} from '@angular/router';
import {ResultComponent} from "./components";
import {SearchPageComponent} from "./pages";
import {LayoutModule} from "@eosc-search-service/layout";
import {ESSCommonModule} from "@eosc-search-service/common";

@NgModule({
  declarations: [
    ResultComponent,
    SearchPageComponent
  ],
  imports: [
    CommonModule,
    LayoutModule,
    ESSCommonModule,
    RouterModule.forChild([
      { path: 'all', component: SearchPageComponent },
      { path: 'publications', component: SearchPageComponent },
      { path: 'services', component: SearchPageComponent },
      { path: 'trainings', component: SearchPageComponent },
    ]),
  ],
  exports: [
    ResultComponent,
    SearchPageComponent
  ]
})
export class PagesSearchModule {}
