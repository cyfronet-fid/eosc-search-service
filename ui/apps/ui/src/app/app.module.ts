// import { NgModule } from '@angular/core';
// import { BrowserModule } from '@angular/platform-browser';
//
// import { AppRoutingModule } from './app.routing.module';
// import { AppComponent } from './pages/root/app.component';
// import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
// import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
//
// /** config angular i18n **/
// import { CommonModule, registerLocaleData } from '@angular/common';
// import en from '@angular/common/locales/en';
//
// registerLocaleData(en);
//
// /** config ng-zorro-antd i18n **/
// import { NZ_I18N, en_US } from 'ng-zorro-antd/i18n';
// import { AuthInterceptor, ESSCommonModule } from '@eosc-search-service/common';
// import { environment } from '../environments/environment';
// import { PagesMarketplaceModule } from '@eosc-search-service/pages/marketplace';
// import { PagesOpenaireModule } from '@eosc-search-service/pages/openaire';
// import { PagesTrainingCatalogModule } from '@eosc-search-service/pages/training-catalog';
// import { LayoutModule } from '@eosc-search-service/layout';
// import { SearchModule } from '@eosc-search-service/search';
//
// const PAGES_MODULES = [
//   PagesMarketplaceModule,
//   PagesOpenaireModule,
//   PagesTrainingCatalogModule,
// ];
//
// @NgModule({
//   declarations: [AppComponent],
//   imports: [
//     CommonModule,
//     BrowserModule,
//     BrowserAnimationsModule,
//     HttpClientModule,
//     ESSCommonModule.forRoot(environment),
//     LayoutModule,
//     SearchModule,
//     ...PAGES_MODULES,
//     AppRoutingModule,
//   ],
//   providers: [
//     { provide: NZ_I18N, useValue: en_US },
//     { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true },
//   ],
//   bootstrap: [AppComponent],
//   exports: [],
// })
// export class AppModule {}

import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app.routing.module';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';

/** config angular i18n **/
import { registerLocaleData } from '@angular/common';
import en from '@angular/common/locales/en';
registerLocaleData(en);

/** config ng-zorro-antd i18n **/
import { NZ_I18N, en_US } from 'ng-zorro-antd/i18n';
import { AppComponent } from './pages';
import { LandingPageComponent } from './pages';
import { AuthInterceptor, ESSCommonModule } from '@eosc-search-service/common';
import { LayoutModule } from '@eosc-search-service/layout';
import { SearchPageModule } from '@eosc-search-service/pages/search';
import {
  SearchModule,
  allSet,
  researchProductsSet,
  servicesSet,
  trainingsSet,
} from '@eosc-search-service/search';

@NgModule({
  declarations: [AppComponent, LandingPageComponent],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    HttpClientModule,
    SearchModule.forRoot({
      setList: [allSet, researchProductsSet, servicesSet, trainingsSet],
      mainSet: allSet,
    }),
    SearchPageModule,
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
