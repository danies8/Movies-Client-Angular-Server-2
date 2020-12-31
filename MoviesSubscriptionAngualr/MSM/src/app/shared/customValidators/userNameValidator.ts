import { Directive } from '@angular/core';
import {  AbstractControl, AsyncValidator, ValidationErrors, AsyncValidatorFn, NG_ASYNC_VALIDATORS } from '@angular/forms';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { UserService } from 'src/app/users/user.service';

@Directive({
  selector: '[isUserExist]',
  providers: [{
    provide: NG_ASYNC_VALIDATORS,
    useExisting: UserNameValidateDirective,
    multi: true
  }]
})
export class UserNameValidateDirective implements AsyncValidator  {

  constructor(private userService: UserService) {}
  validate(control: AbstractControl): Promise<ValidationErrors> | Observable<ValidationErrors> {
    return existingUserNameValidator(this.userService)(control);
  }
}

export function existingUserNameValidator(userService: UserService): AsyncValidatorFn {
  return (control: AbstractControl): Promise<ValidationErrors | null> | Observable<ValidationErrors | null> => {
    return userService.isUserNameExists(control.value).pipe(
      map(
        results => {
          return (results && results.isSuccess == true) ? {"isUserExist": true} : null;
        }
    ));
  };
}