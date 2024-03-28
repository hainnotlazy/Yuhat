import { AbstractControl } from "@angular/forms";

export class RegisterFormValidator {
  static passwordMatched(form: AbstractControl) {
    const { password, passwordConfirmation } = form.value;

    return password === passwordConfirmation ? null : { passwordNotMatch: true }
  }
}
