import {Inject, Injectable} from '@angular/core';
import { HttpClient } from '@angular/common/http';
import {CommonSettings, ESS_SETTINGS} from "@eosc-search-service/common";

@Injectable({
  providedIn: 'root',
})
export class UserInfoService {
  private backendUrl: string;
  constructor(private _http: HttpClient, @Inject(ESS_SETTINGS) settings: CommonSettings) {
    this.backendUrl = settings.backendApiPath;
  }

  get$() {
    return this._http.get<{ username: string }>(`${this.backendUrl}/auth/userinfo`);
  }
}
