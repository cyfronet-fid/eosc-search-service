import { Inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ESS_SETTINGS } from '../../common.providers';
import { CommonSettings } from '../../types';
import { Observable, tap } from 'rxjs';
import {
  setUserProfile,
  trackUserProfileRequestsStatus,
  UserProfile,
} from './user-profile.repository';

@Injectable({
  providedIn: 'root',
})
export class UserProfileService {
  private backendUrl: string;
  constructor(
    private _http: HttpClient,
    @Inject(ESS_SETTINGS) settings: CommonSettings
  ) {
    this.backendUrl = settings.backendApiPath;
  }

  get$(): Observable<UserProfile> {
    return this._http
      .get<UserProfile>(`${this.backendUrl}/auth/userinfo`)
      .pipe(tap(setUserProfile), trackUserProfileRequestsStatus('profile'));
  }
}
