import { ApplicationRef, enableProdMode } from '@angular/core';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';

import { AppModule } from './app/app.module';
import { environment } from './environments/environment';
import { enableElfProdMode } from '@ngneat/elf';
import { devTools } from '@ngneat/elf-devtools';

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


import './polyfills';
import { BibliographyExportComponent } from '@components/bibliography-export/bibliography-export.component';
  
 platformBrowserDynamic()
      .bootstrapModule(BibliographyExportComponent)
      .then(ref => {
        // Ensure Angular destroys itself on hot reloads.
        if (window['ngRef']) {
          window['ngRef'].destroy();
        }
        window['ngRef'] = ref;
  
        // Otherwise, log the boot error
      })
      .catch(err => console.error(err));
