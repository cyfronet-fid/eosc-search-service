/* eslint-disable @typescript-eslint/no-explicit-any */
import { ApplicationRef, enableProdMode } from '@angular/core';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';

import { AppModule } from './app/app.module';
import { environment } from './environments/environment';
import { enableElfProdMode } from '@ngneat/elf';
import { devTools } from '@ngneat/elf-devtools';
import jQuery from 'jquery';

(window as any).$ = jQuery;
(window as any).jQuery = jQuery;

if (environment.production) {
  enableProdMode();
  enableElfProdMode();
}

platformBrowserDynamic()
  .bootstrapModule(AppModule)
  .then((moduleRef) => {
    if (!environment.production) {
      devTools({
        postTimelineUpdate: () => moduleRef.injector.get(ApplicationRef).tick(),
      });
    }
  })
  .catch((err) => console.error(err));
