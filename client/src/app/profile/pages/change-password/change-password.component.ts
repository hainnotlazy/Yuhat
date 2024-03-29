import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { IValidationMessages } from 'src/app/common/interfaces/form.interface';
import { RegisterFormValidator } from 'src/app/common/validators/register-form.validator';
import { ChangePasswordDto } from 'src/app/dtos/user.dto';
import { UsersService } from 'src/app/services/users.service';

@Component({
  selector: 'app-change-password',
  templateUrl: './change-password.component.html',
  styleUrls: ['./change-password.component.scss']
})
export class ChangePasswordComponent {
  hidePassword = true;
  hideNewPassword = true;
  hidePasswordConfirmation = true;

  passwordRequirement = {
    minlength: 8,
    maxlength: 100
  }

  passwordValidationMsg: IValidationMessages = {
    required: "Password is required",
    minlength: `Password must have more than ${this.passwordRequirement.minlength} characters`,
    maxlength: `Password must have less than ${this.passwordRequirement.maxlength} characters`,
  }
  formValidationMsg: IValidationMessages = {
    passwordNotMatch: "Confirm password is not matched"
  }

  changePasswordForm = new FormGroup({
    password: new FormControl("", [
      Validators.required,
      Validators.minLength(this.passwordRequirement.minlength),
      Validators.maxLength(this.passwordRequirement.maxlength)
    ]),
    newPassword: new FormControl("", [
      Validators.required,
      Validators.minLength(this.passwordRequirement.minlength),
      Validators.maxLength(this.passwordRequirement.maxlength)
    ]),
    passwordConfirmation: new FormControl("", [
      Validators.required
    ])
  }, [
    RegisterFormValidator.changePasswordMatched
  ])

  constructor(
    private usersService: UsersService,
    private snackbar: MatSnackBar
  ) {}

  getObjectKeys(arg: any): string[] {
    try {
      return Object.keys(arg);
    } catch (err) {
      return [];
    }
  }

  onSubmit() {
    if (this.changePasswordForm.errors) {
      for (let error of this.getObjectKeys(this.changePasswordForm.errors)) {
        this.snackbar.open(this.formValidationMsg[error], "x", {
          duration: 3000,
          horizontalPosition: "right",
          verticalPosition: "top"
        })
      }
    }

    if (this.changePasswordForm.valid) {
      this.usersService.changePassword(this.changePasswordForm.value as ChangePasswordDto).subscribe();
    }
  }
}
