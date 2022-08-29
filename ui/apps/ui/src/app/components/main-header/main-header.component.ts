import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { UserProfileService } from './user-profile.service';
import { EoscCommonWindow } from './types';
import { environment } from '@environment/environment';

declare let window: EoscCommonWindow;

@UntilDestroy()
@Component({
  selector: 'ess-main-header',
  template: `
    <div
      [id]="id"
      [attr.data-login-url]="backendUrl + '/auth/request'"
      [attr.data-logout-url]="backendUrl + '/auth/logout'"
      #eoscCommonMainHeader
    ></div>
  `,
  encapsulation: ViewEncapsulation.None,
})
export class MainHeaderComponent implements OnInit {
  id = 'eosc-common-main-header';
  backendUrl = `${environment.backendApiPath}`;

  constructor(private _userProfileService: UserProfileService) {}

  ngOnInit() {
    this._userProfileService
      .get$()
      .pipe(untilDestroyed(this))
      .subscribe((profile) =>
        window.eosccommon.renderMainHeader(`#${this.id}`, profile ?? undefined)
      );
  }
}
