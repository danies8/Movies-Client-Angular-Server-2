import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, } from '@angular/forms';

import { CriteriaComponent } from './criteria/criteria.component';
import { MaterialModule } from '../material-module';
import { ConfirmDialogComponent } from './confirm-dialog/confirm-dialog.component';


@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MaterialModule,
   ],
  declarations: [
    CriteriaComponent,
    ConfirmDialogComponent,
  ],
  exports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    CriteriaComponent,
    MaterialModule,
  ]
})
export class SharedModule { }
