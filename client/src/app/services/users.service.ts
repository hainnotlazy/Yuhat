import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { UpdateUserDto, UserDto } from '../dtos/user.dto';
import { catchError, tap } from 'rxjs';
import { MatSnackBar } from '@angular/material/snack-bar';
import { IErrorResponse } from '../dtos/auth.dto';

@Injectable({
  providedIn: 'root'
})
export class UsersService {
  constructor(
    private httpClient: HttpClient,
    private snackbar: MatSnackBar
  ) { }

  findUser() {
    return this.httpClient.get<UserDto>("api/users");
  }

  updateUser(updateUser: UpdateUserDto) {
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
}
