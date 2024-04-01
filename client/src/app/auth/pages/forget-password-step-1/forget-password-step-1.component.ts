import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { catchError, finalize, of } from 'rxjs';
import { IValidationMessages } from 'src/app/common/interfaces/form.interface';
import { UsersService } from 'src/app/services/users.service';

@Component({
  selector: 'app-forget-password-step-1',
  templateUrl: './forget-password-step-1.component.html',
  styleUrls: ['./forget-password-step-1.component.scss']
})
export class ForgetPasswordStep1Component {
  formError = "";
  formSubmitted = false;

  usernameRequirement = {
    minlength: 5,
  }
  usernameValidationMsg: IValidationMessages = {
    required: "Username is required",
    minlength: "Username is invalid",
  }

  form = new FormGroup({
    username: new FormControl("", [
      Validators.required,
      Validators.minLength(this.usernameRequirement.minlength),
    ]),
  })

  constructor(private usersService: UsersService) {}

  getObjectKeys(arg: any): string[] {
    try {
      return Object.keys(arg);
    } catch (err) {
      return [];
    }
  }

  onSubmit() {
    if (this.form.valid) {
      this.formSubmitted = true;
      this.usersService.sendForgetPasswordMail(this.form.get("username")?.value as string).pipe(
        catchError(
          err => {
            this.formError = err.message;
            return of(null);
          }
        ),
        finalize(
          () => this.formSubmitted = false
        )
      ).subscribe();
    }
  }
}
