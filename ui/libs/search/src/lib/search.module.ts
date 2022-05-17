import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {ArticlesStore, SearchService} from '@eosc-search-service/search';

@NgModule({
  declarations: [],
  imports: [CommonModule],
  exports: [],
  providers: [SearchService, ArticlesStore],
})
export class SearchModule {}
