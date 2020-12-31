import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, of, throwError } from 'rxjs';
import { catchError, tap, map, shareReplay } from 'rxjs/operators';

import { IEditMovieData, IMovieResponse, IMoviesNamesResponse, IMoviesResponse } from './movie';
import { AuthService } from 'src/app/loginUser/auth.service';

@Injectable({
  providedIn: 'root'
})
export class MovieService {

  filterBy: string;
  private movieUrl = 'http://localhost:8000/api/movies';

  constructor(private http: HttpClient,
    private authService: AuthService) { }

  getAllMovies(): Observable<IMoviesResponse> {
  return this.http.get<IMoviesResponse>(this.movieUrl + "/getAllMovies")
      .pipe(
        tap(data => console.log(JSON.stringify(data))),
        catchError(this.handleError)
      );
  }


  getMovie(id: string): Observable<IMovieResponse> {
    if (id === '0') {
      return of(this.initializeUser());
    }
    return this.http.get<IMovieResponse>(this.movieUrl + `/getMovieById/${id}`)
      .pipe(
        tap(data => console.log('getMovie: ' + JSON.stringify(data))),
        catchError(this.handleError)
      );
  }

  private initializeUser(): IMovieResponse {
    // Return an initialized object
    return {
         movieData: {
          _id: "0",
          name: "",
          genres: [],
          image: "",
          premiered: "",
        },
      isSuccess: false,
      errorMessage: ""
    };
  }


  createMovie(movie: IEditMovieData): Observable<IEditMovieData> {
     return this.http.post<IEditMovieData>(this.movieUrl + "/addMovie", movie)
      .pipe(
        tap(data => console.log('createMovie: ' + JSON.stringify(data))),
        catchError(this.handleError)
      );
  }

  updateMovie(movie: IEditMovieData): Observable<IEditMovieData> {
    return this.http.put<IEditMovieData>(this.movieUrl + "/updateMovie" + `/${movie._id}`, movie,)
      .pipe(
        tap(() => console.log('updateMovie: ' + movie._id)),
        // Return the movie on an update
        map(() => movie),
        catchError(this.handleError)
      );
  }

  deleteMovie(id: string): Observable<{}> {
   return this.http.delete<IMovieResponse>(this.movieUrl + "/deleteMovie" + `/${id}`)
      .pipe(
        tap(data => console.log('deleteMovie: ' + id)),
        catchError(this.handleError)
      );
  }


  getAllMoviesNames(): Observable<IMoviesNamesResponse> {
    return this.http.get<IMoviesNamesResponse>(this.movieUrl + "/getAllMoviesNames")
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
