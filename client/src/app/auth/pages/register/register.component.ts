import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { RegisterFormValidator } from 'src/app/common/validators/register-form.validator';
import { IValidationMessages, RegisterUserDto } from 'src/app/dtos/auth.dto';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent {
  formError = "";
  hidePassword = true;
  hidePasswordConfirmation = true;

  usernameRequirement = {
    minlength: 5,
    maxlength: 50
  }
  passwordRequirement = {
    minlength: 8,
    maxlength: 100
  }

  formValidationMsg: IValidationMessages = {
    passwordNotMatch: "Confirm password is not matched"
  }
  usernameValidationMsg: IValidationMessages = {
    required: "Username is required",
    minlength: `Username must have more than ${this.usernameRequirement.minlength} characters`,
    maxlength: `Username must have less than ${this.usernameRequirement.maxlength} characters`,
  }
  passwordValidationMsg: IValidationMessages = {
    required: "Password is required",
    minlength: `Password must have more than ${this.passwordRequirement.minlength} characters`,
    maxlength: `Password must have less than ${this.passwordRequirement.maxlength} characters`,
  }
  emailValidationMsg: IValidationMessages = {
    email: "Email is invalid"
  }
  passwordConfirmationValidationMsg: IValidationMessages = {
    required: "Please confirm your password"
  }

  registerForm = new FormGroup({
    username: new FormControl("", [
      Validators.required
    ]),
    email: new FormControl("", [
      Validators.email
    ]),
    password: new FormControl("", [
      Validators.required
    ]),
    passwordConfirmation: new FormControl("", [
      Validators.required
    ])
  }, [
    RegisterFormValidator.passwordMatched
  ])

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  getObjectKeys(arg: any): string[] {
    try {
      return Object.keys(arg);
    } catch (err) {
      return [];
    }
  }

  navigateToAuthPage(provider: string) {
    window.location.href = `http://localhost:3000/api/auth/${provider}`;
  }

  onSubmit() {
    if (this.registerForm.errors) {
      for (let error of this.getObjectKeys(this.registerForm.errors)) {
        this.formError = this.formValidationMsg[error];
      }
    }

    if (this.registerForm.valid) {
      this.authService.register(this.registerForm.value as RegisterUserDto).subscribe(
        () => {
          this.router.navigate([""]);
        }
        ,
        (error) => {
          this.formError = error.message;
        }
      )
    }
  }
}
