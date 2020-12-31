import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Observable, of } from 'rxjs';
import { map, catchError } from 'rxjs/operators';

import { IUserResponse, } from './user';
import { UserService } from './user.service';


@Injectable({
  providedIn: 'root'
})
export class UserResolver implements Resolve<IUserResponse> {

  constructor(private userService: UserService) { }

  resolve(route: ActivatedRouteSnapshot,
          state: RouterStateSnapshot): Observable<IUserResponse> {
    const id = route.paramMap.get('id');
    if (isNaN(+id)) {
      const message = `User id was not a number: ${id}`;
      console.error(message);
      return of({ results: null, isSuccess:false, errorMessage: message });
    }

    return this.userService.getUser(+id)
      .pipe(
        map(user => ({ results: user.results, isSuccess:true, errorMessage: "" })),
        catchError(error => {
          const message = `Retrieval error: ${error}`;
          console.error(message);
          return of({ results: null, isSuccess:false, errorMessage: message });
        })
      );
  }

}
