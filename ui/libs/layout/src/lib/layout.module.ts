import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {
  CategoriesComponent,
  CheckboxesTreeComponent,
  MainHeaderComponent,
  MultiselectWithSearchComponent,
  SearchInputComponent,
  SubHeaderComponent,
} from './components';
import {NzTreeModule} from 'ng-zorro-antd/tree';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {RouterModule} from '@angular/router';
import {FontAwesomeModule} from '@fortawesome/angular-fontawesome';
import {NzTreeViewModule} from 'ng-zorro-antd/tree-view';
import {NzIconModule} from 'ng-zorro-antd/icon';
import {NzBadgeModule} from 'ng-zorro-antd/badge';
import {SubNavComponent} from './components/sub-nav';
import {NzBreadCrumbModule} from 'ng-zorro-antd/breadcrumb';
import {ESSCommonModule} from "@eosc-search-service/common";
import {PaginationComponent} from "./components/pagination/pagination.component";

@NgModule({
  declarations: [
    CategoriesComponent,
    MainHeaderComponent,
    MultiselectWithSearchComponent,
    SearchInputComponent,
    CheckboxesTreeComponent,
    SubNavComponent,
    SubHeaderComponent,
    PaginationComponent
  ],
  imports: [
    CommonModule,
    ESSCommonModule,
    NzTreeModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule,
    FontAwesomeModule,
    NzTreeViewModule,
    NzIconModule,
    NzTreeModule,
    NzBadgeModule,
    NzBreadCrumbModule,
  ],
  exports: [
    CategoriesComponent,
    MainHeaderComponent,
    MultiselectWithSearchComponent,
    SearchInputComponent,
    CheckboxesTreeComponent,
    SubNavComponent,
    SubHeaderComponent,
    PaginationComponent
  ],
})
export class LayoutModule {}
