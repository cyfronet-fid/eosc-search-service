import {ModuleWithProviders, NgModule} from '@angular/core';
import { CommonModule } from '@angular/common';
import {CommonSettings} from "./types";
import {ESS_SETTINGS} from "./common.providers";

@NgModule({
  imports: [CommonModule],
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
