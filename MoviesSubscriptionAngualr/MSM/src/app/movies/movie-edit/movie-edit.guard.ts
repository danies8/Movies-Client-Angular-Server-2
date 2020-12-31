import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, CanDeactivate } from '@angular/router';
import { Observable } from 'rxjs';
import { ConfirmDialogComponent } from 'src/app/shared/confirm-dialog/confirm-dialog.component';

import { MovieEditComponent } from './movie-edit.component';


@Injectable({
  providedIn: 'root'
})
export class MovieEditGuard implements CanDeactivate<MovieEditComponent>  {

  dialogResult$: Observable<boolean>;

  constructor(private dialog: MatDialog){}
  
  canDeactivate(component: MovieEditComponent,
                currentRoute: ActivatedRouteSnapshot,
                currentState: RouterStateSnapshot,
                nextState?: RouterStateSnapshot): boolean | Observable<boolean> | Promise<boolean> {

    if (component.isDirty) {
      const movieName = component.movie.name  || 'New Movie';
      const dialogRef = this.dialog.open(ConfirmDialogComponent, {
        maxWidth: "600px",
        data: {title:"Cancel edit", message: `Navigate away and lose all changes to ${movieName}?`} 
      });
   
      this.dialogResult$ = dialogRef?.afterClosed();
      return this.dialogResult$;
     }
    return true;
  }

}

