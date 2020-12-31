import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { SharedModule } from '../shared/shared.module';
import { AuthGuard } from '../loginUser/auth.guard';
import { MemberListComponent } from './member-list/member-list.component';
import { MemberEditComponent } from './member-edit/member-edit.component';
import { MemberEditGuard } from './member-edit/member-edit.guard';
import { MemberResolver } from './member-edit/member-resolver.service';


@NgModule({
  imports: [
    SharedModule,
    RouterModule.forChild([
      {
        path: 'members', component: MemberListComponent,
         canActivate: [AuthGuard],
      },
      {
        path: 'members/:id/edit',
        component: MemberEditComponent,
        canActivate: [AuthGuard],
        canDeactivate:[MemberEditGuard],
        resolve: { resolvedData: MemberResolver },
       }
    ])
  ],
  declarations: [
    MemberListComponent,
    MemberEditComponent,
 ]
})
export class MemberModule { }
