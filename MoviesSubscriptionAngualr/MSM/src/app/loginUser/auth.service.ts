import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';

import { LoginUser } from './login.user';


@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private loginUserUrl = 'http://localhost:8000/api/loginUsers';
 
  private _currentLoginUser: LoginUser;
  get currentLoginUser(): LoginUser {
    return this._currentLoginUser;
  }
  set currentLoginUser(value:LoginUser){
    this._currentLoginUser = value;
  }

  redirectUrl: string;

  get isLoggedIn(): boolean {
    return this._currentLoginUser != undefined 
    && this._currentLoginUser != null && this.currentLoginUser.isSuccess;
  }

  constructor(private http: HttpClient) { }

  logout(): void {
    this.currentLoginUser = null;
  }

  getUserInfo(logInObj:any): Observable<LoginUser> {
   return this.http.post<LoginUser>(this.loginUserUrl + "/getUserInfo", logInObj)
      .pipe(
        tap(data => console.log(JSON.stringify(data))),
        catchError(this.handleError)
      );
  }

  private handleError(err: any): Observable<never> {
    // in a real world app, we may send the server to some remote logging infrastructure
    // instead of just logging it to the console
    let errorMessage: string;
    if (err.error instanceof ErrorEvent) {
      // A client-side or network error occurred. Handle it accordingly.
      errorMessage = `An error occurred: ${err.error.message}`;
    } else {
      // The backend returned an unsuccessful response code.
      // The response body may contain clues as to what went wrong,
      errorMessage = `Backend returned code ${err.status}: ${err.body.error}`;
    }
    console.error(err);
    return throwError(errorMessage);
  }

}
