import { IAuthResponse, IErrorResponse } from './../dtos/auth.dto';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { LoginUserDto, RegisterUserDto } from '../dtos/auth.dto';
import { catchError, tap } from 'rxjs';
import { Router } from '@angular/router';
import { setAccessToken } from "../common/utils/local-storage.utl"

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  constructor(
    private httpClient: HttpClient,
    private router: Router
  ) { }

  login(loginUserDto: LoginUserDto) {
    const { username, password } = loginUserDto;

    return this.httpClient.post<IAuthResponse>("api/auth/login", {
      username, password
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

  register(registerUserDto: RegisterUserDto) {
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

  authByGoogle() {
    return this.router.navigate(["http://localhost:3000/api/auth/google"]);
  }
}
