import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {
  CategoryListComponent,
  MainHeaderComponent, SearchInputComponent, SubHeaderComponent
} from './components';
import {MultiselectWithSearchComponent} from "./components";
import {NzTreeModule} from "ng-zorro-antd/tree";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {RouterModule} from "@angular/router";

@NgModule({
  declarations: [
    CategoryListComponent,
    MainHeaderComponent,
    MultiselectWithSearchComponent,
    SearchInputComponent,
    SubHeaderComponent
  ],
  imports: [
    CommonModule,
    NzTreeModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule
  ],
  exports: [
    CategoryListComponent,
    MainHeaderComponent,
    MultiselectWithSearchComponent,
    SearchInputComponent,
    SubHeaderComponent
  ]
})
export class LayoutModule {
}
