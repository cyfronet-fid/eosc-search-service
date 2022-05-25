import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {
  CategoryListComponent,
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

@NgModule({
  declarations: [
    CategoryListComponent,
    MainHeaderComponent,
    MultiselectWithSearchComponent,
    SearchInputComponent,
    CheckboxesTreeComponent,
    SubNavComponent,
    SubHeaderComponent,
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
    CategoryListComponent,
    MainHeaderComponent,
    MultiselectWithSearchComponent,
    SearchInputComponent,
    CheckboxesTreeComponent,
    SubNavComponent,
    SubHeaderComponent,
  ],
})
export class LayoutModule {}
