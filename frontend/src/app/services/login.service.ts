import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Router } from "@angular/router";

import { Observable, BehaviorSubject } from "rxjs";
import { first, catchError, tap } from "rxjs/operators";

import { User } from "../models/User";
import { ErrorHandlerService } from './error-handler.service';
@Injectable({
  providedIn: 'root'
})

export class LoginService {

  private url = "http://localhost:3005/auth";

  isUserLoggedIn$ = new BehaviorSubject<boolean>(
    JSON.parse(localStorage.getItem("isUserLoggedIn") || "false")
  );

  userId!: Pick<User, "id">;

  httpOptions: { headers: HttpHeaders } = {
    headers: new HttpHeaders({ "Content-Type": "application/json" }),
  };

  constructor(
    private http: HttpClient,
    private errorHandlerService: ErrorHandlerService,
    private router: Router
  ) { }

  private setIsUserLoggedIn(value: boolean) {
    this.isUserLoggedIn$.next(value);
    localStorage.setItem("isUserLoggedIn", JSON.stringify(value));
  }

  signup(user: Omit<User, "id">): Observable<User> {
    return this.http
      .post<User>(`${this.url}/signup`, user, this.httpOptions)
      .pipe(
        first(),
        catchError(this.errorHandlerService.handleError<User>("signup"))
      );
  }

  logOut() {
    localStorage.setItem("isUserLoggedIn", JSON.stringify(false))
    localStorage.removeItem("access_token")
    sessionStorage.removeItem("session")
    this.router.navigate([""]);
  }
  user: any

  login(
    email: Pick<User, "email">,
    password: Pick<User, "password">
  ): Observable<any> {
    return this.http
      .post(`${this.url}/login`, { email, password }, this.httpOptions)
      .pipe(
        first(),
        tap((tokenObject: any) => {
          console.log(tokenObject)
          // Use 'as' to assert the type
          const typedTokenObject = tokenObject as { token: string; userId: Pick<User, "id"> };
          const user = tokenObject as { username : Pick<User,"username">,email: Pick<User, "email">,name : Pick<User,"name"> };
          // const user = this.user as { user: Pick<User,"id"> };
          // Your existing logic here
          // Assuming your User type has an 'id' property
          // Explicitly define the type of 'id'
          const userId = typedTokenObject.userId ? typedTokenObject.userId.id : undefined;

          if (user !== undefined) {
            sessionStorage.setItem("user", JSON.stringify(user));
            localStorage.setItem("user", JSON.stringify(user));
            this.userId = typedTokenObject.userId;
            localStorage.setItem("access_token", typedTokenObject.token);
            sessionStorage.setItem("session", typedTokenObject.token)
            this.setIsUserLoggedIn(true);
            this.router.navigate(["/home"]);
          }
 
        }),
        catchError(
          this.errorHandlerService.handleError<any>("login")
        )
      );
  }
}
