import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, catchError, delay, of } from 'rxjs';
import { environment } from '@environment/environment';

@Injectable({
  providedIn: 'root',
})
export class UserProfileService {
  constructor(private _http: HttpClient) {}

  get$(): Observable<{ username: string }> {
    return this._http
      .get<{ username: string }>(`${environment.backendApiPath}/auth/userinfo`)
      .pipe(
        delay(0),
        catchError(() => of({ username: '' }))
      );
  }
}
