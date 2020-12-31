import { AfterViewInit, Component, ElementRef, OnInit, ViewChild, ViewChildren } from '@angular/core';
import { FormBuilder, FormControlName, FormGroup, NgForm, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { fromEvent, merge, Observable } from 'rxjs';
import { debounceTime } from 'rxjs/operators';

import { GenericValidator } from '../shared/generic-validator';
import { AuthService } from './auth.service';
import { IEditLoginUser, } from './login.user';

@Component({
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginUserComponent implements OnInit, AfterViewInit {
  @ViewChildren(FormControlName, { read: ElementRef }) formInputElements: ElementRef[];

  @ViewChild('userNameRef') userNameRef: ElementRef;
  errorMessage: string;
  pageTitle = 'Log In';

  logInUser: IEditLoginUser;
  logInForm: FormGroup;

  // Use with the generic validation message class
  displayMessage: { [key: string]: string } = {};
  private validationMessages: { [key: string]: { [key: string]: string } };
  private genericValidator: GenericValidator;

  constructor(
    private authService: AuthService,
    private router: Router,
    private fb: FormBuilder) {

    // Defines all of the validation messages for the form.
    // These could instead be retrieved from a file or database.
    this.validationMessages = {
      userName: {
        required: 'User name is required.',
      },
      password: {
        required: 'Password is required.'
      }
    };

    // Define an instance of the validator for use with this form,
    // passing in this form's set of validation messages.
    this.genericValidator = new GenericValidator(this.validationMessages);
  }

  ngOnInit(): void {
    this.logInForm = this.fb.group({
      userName: ['', Validators.required],
      password: ['', Validators.required]
    });
  }

  ngAfterContentInit(): void {
    setTimeout(() => {
      this.userNameRef.nativeElement.focus();
    }, 500);
  }

  ngAfterViewInit(): void {
    // Watch for the blur event from any input element on the form.
    // This is required because the valueChanges does not provide notification on blur
    const controlBlurs: Observable<any>[] = this.formInputElements
      .map((formControl: ElementRef) => fromEvent(formControl.nativeElement, 'blur'));

    // Merge the blur event observable with the valueChanges observable
    // so we only need to subscribe once.
    merge(this.logInForm.valueChanges, ...controlBlurs).pipe(
      debounceTime(800)
    ).subscribe(value => {
      this.displayMessage = this.genericValidator.processMessages(this.logInForm);
    });
  }

  logIn(): void {

    if (this.logInForm.valid) {
      if (this.logInForm.dirty) {
        const logIn = { ...this.logInUser, ...this.logInForm.value };

        this.authService.getUserInfo({
          userName: logIn.userName,
          password:logIn.password
        }).subscribe({
          next: loginUser => {
            this.authService.currentLoginUser = loginUser;
            let currentLoginUser = this.authService.currentLoginUser;
            if (currentLoginUser.isSuccess) {
              if (currentLoginUser.results.isUserExist) {
                if (this.authService.redirectUrl) {
                  this.router.navigateByUrl(this.authService.redirectUrl);
                } else {
                  this.router.navigate(['/users']);
                }
              }
              else {
                this.errorMessage = 'User does not exist, please enter user name and password.';
              }
            }
            else {
              this.errorMessage = currentLoginUser.errorMessage;
            }
          },
          error: err => this.errorMessage = err
        });


      } else {
        this.errorMessage = 'Please enter a user name and password.';
      }
    }
  }
} 
