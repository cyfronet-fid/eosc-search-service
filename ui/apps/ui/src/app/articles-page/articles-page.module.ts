import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ArticlesPageComponent } from './articles-page.component';
import { NzSelectModule } from 'ng-zorro-antd/select';
import { NzDatePickerModule } from 'ng-zorro-antd/date-picker';
import { NgbRatingModule } from '@ng-bootstrap/ng-bootstrap';
import { HorizontalFiltersComponent } from './horizontal-filters.component';
import { ArticlesComponent } from './articles.component';
import { ArticlesPaginationComponent } from './articles-pagination.component';
import { SimplifiedArticleComponent } from './simplified-article.component';
import { DetailedArticleComponent } from './detailed-article.component';

@NgModule({
  declarations: [
    ArticlesPageComponent,
    HorizontalFiltersComponent,
    ArticlesComponent,
    ArticlesPaginationComponent,
    SimplifiedArticleComponent,
    DetailedArticleComponent,
  ],
  imports: [CommonModule, NzSelectModule, NzDatePickerModule, NgbRatingModule],
})
export class ArticlesPageModule {}
