import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SearchComponent } from './search/search.component';
import {ReactiveFormsModule} from "@angular/forms";
import {MainHeaderComponent} from "./main-header/main-header.component";

@NgModule({
  imports: [CommonModule, ReactiveFormsModule],
  declarations: [
    SearchComponent,
    MainHeaderComponent,
  ],
  exports: [
    SearchComponent,
    MainHeaderComponent,
  ],
})
export class CoreModule {}
