import { APP_INITIALIZER, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app.routing.module';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';

/** config angular i18n **/
import { registerLocaleData } from '@angular/common';
import en from '@angular/common/locales/en';
/** config ng-zorro-antd i18n **/
import { NZ_I18N, en_US } from 'ng-zorro-antd/i18n';

import { AppComponent } from './app.component';
import { AuthInterceptor } from './auth/auth.interceptor';
import { MainHeaderModule } from '@components/main-header/main-header.module';
import { UserProfileService } from './auth/user-profile.service';
import {
  NgxGoogleAnalyticsModule,
  NgxGoogleAnalyticsRouterModule,
} from 'ngx-google-analytics';
import { environment } from '@environment/environment';
import { ConfigService } from './services/config.service';
import { WINDOW } from './app.providers';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

registerLocaleData(en);

export const getUserProfileFactory$ = (
  userProfileService: UserProfileService
) => {
  return () => userProfileService.get$();
};

export const getConfigFactory$ = (configBootstrapService: ConfigService) => {
  return () => configBootstrapService.load$();
};

const googleAnalyticsId = (
  environment as unknown as { googleAnalyticsId: string }
)['googleAnalyticsId'];

@NgModule({
  declarations: [AppComponent],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    HttpClientModule,
    AppRoutingModule,
    MainHeaderModule,
    NgbModule,

    ...(googleAnalyticsId == null
      ? []
      : [
          NgxGoogleAnalyticsModule.forRoot(googleAnalyticsId),
          NgxGoogleAnalyticsRouterModule,
        ]),
  ],
  providers: [
    { provide: NZ_I18N, useValue: en_US },
    { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true },
    { provide: WINDOW, useValue: window },
    {
      provide: APP_INITIALIZER,
      useFactory: getUserProfileFactory$,
      multi: true,
      deps: [UserProfileService],
    },
    {
      provide: APP_INITIALIZER,
      useFactory: getConfigFactory$,
      multi: true,
      deps: [ConfigService],
    },
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
