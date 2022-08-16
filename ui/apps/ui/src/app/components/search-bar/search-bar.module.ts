import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SearchBarComponent } from './search-bar.component';
import {SearchInputModule} from "../search-input/search-input.module";

@NgModule({
  declarations: [SearchBarComponent],
  imports: [CommonModule, SearchInputModule],
  exports: [SearchBarComponent],
})
export class SearchBarModule {}
