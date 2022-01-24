import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { MainPageComponent } from './main-page/main-page.component';
import {NgbRatingModule} from "@ng-bootstrap/ng-bootstrap";
import {NzTreeModule} from "ng-zorro-antd/tree";
import {BrowserAnimationsModule} from "@angular/platform-browser/animations";

@NgModule({
  declarations: [
    AppComponent,
    MainPageComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    NgbRatingModule,
    NzTreeModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
