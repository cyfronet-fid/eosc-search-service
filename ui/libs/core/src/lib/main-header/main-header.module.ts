import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {MainHeaderComponent} from "./main-header.component";



@NgModule({
  declarations: [MainHeaderComponent],
  exports: [
    MainHeaderComponent
  ],
  imports: [
    CommonModule
  ]
})
export class MainHeaderModule { }
