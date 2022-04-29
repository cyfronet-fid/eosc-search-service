import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {RouterModule} from '@angular/router';
import {
  ArticleListComponent,
  ArticleListPageComponent,
  ArticleListPaginationComponent,
  DetailedArticleComponent,
  HorizontalFiltersComponent,
  SimplifiedArticleComponent
} from "./pages";
import {NzSelectModule} from "ng-zorro-antd/select";
import {NzDatePickerModule} from "ng-zorro-antd/date-picker";
import {NgbRatingModule} from "@ng-bootstrap/ng-bootstrap";

@NgModule({
  declarations: [
    ArticleListPageComponent,
    HorizontalFiltersComponent,
    ArticleListComponent,
    ArticleListPaginationComponent,
    SimplifiedArticleComponent,
    DetailedArticleComponent,
  ],
  imports: [CommonModule, NzSelectModule, NzDatePickerModule, NgbRatingModule,
    RouterModule.forChild([
      { path: 'articles', component: ArticleListPageComponent },
    ])],
  exports: [
    ArticleListPageComponent,
    HorizontalFiltersComponent,
    ArticleListComponent,
    ArticleListPaginationComponent,
    SimplifiedArticleComponent,
    DetailedArticleComponent,
  ]
})
export class PagesOpenaireModule {}
