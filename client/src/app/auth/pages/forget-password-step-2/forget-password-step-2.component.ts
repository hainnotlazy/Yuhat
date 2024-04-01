import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { IValidationMessages } from 'src/app/common/interfaces/form.interface';
import { UsersService } from 'src/app/services/users.service';

@Component({
  selector: 'app-forget-password-step-2',
  templateUrl: './forget-password-step-2.component.html',
  styleUrls: ['./forget-password-step-2.component.scss']
})
export class ForgetPasswordStep2Component implements OnInit {
  username = "";
  formError = "";
  hidePassword = true;
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
  validationCodeValidationMsg: IValidationMessages = {
    required: "Validation Code is required",
    pattern: "Validation Code must be 6 digits"
  }

  resetPasswordForm = new FormGroup({
    validationCode: new FormControl("", [
      Validators.required,
      Validators.pattern("[0-9]{6}")
    ]),
    newPassword: new FormControl("", [
      Validators.required,
      Validators.minLength(this.passwordRequirement.minlength),
      Validators.maxLength(this.passwordRequirement.maxlength)
    ]),
    passwordConfirmation: new FormControl("", [
      Validators.required
    ])
  })

  constructor(
    private usersService: UsersService,
    private route: ActivatedRoute
  ) {}

  ngOnInit() {
    this.username = this.route.snapshot.queryParamMap.get('username') || "";
  }

  getObjectKeys(arg: any): string[] {
    try {
      return Object.keys(arg);
    } catch (err) {
      return [];
    }
  }

  onSubmit() {
    if (this.resetPasswordForm.valid) {
      this.usersService.resetPassword(
        this.username,
        this.resetPasswordForm.get("newPassword")?.value as string,
        this.resetPasswordForm.get("validationCode")?.value as string).subscribe();
    }
  }
}
