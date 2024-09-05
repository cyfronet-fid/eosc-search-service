import {
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpRequest,
} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable()
export class CollectionsPrefixInterceptor implements HttpInterceptor {
  intercept(
    req: HttpRequest<object>,
    next: HttpHandler
  ): Observable<HttpEvent<object>> {
    const prefix = localStorage.getItem('COLLECTIONS_PREFIX');

    if (prefix !== null) {
      const modifiedReq = req.clone({
        headers: req.headers.set('Collections-Prefix', prefix),
      });

      return next.handle(modifiedReq);
    }
    return next.handle(req);
  }
}
