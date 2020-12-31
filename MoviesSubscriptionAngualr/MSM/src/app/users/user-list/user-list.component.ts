import { Component, OnInit, ViewChild } from '@angular/core';

import { UserService } from '../user.service';
import { IUsersResponse, User } from '../user';
import { CriteriaComponent } from 'src/app/shared/criteria/criteria.component';
import { AuthService } from 'src/app/loginUser/auth.service';


@Component({
  templateUrl: './user-list.component.html',
  styleUrls: ['./user-list.component.css']
})
export class UserListComponent implements OnInit {
  pageTitle = 'Users List';
  errorMessage: string;
  imageWidth = 50;
  imageMargin = 2;
  @ViewChild(CriteriaComponent) filterComponent: CriteriaComponent;

  filteredUsers: IUsersResponse;
  users: IUsersResponse;

  get isUserAdmin(): boolean {
    return this.authService.currentLoginUser.results.isUserAdmin;
  }

  constructor(private userService: UserService,
    private authService: AuthService) { }

  ngOnInit(): void {
    this.userService.getAllUsers().subscribe({
      next: users => {
        this.users = users;
        this.filterComponent.listFilter = this.userService.filterBy;
      },
      error: err => this.errorMessage = err
    });
  }

  onValueChange(value: string): void {
    this.userService.filterBy = value;
    this.performFilter(value);

  }

  performFilter(filterBy?: string): void {
    if (filterBy) {
      filterBy = filterBy.toLocaleLowerCase();
      let users = this.users?.results.filter((user: User) =>
        (user.userData.firstName + user.userData.lastName).toLocaleLowerCase().indexOf(filterBy) !== -1);
      this.filteredUsers = { results: users, isSuccess: true, errorMessage: "" };
    }
    else {
      this.filteredUsers = this.users;
    }
  }


  deleteUser(id: string, name: string): void {
    if (confirm(`Really delete the user: ${name}?`)) {
      this.userService.deleteUser(id).subscribe({
        next: () => this.onSaveComplete(id),
        error: err => this.errorMessage = err
      });
    }
  }

  onSaveComplete(userId: string): void {
    let indexUsers = this.users.results.findIndex(user => user.userData.id === userId);
    if (indexUsers > -1) {
      this.users.results.splice(indexUsers, 1);
    }
    let indexFilterUsers = this.filteredUsers.results.findIndex(user => user.userData.id === userId);
    if (indexFilterUsers > -1) {
      this.filteredUsers.results.splice(indexFilterUsers, 1);
    }
  }

}



