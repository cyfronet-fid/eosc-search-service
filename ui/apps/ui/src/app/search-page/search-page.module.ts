import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SearchPageComponent } from './search-page.component';
import { CategoriesModule } from '@ui/core';
import { ResultModule } from '../result/result.module';

@NgModule({
  declarations: [SearchPageComponent],
  imports: [CommonModule, CategoriesModule, ResultModule],
})
export class SearchPageModule {}
