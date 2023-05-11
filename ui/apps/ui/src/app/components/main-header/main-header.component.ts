import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { UserProfileService } from '../../auth/user-profile.service';
import { EoscCommonWindow } from './types';
import { environment } from '@environment/environment';
import { delay } from 'rxjs';

declare let window: EoscCommonWindow;

@UntilDestroy()
@Component({
  selector: 'ess-main-header',
  template: `
    <div
      [id]="id"
      [attr.data-login-url]="backendUrl + '/auth/request'"
      [attr.data-logout-url]="backendUrl + '/auth/logout'"
      [attr.show-eosc-links]="'true'"
      #h5er
    ></div>
  `,
  encapsulation: ViewEncapsulation.None,
})
export class MainHeaderComponent implements OnInit {
  id = 'eosc-common-main-header';
  backendUrl = `${environment.backendApiPath}`;

  constructor(private _userProfileService: UserProfileService) {}

  ngOnInit() {
    this._userProfileService.user$
      .pipe(
        untilDestroyed(this),
        // delay is required to have rerender out of angular's detection cycle
        delay(0)
      )
      .subscribe((profile) =>
        window.eosccommon.renderMainHeader(`#${this.id}`, profile ?? undefined)
      );
  }
}
