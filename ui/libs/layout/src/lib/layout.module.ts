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
import {FontAwesomeModule} from "@fortawesome/angular-fontawesome";
import {SubNavComponent} from "./components/sub-nav/sub-nav.component";
import {NzBreadCrumbModule} from "ng-zorro-antd/breadcrumb";

@NgModule({
  declarations: [
    CategoryListComponent,
    MainHeaderComponent,
    MultiselectWithSearchComponent,
    SearchInputComponent,
    SubHeaderComponent,
    SubNavComponent
  ],
  imports: [
    CommonModule,
    NzTreeModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule,
    FontAwesomeModule,
    NzBreadCrumbModule
  ],
  exports: [
    CategoryListComponent,
    MainHeaderComponent,
    MultiselectWithSearchComponent,
    SearchInputComponent,
    SubHeaderComponent,
    SubNavComponent
  ]
})
export class LayoutModule {
}
