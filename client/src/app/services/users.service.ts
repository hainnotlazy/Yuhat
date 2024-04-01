import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ChangePasswordDto, UpdateUserDto, UserDto } from '../dtos/user.dto';
import { catchError, tap } from 'rxjs';
import { MatSnackBar } from '@angular/material/snack-bar';
import { IErrorResponse } from '../dtos/auth.dto';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class UsersService {
  constructor(
    private httpClient: HttpClient,
    private snackbar: MatSnackBar,
    private router: Router
  ) { }

  findUser() {
    return this.httpClient.get<UserDto>("api/users");
  }

  updateUser(updateUserDto: UpdateUserDto) {
    let { dob } = updateUserDto;
    const formData = new FormData();

    for (const field of ["fullname", "bio", "gender", "avatar"]) {
      if (updateUserDto[field]) {
        formData.append(field, updateUserDto[field]);
      }
    }
    if (dob) {
      dob = new Date(dob);
      if (!isNaN(dob.getTime())) {
        formData.append("dob", dob.toISOString().split("T")[0]);
      }
    }

    return this.httpClient.put("api/users", formData).pipe(
      tap(
        () => {
          this.snackbar.open("Update profile successfully", "x", {
            duration: 2000,
            horizontalPosition: "right",
            verticalPosition: "top"
          })
        }
      ),
      catchError(
        (err: IErrorResponse) => {
          const errorMessages = err.error.message;
          if (errorMessages && errorMessages.length > 0) {
            this.snackbar.open(errorMessages, "x", {
              duration: 2000,
              horizontalPosition: "right",
              verticalPosition: "top"
            })
            throw new Error(errorMessages);
          } else {
            this.snackbar.open("Unexpected error happened! Please try again", "x", {
              duration: 2000,
              horizontalPosition: "right",
              verticalPosition: "top"
            })
            throw new Error("Unexpected error happened! Please try again");
          }
        }
      )
    );
  }

  changePassword(changePasswordDto: ChangePasswordDto) {
    const { password, newPassword } = changePasswordDto;

    return this.httpClient.put("api/users/change-password", {
      password, newPassword
    }).pipe(
      tap(
        () => {
          this.snackbar.open("Change password successfully", "x", {
            duration: 2000,
            horizontalPosition: "right",
            verticalPosition: "top"
          })
          window.location.reload;
        }
      ),
      catchError(
        (err) => {
          const errorMessages = err.error.message;
          if (errorMessages && errorMessages.length > 0) {
            this.snackbar.open(errorMessages, "x", {
              duration: 2000,
              horizontalPosition: "right",
              verticalPosition: "top"
            })
            throw new Error(errorMessages);
          } else {
            this.snackbar.open("Unexpected error happened! Please try again", "x", {
              duration: 2000,
              horizontalPosition: "right",
              verticalPosition: "top"
            })
            throw new Error("Unexpected error happened! Please try again");
          }
        }
      )
    )
  }

  verifyEmail(verificationCode: string, recaptcha: string) {
    return this.httpClient.post("api/users/verify-email", {
      verificationCode,
      recaptcha
    }).pipe(
      tap(
        () => this.router.navigate([""])
      ),
      catchError(
        (error) => {
          throw new Error(error.error.message);
        }
      )
    );
  }

  resendVerificationCode() {
    return this.httpClient.post<UserDto>("api/users/send-verification-email-mail", {}).pipe(
      tap(
        () => {
          this.snackbar.open("Sent verification code", "x", {
            duration: 2000,
            horizontalPosition: "right",
            verticalPosition: "top"
          })
        }
      ),
      catchError(
        (err: IErrorResponse) => {
          const errorMessages = err.error.message;
          if (errorMessages && errorMessages.length > 0) {
            this.snackbar.open(errorMessages, "x", {
              duration: 2000,
              horizontalPosition: "right",
              verticalPosition: "top"
            })
            throw new Error(errorMessages);
          } else {
            this.snackbar.open("Unexpected error happened! Please try again", "x", {
              duration: 2000,
              horizontalPosition: "right",
              verticalPosition: "top"
            })
            throw new Error("Unexpected error happened! Please try again");
          }
        }
      )
    )
  }
}
