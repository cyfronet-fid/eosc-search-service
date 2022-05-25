import {ModuleWithProviders, NgModule} from '@angular/core';
import { CommonModule } from '@angular/common';
import {CommonSettings} from "./types";
import {ESS_SETTINGS} from "./common.providers";
import {NotEmptyPipe} from "./pipes/not-empty.pipe";
import {EntriesPipe} from "./pipes/entries.pipe";

@NgModule({
  imports: [CommonModule],
  declarations: [NotEmptyPipe, EntriesPipe],
  exports: [NotEmptyPipe, EntriesPipe]
})
export class ESSCommonModule {
  static forRoot(settings: CommonSettings): ModuleWithProviders<ESSCommonModule> {
    return {
      ngModule: ESSCommonModule,
      providers: [
        {
          provide: ESS_SETTINGS,
          useValue: settings,
        },
      ]
    };
  }

}
