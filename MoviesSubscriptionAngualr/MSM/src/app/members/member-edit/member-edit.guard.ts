import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRouteSnapshot, RouterStateSnapshot, CanDeactivate } from '@angular/router';
import { Observable } from 'rxjs';
import { ConfirmDialogComponent } from 'src/app/shared/confirm-dialog/confirm-dialog.component';

import { MemberEditComponent } from './member-edit.component';


@Injectable({
  providedIn: 'root'
})
export class MemberEditGuard implements CanDeactivate<MemberEditComponent>  {

  dialogResult$: Observable<boolean>;

  constructor(private dialog: MatDialog){}

  canDeactivate(component: MemberEditComponent,
                currentRoute: ActivatedRouteSnapshot,
                currentState: RouterStateSnapshot,
                nextState?: RouterStateSnapshot
                ): boolean | Observable<boolean> | Promise<boolean> {

    if (component.isDirty) {
      const memberName = component.member.name  || 'New Member';
      const dialogRef = this.dialog.open(ConfirmDialogComponent, {
        maxWidth: "600px",
        data: {title:"Cancel edit", message: `Navigate away and lose all changes to ${memberName}?`} 
      });
   
      this.dialogResult$ = dialogRef?.afterClosed();
      return this.dialogResult$;
     }
    return true;
  }

}
