import { Component, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

import { IUserResponse } from '../user';
import { UserService } from '../user.service';

@Component({
  templateUrl: './user-edit.component.html',
  styleUrls: ['./user-edit.component.css']
})
export class UserEditComponent implements OnInit {
  @ViewChild("editForm") editForm: NgForm;

  pageTitle = 'User Edit';
  errorMessage: string;


  get isDirty(): boolean {
    return this.editForm.dirty ? true : false;
  }

  _isEditMode: boolean;
  get isEditMode(): boolean {
    return this._isEditMode;
  }
  set isEditMode(value:boolean){
    this._isEditMode = value;
  }

  private currentUser: IUserResponse;

  get user(): IUserResponse {
    return this.currentUser;
  }
  set user(value: IUserResponse) {
    this.currentUser = value;
  }

  _viewSubscriptions = false;
  get viewSubscriptions(): boolean {
    return this._viewSubscriptions;
  }
  set viewSubscriptions(value: boolean) {
    this._viewSubscriptions = value;
  }

  _createSubscriptions = false;
  get createSubscriptions(): boolean {
    return this._createSubscriptions;
  }
  set createSubscriptions(value: boolean) {
    this._createSubscriptions = value;
    if (value === true) {
      this.viewSubscriptions = true;
    }
  }

  _updateSubscriptions = false;
  get updateSubscriptions(): boolean {
    return this._updateSubscriptions;
  }
  set updateSubscriptions(value: boolean) {
    this._updateSubscriptions = value;
    if (value === true) {
      this.viewSubscriptions = true;
    }
  }

  _deleteSubscriptions = false;
  get deleteSubscriptions(): boolean {
    return this._deleteSubscriptions;
  }
  set deleteSubscriptions(value: boolean) {
    this._deleteSubscriptions = value;
    if (value === true) {
      this.viewSubscriptions = true;
    }
  }

  _viewMovies = false;
  get viewMovies(): boolean {
    return this._viewMovies;
  }
  set viewMovies(value: boolean) {
    this._viewMovies = value;
  }


  _createMovies = false;
  get createMovies(): boolean {
    return this._createMovies;
  }
  set createMovies(value: boolean) {
    this._createMovies = value;
    if (value === true) {
      this.viewMovies = true;
    }
  }

  _updateMovies = false;
  get updateMovies(): boolean {
    return this._updateMovies;
  }
  set updateMovies(value: boolean) {
    this._updateMovies = value;
    if (value === true) {
      this.viewMovies = true;
    }
  }

  _deleteMovies = false;
  get deleteMovies(): boolean {
    return this._deleteMovies;
  }
  set deleteMovies(value: boolean) {
    this._deleteMovies = value;
    if (value === true) {
      this.viewMovies = true;
    }
  }

  constructor(private userService: UserService,
    private route: ActivatedRoute,
    private router: Router) { }

  ngOnInit(): void {
    this.route.data.subscribe(data => {
      const resolvedData: IUserResponse = data['resolvedData'];
      this.errorMessage = resolvedData.errorMessage;
      this.onUserRetrieved(resolvedData);
    });
  }
  onUserRetrieved(user: IUserResponse): void {

    this.user = user;
    this.setPermissionData(user.results.permissions);

    if (!this.user) {
      this.pageTitle = 'No user found';
    } else {
      if (+this.user.results.userData.id === 0) {
        this.pageTitle = 'Add User';
        this._isEditMode = false;
      } else {
        this.pageTitle = `Edit User: ${this.user.results.userData.firstName} ${this.user.results.userData.lastName}`;
        this._isEditMode = true;
      }
    }
  }

  setPermissionData(permissionData: string[]): void {
    permissionData.forEach((permission, i) => {
      if (permission === "View Subscriptions") {
        this.viewSubscriptions = true;
      }
      else if (permission === "Create Subscriptions") {
        this.createSubscriptions = true;
      }
      else if (permission === "Update Subscriptions") {
        this.updateSubscriptions = true;
      }
      else if (permission === "Delete Subscriptions") {
        this.deleteSubscriptions = true;
      }
      else if (permission === "View Movies") {
        this.viewMovies = true;
      }
      else if (permission === "Create Movies") {
        this.createMovies = true;
      }
      else if (permission === "Update Movies") {
        this.updateMovies = true;
      }
      else if (permission === "Delete Movies") {
        this.deleteMovies = true;
      }
    });

  }

  
  reset(): void {
    this.editForm.reset();
  }

  saveUser(): void {
    if (this.editForm.form.valid) {
      this.preparePermissions();

      if (+this.user.results.userData.id === 0) {
        this.userService.createUser(this.user).subscribe({
          next: () => this.onSaveComplete(),
          error: err => this.errorMessage = err
        });
      } else {
        this.userService.updateUser(this.user).subscribe({
          next: () => this.onSaveComplete(),
          error: err => this.errorMessage = err
        });
      }
    } else {
      this.errorMessage = 'Please correct the validation errors.';
    }
  }

  onSaveComplete(): void {
    this.reset();
    this.router.navigate(['/users']);
  }

  preparePermissions(): void {
    let permissions = [];
    if (this.viewSubscriptions) {
      permissions.push("View Subscriptions");
    }
    if (this.createSubscriptions) {
      permissions.push("Create Subscriptions");
    }
    if (this.updateSubscriptions) {
      permissions.push("Update Subscriptions");
    }
    if (this.deleteSubscriptions) {
      permissions.push("Delete Subscriptions");
    }
    if (this.viewMovies) {
      permissions.push("View Movies");
    }
    if (this.createMovies) {
      permissions.push("Create Movies");
    }
    if (this.updateMovies) {
      permissions.push("Update Movies");
    }
    if (this.deleteMovies) {
      permissions.push("Delete Movies");
    }
    this.user.results.permissions = permissions;
  }


}