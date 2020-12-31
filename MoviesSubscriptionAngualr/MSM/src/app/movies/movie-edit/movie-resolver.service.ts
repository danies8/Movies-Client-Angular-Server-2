import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';

import { Observable, of } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { IMovieResponse } from '../movie';
import { MovieService } from '../movie.service';



@Injectable({
  providedIn: 'root'
})
export class MovieResolver implements Resolve<IMovieResponse> {

  constructor(private movieService: MovieService) { }

  resolve(route: ActivatedRouteSnapshot,
          state: RouterStateSnapshot): Observable<IMovieResponse> {
    const id = route.paramMap.get('id');
   return this.movieService.getMovie(id)
      .pipe(
        map(movie => ({ movieData: movie.movieData, isSuccess:true, errorMessage: "" })),
        catchError(error => {
          const message = `Retrieval error: ${error}`;
          console.error(message);
          return of({ movieData: null, isSuccess:false, errorMessage: message });
        })
      );
  }

}
