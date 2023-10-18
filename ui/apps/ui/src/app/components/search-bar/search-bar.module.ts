import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SearchBarComponent } from './search-bar.component';
import { SearchInputModule } from '../search-input/search-input.module';
import { TopMenuModule } from '@components/top-menu/top-menu.module';

@NgModule({
  declarations: [SearchBarComponent],
  imports: [CommonModule, SearchInputModule, TopMenuModule],
  exports: [SearchBarComponent],
})
export class SearchBarModule {}
