import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';

/** config angular i18n **/
import { registerLocaleData } from '@angular/common';
import en from '@angular/common/locales/en';
registerLocaleData(en);

/** config ng-zorro-antd i18n **/
import { NZ_I18N, en_US } from 'ng-zorro-antd/i18n';
import { AuthInterceptor } from './auth.interceptor';
import { CategoriesModule, MainHeaderModule, SearchModule } from '@ui/core';
import { SubNavModule } from './sub-nav/sub-nav.module';
import { SubHeaderModule } from './sub-header/sub-header.module';
import { ResultModule } from './result/result.module';
import { SearchPageModule } from './search-page/search-page.module';

@NgModule({
  declarations: [AppComponent],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    HttpClientModule,
    MainHeaderModule,
    SearchModule,
    SubNavModule,
    SubHeaderModule,
    ResultModule,
    CategoriesModule,
    SearchPageModule,
  ],
  providers: [
    { provide: NZ_I18N, useValue: en_US },
    { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true },
  ],
  bootstrap: [AppComponent],
  exports: [],
})
export class AppModule {}
