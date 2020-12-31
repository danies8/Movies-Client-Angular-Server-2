import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { SharedModule } from '../shared/shared.module';
import { UserListComponent } from './user-list/user-list.component';
import { AuthGuard } from '../loginUser/auth.guard';
import { UserResolver } from './user-resolver.service';
import { UserEditComponent } from './user-edit/user-edit.component';
import { UserEditGuard } from './user-edit/user-edit.guard';
import { UserNameValidateDirective } from '../shared/customValidators/userNameValidator';


@NgModule({
  imports: [
    SharedModule,
    RouterModule.forChild([
      {
        path: 'users', component: UserListComponent,
         canActivate: [AuthGuard],
      },
      {
        path: 'users/:id/edit',
        component: UserEditComponent,
        canActivate: [AuthGuard],
        canDeactivate:[UserEditGuard],
        resolve: { resolvedData: UserResolver },
       }
    ])
  ],
  declarations: [
    UserListComponent,
    UserEditComponent,
    UserNameValidateDirective
  ]
})
export class UserModule { }
