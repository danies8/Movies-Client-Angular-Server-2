import { Component, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/loginUser/auth.service';
import { IMoviesNamesResponse, ISubscribedData } from 'src/app/movies/movie';
import { MovieService } from 'src/app/movies/movie.service';
import { CriteriaComponent } from 'src/app/shared/criteria/criteria.component';

import { IMembersResponse, MemberDataArr } from '../member';
import { MemberService } from '../member.service';

@Component({
  templateUrl: './member-list.component.html',
  styleUrls: ['./member-list.component.css']
})
export class MemberListComponent implements OnInit {
  pageTitle = 'Member List';
  errorMessage: string;
  @ViewChild(CriteriaComponent) filterComponent: CriteriaComponent;

  filteredMembers: IMembersResponse;
  members: IMembersResponse;
  moviesNames :IMoviesNamesResponse;
  subscriptions :ISubscribedData[];
  

  get hasPermissionForCreateSubscriptions(): boolean {
    if (this.authService.currentLoginUser.results.isUserAdmin){
      return true;
    }
    else {
    return this.authService.currentLoginUser.results.hasPermissionForCreateSubscriptions;
    }
  }

  get hasPermissionForEditSubscriptions(): boolean {
    if (this.authService.currentLoginUser.results.isUserAdmin){
      return true;
    }
    else {
    return this.authService.currentLoginUser.results.hasPermissionForEditSubscriptions;
    }
  }

  get hasPermissionForDeleteSubscriptions(): boolean {
    if (this.authService.currentLoginUser.results.isUserAdmin){
      return true;
    }
    else {
    return this.authService.currentLoginUser.results.hasPermissionForDeleteSubscriptions;
    }
  }
  constructor(private memberService: MemberService,
    private authService:AuthService,
    private movieService:MovieService,
    private router: Router) { }


  ngOnInit(): void {
    this.getAllMembers();
  }

 getAllMembers():void{
  this.memberService.getAllMembers().subscribe({
    next: members => {
      this.members = members,
        this.filterComponent.listFilter = this.memberService.filterBy;
    },
    error: err => this.errorMessage = err
  });
 }

  onValueChange(value: string): void {
    this.memberService.filterBy = value;
    this.performFilter(value);
  }

  performFilter(filterBy?: string): void {
    if (filterBy) {
      filterBy = filterBy.toLocaleLowerCase();
      let memberDataArr = this.members?.membersDataArr.filter((memberDataArr: MemberDataArr) =>
        memberDataArr.memberData.name.toLocaleLowerCase().indexOf(filterBy) !== -1);
      this.filteredMembers = { membersDataArr: memberDataArr, isSuccess: true, errorMessage: "" };
    }
    else {
      this.filteredMembers = this.members;
    }
  }

  deleteMember(id: string, name: string): void {
    if (confirm(`Really delete the member: ${name}?`)) {
      this.memberService.deleteMember(id).subscribe({
        next: () => this.onSaveComplete(id),
        error: err => this.errorMessage = err
      });
    }
  }

  onSaveComplete(memberId: string): void {
    let indexMembers = this.members.membersDataArr.findIndex(member => member.memberData._id === memberId);
    if (indexMembers > -1) {
      this.members.membersDataArr.splice(indexMembers, 1);
    }
    let indexFilterUsers = this.filteredMembers.membersDataArr.findIndex(member => member.memberData._id === memberId);
    if (indexFilterUsers > -1) {
      this.filteredMembers.membersDataArr.splice(indexFilterUsers, 1);
    }
  }

  onSubscritions():void{
    this.movieService.getAllMoviesNames().subscribe({
      next: moviesNames => {
        this.moviesNames = moviesNames
       },
      error: err => this.errorMessage = err
    });
  }

  memberId:string;
  saveMemberId(memberId:string):void{
    this.memberId = memberId;
  }
  subscirbeToNewMovie(subscribeForm: NgForm): void {
    if (subscribeForm && subscribeForm.valid) {
     const selectedMovie = subscribeForm.form.value.selectedMovie;
     const date = subscribeForm.form.value.date;

      this.memberService.subscirbeToNewMovie(this.memberId,selectedMovie, date).subscribe({
        next: () => {
          this.getAllMembers();
        },
        error: err => this.errorMessage = err
      });
    }}

    goToMovie(movieName: string): void {
      this.movieService.filterBy = movieName;
      this.router.navigate(['/movies']);
  
    }
}
