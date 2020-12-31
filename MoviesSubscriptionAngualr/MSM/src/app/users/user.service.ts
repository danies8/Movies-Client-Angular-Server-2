import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of, throwError } from 'rxjs';
import { catchError, tap, map } from 'rxjs/operators';

import { IUserExistsResponse, IUserResponse, IUsersResponse, User, UserData } from './user';
import { AuthService } from '../loginUser/auth.service';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  private userUrl = 'http://localhost:8000/api/users';
  filterBy :string;

  constructor(private http: HttpClient) { }

  getAllUsers(): Observable<IUsersResponse> {
   return this.http.get<IUsersResponse>(this.userUrl + "/getAllUsers")
      .pipe(
        tap(data => console.log(JSON.stringify(data))),
        catchError(this.handleError)
      );
  }

  getUser(id: number): Observable<IUserResponse> {
    if (id === 0) {
      return of(this.initializeUser());
    }
    return this.http.get<IUserResponse>(this.userUrl + `/getUserById/${id}`)
      .pipe(
        tap(data => console.log('getUser: ' + JSON.stringify(data))),
        catchError(this.handleError)
      );
  }

  private initializeUser(): IUserResponse {
    // Return an initialized object
    return {
      results: {
        userData: {
          id:"0",
          firstName: "",
          lastName: "",
          createdDate: "",
          sessionTimeout: "",
          loginId: ""
        },
        permissions:[],
        userName:""

      },
      isSuccess: false,
      errorMessage: ""
    };
  }


  createUser(user: IUserResponse): Observable<IUserResponse> {
    return this.http.post<IUserResponse>(this.userUrl + "/addUser", user)
      .pipe(
        tap(data => console.log('createUser: ' + JSON.stringify(data))),
        catchError(this.handleError)
      );
  }

  updateUser(user: IUserResponse): Observable<IUserResponse> {
   return this.http.put<IUserResponse>(this.userUrl + "/updateUser" + `/${user.results.userData.id}`, user)
      .pipe(
        tap(() => console.log('updateUser: ' + user.results.userData.id)),
        // Return the product on an update
        map(() => user),
        catchError(this.handleError)
      );
  }

  

  deleteUser(id: string): Observable<{}> {
   return this.http.delete<IUserResponse>(this.userUrl + "/deleteUser" + `/${id}`)
      .pipe(
        tap(data => console.log('deleteUser: ' + id)),
        catchError(this.handleError)
      );
  }

  isUserNameExists(userName: string): Observable<IUserExistsResponse> {
  return this.http.get<IUserExistsResponse>(this.userUrl + `/isUserNameExists/${userName}`)
      .pipe(
        tap(data => console.log('isUserNameExists: ' + data.isSuccess)),
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
