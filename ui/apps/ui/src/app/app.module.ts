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
import { MarketplacePageModule } from './marketplace-page/marketplace-page.module';
import { ArticlesPageModule } from './articles-page/articles-page.module';
import { SubHeaderComponent } from './sub-header.component';
import { MainHeaderModule, SearchModule } from '@ui/core';

@NgModule({
  declarations: [AppComponent, SubHeaderComponent],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    HttpClientModule,
    MarketplacePageModule,
    ArticlesPageModule,
    MainHeaderModule,
    SearchModule,
  ],
  providers: [
    { provide: NZ_I18N, useValue: en_US },
    { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true },
  ],
  bootstrap: [AppComponent],
  exports: [],
})
export class AppModule {}
