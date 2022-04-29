import { Component, Input, OnInit, ViewEncapsulation } from '@angular/core';
import { UserInfoService } from './user-info.service';
import { rerenderComponent } from './utils';

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

  constructor(private _userInfoService: UserInfoService) {}

  ngOnInit() {
    const userInfo$ = this._userInfoService.get$();
    rerenderComponent(this.id, userInfo$).subscribe();
  }
}
