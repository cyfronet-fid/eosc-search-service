import { Component, Input, OnInit, ViewEncapsulation } from '@angular/core';
import { rerenderComponent$ } from './utils';
import {user$, UserProfileService} from '@eosc-search-service/common';
import {UntilDestroy, untilDestroyed} from "@ngneat/until-destroy";

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

  @Input() backendUrl = ``;

  constructor(private _userProfileService: UserProfileService) {}

  ngOnInit() {
    rerenderComponent$(this.id, user$).pipe(untilDestroyed(this)).subscribe();
    this._userProfileService.get$().subscribe();
  }
}
