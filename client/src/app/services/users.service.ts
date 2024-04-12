import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { IChangePassword, IUser } from '../common/models/user.dto';
import { catchError, map, of, tap } from 'rxjs';
import { MatSnackBar } from '@angular/material/snack-bar';
import { IErrorResponse } from '../dtos/auth.dto';
import { Router } from '@angular/router';
import { environment } from 'src/environments/environment.development';

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
    return this.httpClient.get<Partial<IUser>>("api/users");
  }

  findUsersByNameOrUsername(searchQuery: string) {
    return this.httpClient.get<Partial<IUser>[]>(`api/users/${searchQuery}/find-users`).pipe(
      map(
        response => {
          return response.map(
            user => ({
              ...user,
              avatar: `${environment.server}/${user.avatar}`
            })
          )
        }
      ),
      catchError(
        error => of([])
      )
    )
  }

  updateUser(updateUser: Partial<IUser>) {
    let { dob } = updateUser;
    const formData = new FormData();

    for (const field of ["fullname", "bio", "gender", "avatar"]) {
      if (updateUser[field]) {
        formData.append(field, updateUser[field]);
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
          const errorMessages = err.error.message ?? "Unexpected error happened! Please try again";
          this.snackbar.open(errorMessages, "x", {
            duration: 2000,
            horizontalPosition: "right",
            verticalPosition: "top"
          })
          throw new Error(errorMessages);
        }
      )
    );
  }

  changePassword(changePasswordData: IChangePassword) {
    const { password, newPassword } = changePasswordData;

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
          window.location.reload();
        }
      ),
      catchError(
        (err) => {
          const errorMessages = err.error.message ?? "Unexpected error happened! Please try again";
          this.snackbar.open(errorMessages, "x", {
            duration: 2000,
            horizontalPosition: "right",
            verticalPosition: "top"
          })
          throw new Error(errorMessages);
        }
      )
    )
  }

  resendVerificationCode() {
    return this.httpClient.post<Partial<IUser>>("api/users/send-verification-email-mail", {}).pipe(
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
          const errorMessages = err.error.message ?? "Unexpected error happened! Please try again";
          this.snackbar.open(errorMessages, "x", {
            duration: 2000,
            horizontalPosition: "right",
            verticalPosition: "top"
          })
          throw new Error(errorMessages);
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
        (error: IErrorResponse) => {
          throw new Error(error.error.message ?? "Unexpected error happened! Please try again");
        }
      )
    );
  }

  sendForgetPasswordMail(username: string) {
    return this.httpClient.post<Partial<IUser>>("api/users/send-forget-password-mail", {
      username
    }).pipe(
      tap(
        () => this.router.navigate([`auth/reset-password`], {queryParams: { username: username }})
      ),
      catchError(
        (err: IErrorResponse) => {
          const errorMessages = err.error.message ?? "Unexpected error happened! Please try again";
          this.snackbar.open(errorMessages, "x", {
            duration: 2000,
            horizontalPosition: "right",
            verticalPosition: "top"
          })
          throw new Error(errorMessages);
        }
      )
    )
  }

  resetPassword(username: string, newPassword: string, validationCode: string) {
    return this.httpClient.post("api/users/reset-password", {
      username, newPassword, validationCode
    }).pipe(
      tap(
        () => this.router.navigate(["auth/login"])
      ),
      catchError(
        (err: IErrorResponse) => {
          const errorMessages = err.error.message ?? "Unexpected error happened! Please try again";
          this.snackbar.open(errorMessages, "x", {
            duration: 2000,
            horizontalPosition: "right",
            verticalPosition: "top"
          })
          throw new Error(errorMessages);
        }
      )
    )
  }
}
