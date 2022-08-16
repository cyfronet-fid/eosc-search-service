import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app.routing.module';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';

/** config angular i18n **/
import { registerLocaleData } from '@angular/common';
import en from '@angular/common/locales/en';
/** config ng-zorro-antd i18n **/
import { NZ_I18N, en_US } from 'ng-zorro-antd/i18n';
import { AuthInterceptor, ESSCommonModule } from '@eosc-search-service/common';
import { LayoutModule } from '@eosc-search-service/layout';

import {
  SearchModule,
  allSet,
  dataSet,
  publicationsSet,
  servicesSet,
  softwareSet,
  trainingsSet,
} from '@eosc-search-service/search';
import { AppComponent } from './app.component';

registerLocaleData(en);

@NgModule({
  declarations: [AppComponent],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    HttpClientModule,
    SearchModule.forRoot({
      setList: [
        allSet,
        publicationsSet,
        dataSet,
        softwareSet,
        servicesSet,
        trainingsSet,
      ],
      mainSet: allSet,
    }),
    LayoutModule,
    ESSCommonModule.forRoot({
      backendApiPath: 'api/web',
      search: {
        sets: [],
        apiPath: 'search-results',
      },
    }),
    AppRoutingModule,
  ],
  providers: [
    { provide: NZ_I18N, useValue: en_US },
    { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true },
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
