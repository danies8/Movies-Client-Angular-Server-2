import { Component, ElementRef, OnInit, ViewChild, ViewChildren } from '@angular/core';
import { FormBuilder, FormControlName, FormGroup, NgForm, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { fromEvent, merge, Observable } from 'rxjs';
import { debounceTime } from 'rxjs/operators';
import { GenericValidator } from 'src/app/shared/generic-validator';

import { IEditMovieData, IMovieResponse } from '../movie';
import { MovieService } from '../movie.service';
import {ValidateUrl } from '../../shared/customValidators/imageUrlValidator';

@Component({
  selector: 'app-movie-edit',
  templateUrl: './movie-edit.component.html',
  styleUrls: ['./movie-edit.component.css']
})
export class MovieEditComponent implements OnInit {

  @ViewChildren(FormControlName, { read: ElementRef }) formInputElements: ElementRef[];
  @ViewChild('nameRef') nameRef: ElementRef;

  pageTitle = 'Movie Edit';
  errorMessage: string;

  editForm: FormGroup;
  movie: IEditMovieData;

  get isDirty(): boolean {
    return this.editForm.dirty ? true : false;
  }

  // Use with the generic validation message class
  displayMessage: { [key: string]: string } = {};
  private validationMessages: { [key: string]: { [key: string]: string } };
  private genericValidator: GenericValidator;

  constructor(
    private movieService: MovieService,
    private route: ActivatedRoute,
    private router: Router,
    private fb: FormBuilder) {
    // Defines all of the validation messages for the form.
    // These could instead be retrieved from a file or database.
    this.validationMessages = {
      name: {
        required: 'Name is required.',
      },
      genres: {
        required: 'Genres is required.',
      },
      image: {
        required: 'Image Url is required.',
        validUrl:'Image Url is invalid.',
      },
      premiered: {
        required: 'Premired is required.'
      },
    }

    // Define an instance of the validator for use with this form,
    // passing in this form's set of validation messages.
    this.genericValidator = new GenericValidator(this.validationMessages);
  }
//imageUrlPattern
  ngOnInit(): void {
    this.editForm = this.fb.group({
      name: ['', Validators.required],
      genres: ['', Validators.required],
      image: ['', [Validators.required, ValidateUrl]],
      premiered: ['', Validators.required],
    });
    
    this.route.data.subscribe(data => {
      const resolvedData: IMovieResponse = data['resolvedData'];
      this.errorMessage = resolvedData.errorMessage;
      this.onMovieRetrieved(resolvedData);
    });
  }
  onMovieRetrieved(movie: IMovieResponse): void {

    if(movie.isSuccess){
    this.movie = movie.movieData;

    if (!this.movie) {
      this.pageTitle = 'No movie found';
    } else {
      if (+this.movie._id === 0) {
        this.pageTitle = 'Add movie';
      } else {
        this.pageTitle = `Edit movie: ${this.movie.name}`;
      }
    }

    // Update the data on the form
    this.editForm.patchValue({
      name: this.movie.name,
      genres: this.movie.genres,
      image: this.movie.image,
      premiered: this.movie.premiered,
    });
  }
  else{
    this.errorMessage = movie.errorMessage;
  }
  }


  ngAfterContentInit(): void {
    setTimeout(() => {
      this.nameRef.nativeElement.focus();
    }, 500);
  }

  ngAfterViewInit(): void {
    // Watch for the blur event from any input element on the form.
    // This is required because the valueChanges does not provide notification on blur
    const controlBlurs: Observable<any>[] = this.formInputElements
      .map((formControl: ElementRef) => fromEvent(formControl.nativeElement, 'blur'));

    // Merge the blur event observable with the valueChanges observable
    // so we only need to subscribe once.
    merge(this.editForm.valueChanges, ...controlBlurs).pipe(
      debounceTime(800)
    ).subscribe(value => {
      this.displayMessage = this.genericValidator.processMessages(this.editForm);
    });
  }

  reset(): void {
    this.editForm.reset();
  }

  saveMovie(): void {
    if (this.editForm.valid) {
      if (this.editForm.dirty) {
        const movie = { ...this.movie, ...this.editForm.value };

      if (+this.movie._id === 0) {
        this.movieService.createMovie(movie).subscribe({
          next: () => this.onSaveComplete(),
          error: err => this.errorMessage = err
        });
      } else {
        this.movieService.updateMovie(movie).subscribe({
          next: () => this.onSaveComplete(),
          error: err => this.errorMessage = err
        });
      }
    } else {
      this.errorMessage = 'Please correct the validation errors.';
    }
  }
}

  onSaveComplete(): void {
    this.reset();
    this.router.navigate(['/movies']);
  }
}
