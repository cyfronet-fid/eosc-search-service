import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";

@Injectable({
  providedIn: 'root'
})
export class UserInfoService {
  constructor(private _http: HttpClient) {}

  get$(backendUrl: string) {
    return this._http.get<{ username: string }>(`${backendUrl}/auth/userinfo`)
  }
}
