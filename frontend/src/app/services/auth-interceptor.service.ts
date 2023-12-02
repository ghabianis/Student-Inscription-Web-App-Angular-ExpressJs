import { HttpInterceptor } from '@angular/common/http';
import { Injectable } from '@angular/core';
import {
  HttpEvent,
  HttpHandler,
  HttpRequest,
} from "@angular/common/http";
@Injectable({
  providedIn: 'root'
})
export class AuthInterceptorService implements HttpInterceptor {

  intercept(
    req: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    const token = localStorage.getItem("token");
    const session = sessionStorage.getItem("session");
    if (token && session) {
      const clonedRequest = req.clone({
        headers: req.headers.set("Authorization", "Bearer " + token),
      });
      return next.handle(clonedRequest);
    } else {
      return next.handle(req);
    }
  }
}
