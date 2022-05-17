import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app.routing.module';
import { AppComponent } from './pages/root/app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';

/** config angular i18n **/
import { CommonModule, registerLocaleData } from '@angular/common';
import en from '@angular/common/locales/en';

registerLocaleData(en);

/** config ng-zorro-antd i18n **/
import { NZ_I18N, en_US } from 'ng-zorro-antd/i18n';
import { AuthInterceptor, ESSCommonModule } from '@eosc-search-service/common';
import { environment } from '../environments/environment';
import { LayoutModule } from '@eosc-search-service/layout';
import { SearchModule } from '@eosc-search-service/search';
import { PagesSearchModule } from '@eosc-search-service/pages/search';

// Replaced by PagesSearchModule
// const PAGES_MODULES = [
//   PagesMarketplaceModule,
//   PagesOpenaireModule,
//   PagesTrainingCatalogModule,
// ];

@NgModule({
  declarations: [AppComponent],
  imports: [
    CommonModule,
    BrowserModule,
    BrowserAnimationsModule,
    HttpClientModule,
    ESSCommonModule.forRoot(environment),
    LayoutModule,
    SearchModule,
    PagesSearchModule,
    // ...PAGES_MODULES,
    AppRoutingModule,
  ],
  providers: [
    { provide: NZ_I18N, useValue: en_US },
    { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true },
  ],
  bootstrap: [AppComponent],
  exports: [],
})
export class AppModule {}
