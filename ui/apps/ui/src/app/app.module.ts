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
import { AppComponent, LandingPageComponent } from './pages';
import { AuthInterceptor, ESSCommonModule } from '@eosc-search-service/common';
import { LayoutModule } from '@eosc-search-service/layout';
import { SearchPageModule } from '@eosc-search-service/pages/search';
import {
  SearchModule,
  allSet,
  dataSet,
  publicationsSet,
  servicesSet,
  softwareSet,
  trainingsSet,
} from '@eosc-search-service/search';
import { TrainingPagesModule } from '@eosc-search-service/pages/training';

registerLocaleData(en);

@NgModule({
  declarations: [AppComponent, LandingPageComponent],
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
    SearchPageModule,
    TrainingPagesModule,
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
  exports: [LandingPageComponent],
})
export class AppModule {}
