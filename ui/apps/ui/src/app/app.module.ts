import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { NgbRatingModule } from '@ng-bootstrap/ng-bootstrap';
import { NzTreeModule } from 'ng-zorro-antd/tree';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { ArticlesPageComponent } from './articles-page/articles-page.component';
import { MarketplacePageComponent } from './marketplace-page/marketplace-page.component';
import { NzSelectModule } from 'ng-zorro-antd/select';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NzDatePickerModule } from 'ng-zorro-antd/date-picker';

/** config angular i18n **/
import { registerLocaleData } from '@angular/common';
import en from '@angular/common/locales/en';
registerLocaleData(en);

/** config ng-zorro-antd i18n **/
import { NZ_I18N, en_US } from 'ng-zorro-antd/i18n';
import { AuthInterceptor } from './auth.interceptor';
import { CoreModule } from '@ui/core';
import { SubHeaderComponent } from './sub-header.component';
import { FiltersComponent } from './marketplace-page/filters/filters.component';
import { CategoriesComponent } from './marketplace-page/categories/categories.component';
import { RecommendationsComponent } from './marketplace-page/recommendations/recommendations.component';
import { ResourcesComponent } from './marketplace-page/resources/resources.component';
import { ResourceComponent } from './marketplace-page/resources/resource.component';
import { RecommendationComponent } from './marketplace-page/recommendations/recommendation.component';
import { FilterComponent } from './marketplace-page/filters/filter.component';

@NgModule({
  declarations: [
    AppComponent,
    ArticlesPageComponent,
    MarketplacePageComponent,
    SubHeaderComponent,
    FiltersComponent,
    CategoriesComponent,
    RecommendationsComponent,
    ResourcesComponent,
    ResourceComponent,
    RecommendationComponent,
    FilterComponent,
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    NgbRatingModule,
    NzTreeModule,
    HttpClientModule,
    NzSelectModule,
    FormsModule,
    NzDatePickerModule,
    ReactiveFormsModule,
    CoreModule,
  ],
  providers: [
    { provide: NZ_I18N, useValue: en_US },
    { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true },
  ],
  bootstrap: [AppComponent],
  exports: [],
})
export class AppModule {}
