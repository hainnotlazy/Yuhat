import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { noop, switchMap, tap, timer } from 'rxjs';
import { IValidationMessages } from 'src/app/common/interfaces/form.interface';
import { UsersService } from 'src/app/services/users.service';

@Component({
  selector: 'app-verify-email',
  templateUrl: './verify-email.component.html',
  styleUrls: ['./verify-email.component.scss']
})
export class VerifyEmailComponent implements OnInit {
  formError = "";
  timeCanResendCode?: Date;
  canResendCode = true;
  sentMail = false;

  // FIXME: Resend email function

  verificationCodeValidationMsg: IValidationMessages = {
    required: "Validation Code is required",
    pattern: "Validation Code must be 6 digits"
  }

  verifyForm = new FormGroup({
    verificationCode: new FormControl("", [
      Validators.required,
      Validators.pattern("[0-9]{6}")
    ]),
    recaptcha: new FormControl("", [
      Validators.required
    ])
  })

  constructor(
    private usersService: UsersService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.usersService.findUser().pipe(
      switchMap(data => {
        if (data.emailVerified) this.router.navigate([""]);
        this.timeCanResendCode = data.availableTimeVerifyEmail;

        return timer(0, 1000).pipe(
          tap(() => {
            if (!this.timeCanResendCode) {
              this.canResendCode = true;
            } else {
              const remainingTime = Math.max(0, new Date(this.timeCanResendCode).getTime() - new Date().getTime());
              this.canResendCode = remainingTime === 0 ? true : false;
              this.sentMail = false;
            }
          })
        );
      })
    ).subscribe()
  }

  getObjectKeys(arg: any): string[] {
    try {
      return Object.keys(arg);
    } catch (err) {
      return [];
    }
  }

  sendVerificationCode() {
    this.sentMail = true;
    this.usersService.resendVerificationCode().pipe(
      tap(data => {
        this.timeCanResendCode = data.availableTimeVerifyEmail
      })
    ).subscribe();
  }

  onSubmit() {
    if (this.verifyForm.controls.recaptcha.hasError("required")) {
      this.formError = "Please verify captcha!";
    }

    if (this.verifyForm.valid) {
      this.usersService.verifyEmail(
        this.verifyForm.get("verificationCode")?.value as string,
        this.verifyForm.get("recaptcha")?.value as string
      ).subscribe(
        noop,
        error => {
          this.formError = error.message;
          this.verifyForm.get("recaptcha")?.reset();
        }
      );
    }
  }
}
