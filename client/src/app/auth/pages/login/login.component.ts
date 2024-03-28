import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { IValidationMessages, LoginUserDto } from 'src/app/dtos/auth.dto';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent {
  formError = "";
  hidePassword = true;

  usernameRequirement = {
    minlength: 5,
  }
  passwordRequirement = {
    minlength: 8,
    maxlength: 100
  }

  usernameValidationMsg: IValidationMessages = {
    required: "Username is required",
    minlength: "Username is invalid",
  }
  passwordValidationMsg: IValidationMessages = {
    required: "Password is required",
    minlength: "Password is invalid",
    maxlength: "Password is invalid"
  }

  loginForm = new FormGroup({
    username: new FormControl("", [
      Validators.required,
      Validators.minLength(this.usernameRequirement.minlength),
    ]),
    password: new FormControl("", [
      Validators.required,
      Validators.minLength(this.passwordRequirement.minlength),
      Validators.maxLength(this.passwordRequirement.maxlength)
    ])
  })

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
    if (this.loginForm.valid) {
      this.authService.login(this.loginForm.value as LoginUserDto).subscribe(
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
