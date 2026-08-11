import { AbstractControl, ValidationErrors } from '@angular/forms';

export function nameValidator(control: AbstractControl): ValidationErrors | null {

  const value = control.value;

  if (!value) {
    return null;
  }

  const lettersOnly = /^[A-Za-z ]+$/;

  if (!lettersOnly.test(value)) {
    return {
      invalidName: true
    };
  }

  return null;

}
