import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Observable, of } from 'rxjs';
import { map, catchError } from 'rxjs/operators';

import { IMemberResponse } from '../member';
import { MemberService } from '../member.service';

@Injectable({
  providedIn: 'root'
})
export class MemberResolver implements Resolve<IMemberResponse> {

  constructor(private memberService: MemberService) { }

  resolve(route: ActivatedRouteSnapshot,
          state: RouterStateSnapshot): Observable<IMemberResponse> {
    const id = route.paramMap.get('id');
   return this.memberService.getMember(id)
      .pipe(
        map(member => ({ member: member.member, isSuccess:true, errorMessage: "" })),
        catchError(error => {
          const message = `Retrieval error: ${error}`;
          console.error(message);
          return of({ member: null, isSuccess:false, errorMessage: message });
        })
      );
  }

}
