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
import { ConfigService } from './services/config.service';
import { MatomoService, provideMatomoTracking } from './matomo/matomo.service';
import { WINDOW } from './app.providers';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { tap } from 'rxjs';

registerLocaleData(en);

export const getUserProfileFactory$ = (
  userProfileService: UserProfileService
) => {
  return () => userProfileService.get$();
};

export const getConfigFactory$ = (
  configBootstrapService: ConfigService,
  matomoService: MatomoService
) => {
  return () =>
    configBootstrapService.load$().pipe(
      // Matomo settings come from /config, so one image serves every Node
      tap(() => matomoService.start(configBootstrapService.get()))
    );
};

@NgModule({
  declarations: [AppComponent],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    HttpClientModule,
    AppRoutingModule,
    MainHeaderModule,
    NgbModule,
  ],
  providers: [
    { provide: NZ_I18N, useValue: en_US },
    { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true },
    { provide: WINDOW, useValue: window },
    provideMatomoTracking(),
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
      deps: [ConfigService, MatomoService],
    },
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
