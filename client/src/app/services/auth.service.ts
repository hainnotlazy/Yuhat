import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ILoginUser, IRegisterUser } from '../common/models/auth.dto';
import { IAuthResponse, IErrorResponse } from './../common/interfaces/response.interface';
import { catchError, tap } from 'rxjs';
import { setAccessToken } from "../common/utils/local-storage.utl"

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  constructor(
    private httpClient: HttpClient,
  ) { }

  login(loginUserDto: ILoginUser) {
    const { username, password, recaptcha } = loginUserDto;

    return this.httpClient.post<IAuthResponse>("api/auth/login", {
      username, password, recaptcha
    }).pipe(
      tap(
        (response: IAuthResponse) => {
          const token = response.access_token;
          setAccessToken(token);
        }
      ),
      catchError(
        (err: IErrorResponse) => {
          throw new Error(err.error.message ?? "Unexpected error happened!");
        }
      )
    )
  }

  register(registerUserDto: IRegisterUser) {
    const { username, email, password } = registerUserDto;

    return this.httpClient.post<IAuthResponse>("api/auth/register", {
      username,
      email: email || undefined,
      password
    }).pipe(
      tap(
        (response: IAuthResponse) => {
          const token = response.access_token;
          setAccessToken(token);
        }
      ),
      catchError(
        (err: IErrorResponse) => {
          throw new Error(err.error.message);
        }
      )
    )
  }
}
