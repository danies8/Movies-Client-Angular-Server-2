import {  Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';

import { AuthService } from 'src/app/loginUser/auth.service';
import { MemberService } from 'src/app/members/member.service';
import { CriteriaComponent } from 'src/app/shared/criteria/criteria.component';
import { IMoviesResponse, MovieDataArr } from '../movie';
import { MovieService } from '../movie.service';

@Component({
  templateUrl: './movie-list.component.html',
  styleUrls: ['./movie-list.component.css']
})
export class MovieListComponent implements OnInit {
  pageTitle = 'Movies List';
  errorMessage: string;
  @ViewChild(CriteriaComponent) filterComponent: CriteriaComponent;

  filteredMovies: IMoviesResponse;
  movies: IMoviesResponse;


  get hasPermissionForCreateMovies(): boolean {
    if (this.authService.currentLoginUser.results.isUserAdmin){
      return true;
    }
    else {
      return this.authService.currentLoginUser.results.hasPermissionForCreateMovies;
    }
  }

  get hasPermissionForEditMovies(): boolean {
    if (this.authService.currentLoginUser.results.isUserAdmin){
      return true;
    }
    else {
      return this.authService.currentLoginUser.results.hasPermissionForEditMovies;
    }
  }

  get hasPermissionForDeleteMovies(): boolean {
    if (this.authService.currentLoginUser.results.isUserAdmin){
      return true;
    }
    else {
      return this.authService.currentLoginUser.results.hasPermissionForDeleteMovies;
    }
  }

  constructor(private movieService: MovieService,
    private authService: AuthService,
    private router: Router,
    private memberService: MemberService) { }


  ngOnInit(): void {

    this.movieService.getAllMovies().subscribe({
      next: movies => {
        this.movies = movies,
          this.filterComponent.listFilter = this.movieService.filterBy;
      },
      error: err => this.errorMessage = err
    });

  }

  onValueChange(value: string): void {
    this.movieService.filterBy = value;
    this.performFilter(value);
  }

  performFilter(filterBy?: string): void {
    if (filterBy) {
      filterBy = filterBy.toLocaleLowerCase();
      let moviesDataArr = this.movies?.moviesDataArr.filter((movieDataArr: MovieDataArr) =>
        movieDataArr.movieData.name.toLocaleLowerCase().indexOf(filterBy) !== -1);
      this.filteredMovies = { moviesDataArr: moviesDataArr, isSuccess: true, errorMessage: "" };
    }
    else {
      this.filteredMovies = this.movies;
    }
  }

  deleteMovie(id: string, name: string): void {
    if (confirm(`Really delete the movie: ${name}?`)) {
      this.movieService.deleteMovie(id).subscribe({
        next: () => this.onSaveComplete(id),
        error: err => this.errorMessage = err
      });
    }
  }

  onSaveComplete(movieId: string): void {
    let indexMovies = this.movies.moviesDataArr.findIndex(movie => movie.movieData._id === movieId);
    if (indexMovies > -1) {
      this.movies.moviesDataArr.splice(indexMovies, 1);
    }
    let indexFilterMovies = this.filteredMovies.moviesDataArr.findIndex(movie => movie.movieData._id === movieId);
    if (indexFilterMovies > -1) {
      this.filteredMovies.moviesDataArr.splice(indexFilterMovies, 1);
    }

  }

  goToMember(memberName: string): void {
    this.memberService.filterBy = memberName;
    this.router.navigate(['/members']);

  }


}
