import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { MainPageComponent } from './main-page/main-page.component';
import {NgbRatingModule} from "@ng-bootstrap/ng-bootstrap";
import {NzTreeModule} from "ng-zorro-antd/tree";
import {BrowserAnimationsModule} from "@angular/platform-browser/animations";
import {MainHeaderComponent} from "./main-header.component";
import {HttpClientModule} from "@angular/common/http";

@NgModule({
  declarations: [
    AppComponent,
    MainPageComponent,
    MainHeaderComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    NgbRatingModule,
    NzTreeModule,
    HttpClientModule,
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
