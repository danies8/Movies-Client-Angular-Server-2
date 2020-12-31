import { AbstractControl } from '@angular/forms';

//https://www.digitalocean.com/community/tutorials/angular-reactive-forms-custom-validator#:~:text=When%20using%20Reactive%20Forms%20in%20Angular%2C%20it%E2%80%99s%20very,and%20create%20a%20validator%20in%20a%20separate%20file.

export function ValidateUrl(control: AbstractControl) {
  if (!control.value?.startsWith('http') && control.value?.match(/\.(jpeg|jpg|gif|png)$/) == null) {
    return { validUrl: true };
  }
  return null;
}