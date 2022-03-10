import { Injectable } from "@angular/core";
import {
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpRequest,
} from "@angular/common/http";
import { Observable } from "rxjs";
import { environment } from "../environments/environment";

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  intercept(
    req: HttpRequest<object>,
    next: HttpHandler
  ): Observable<HttpEvent<object>> {
    req = req.clone({
      withCredentials: true,
    });
    req.headers
      .set("Content-Type", "application/json")
      .set("Access-Control-Allow-Origin", environment.backendUrl);
    return next.handle(req);
  }
}
