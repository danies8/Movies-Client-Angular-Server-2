import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRouteSnapshot, RouterStateSnapshot, CanDeactivate } from '@angular/router';
import { Observable } from 'rxjs';
import { ConfirmDialogComponent } from 'src/app/shared/confirm-dialog/confirm-dialog.component';

import { UserEditComponent } from './user-edit.component';

@Injectable({
  providedIn: 'root'
})
export class UserEditGuard implements CanDeactivate<UserEditComponent>  {

  dialogResult$: Observable<boolean>;

  constructor(private dialog: MatDialog){}
  
  canDeactivate(component: UserEditComponent,
                currentRoute: ActivatedRouteSnapshot,
                currentState: RouterStateSnapshot,
                nextState?: RouterStateSnapshot): boolean | Observable<boolean> | Promise<boolean> {

    if (component.isDirty) {
      const userName = component.user.results.userData.firstName + " "
       component.user.results.userData.lastName || 'New User';
       const dialogRef = this.dialog.open(ConfirmDialogComponent, {
        maxWidth: "600px",
        data: {title:"Cancel edit", message: `Navigate away and lose all changes to ${userName}?`} 
      });
   
      this.dialogResult$ = dialogRef?.afterClosed();
      return this.dialogResult$;
     }
    return true;
  }

}


