import { Injectable } from '@angular/core';
import { Observable, catchError, of } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { environment } from '@environment/environment';

@Injectable({
  providedIn: 'root',
})
export class FeedbackPanelService {
  constructor(private _http: HttpClient) {}

  createFeedbackTicket(feedbackData: {
    subject: string;
    name: string;
    message: string;
    email: string;
  }): Observable<any> {
    const url = `${environment.backendApiPath}/${environment.feedbackApiPath}`;
    return this._http
      .post<never>(url, feedbackData)
      .pipe(
        catchError(() =>
          of({ message: 'Upssss, something gone wrong with feedback' })
        )
      );
  }
}
