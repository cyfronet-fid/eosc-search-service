import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { MocksService } from './mocks.service';
import { environment } from '../environments/environment';
import { catchError, of } from 'rxjs';

interface EoscCommonWindow extends Window {
  eosccommon: {
    renderMainFooter: (cssSelector: string) => void;
    renderMainHeader: (cssSelector: string, elementAttr?: object) => void;
    renderEuInformation: (cssSelector: string) => void;
  };
}
declare let window: EoscCommonWindow;

@Component({
  selector: 'ui-main-header',
  template: `
    <div
      id="eosc-common-main-header"
      [attr.data-login-url]="backendUrl + '/auth/request'"
      [attr.data-logout-url]="backendUrl + '/auth/logout'"
      #eoscCommonMainHeader
    ></div>
  `,
  encapsulation: ViewEncapsulation.None,
})
export class MainHeaderComponent implements OnInit {
  backendUrl = `${environment.backendUrl}/${environment.webApiPath}`;
  constructor(private _mocksService: MocksService) {}

  ngOnInit() {
    this._mocksService
      .getUserInfo$()
      .pipe(
        catchError(() => {
          window.eosccommon.renderMainHeader('#eosc-common-main-header');
          return of();
        })
      )
      .subscribe((response: { username: string }) => {
        const { username } = response;
        window.eosccommon.renderMainHeader('#eosc-common-main-header', {
          username,
        });
      });
  }
}
