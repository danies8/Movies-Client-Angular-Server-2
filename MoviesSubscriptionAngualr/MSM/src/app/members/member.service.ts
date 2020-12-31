import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of, throwError } from 'rxjs';
import { catchError, tap, map } from 'rxjs/operators';

import { AuthService } from 'src/app/loginUser/auth.service';
import { IEditMemberData, IMemberResponse, IMembersResponse, ISubscribeNewMovieResponse } from './member';

@Injectable({
  providedIn: 'root'
})
export class MemberService {

  filterBy: string;
  private memberUrl = 'http://localhost:8000/api/members';

  constructor(private http: HttpClient,
    private authService: AuthService) { }

  getAllMembers(): Observable<IMembersResponse> {
   return this.http.get<IMembersResponse>(this.memberUrl + "/getAllMembersSubscriptionData")
      .pipe(
        tap(data => console.log(JSON.stringify(data))),
        catchError(this.handleError)
      );
  }


  getMember(id: string): Observable<IMemberResponse> {
    if (id === '0') {
      return of(this.initializeUser());
    }
    return this.http.get<IMemberResponse>(this.memberUrl + `/getMemberById/${id}`)
      .pipe(
        tap(data => console.log('getMovie: ' + JSON.stringify(data))),
        catchError(this.handleError)
      );
  }

  private initializeUser(): IMemberResponse {
    // Return an initialized object
    return {
      member: {
          _id: "0",
          name: "",
           email: "",
          city: "",
        },
      isSuccess: false,
      errorMessage: ""
    };
  }


  createMember(member: IEditMemberData): Observable<IEditMemberData> {
    return this.http.post<IEditMemberData>(this.memberUrl + "/addMember", member)
      .pipe(
        tap(data => console.log('createMember: ' + JSON.stringify(data))),
        catchError(this.handleError)
      );
  }

  updateMember(member: IEditMemberData): Observable<IEditMemberData> {
   return this.http.put<IEditMemberData>(this.memberUrl + "/updateMember" + `/${member._id}`,member)
      .pipe(
        tap(() => console.log('updateMember: ' + member._id)),
        // Return the product on an update
        map(() => member),
        catchError(this.handleError)
      );
  }

  deleteMember(id: string): Observable<{}> {
   return this.http.delete<IMemberResponse>(this.memberUrl + "/deleteMember" + `/${id}`)
      .pipe(
        tap(data => console.log('deleteMember: ' + id)),
        catchError(this.handleError)
      );
  }

  subscirbeToNewMovie(memberId:string, selectedMovie:string, date:string,): Observable<{}> {
   return this.http.post<{}>(this.memberUrl + "/subscirbeToNewMovie",{memberId:memberId, newMovieDataObj:{name:selectedMovie, premiered:date}})
      .pipe(
        tap(data => console.log('subscirbeToNewMovie: ' + JSON.stringify(data))),
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
