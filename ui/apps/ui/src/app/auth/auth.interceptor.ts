import { Injectable } from '@angular/core';
import {
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpRequest,
} from '@angular/common/http';
import { Observable } from 'rxjs';
import { ConfigService } from '../services/config.service';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  intercept(
    req: HttpRequest<object>,
    next: HttpHandler
  ): Observable<HttpEvent<object>> {
    if (req.url.startsWith(ConfigService.config?.related_services_endpoint)) {
      return next.handle(req);
    }
    return next.handle(
      req.clone({
        withCredentials: true,
      })
    );
  }
}
