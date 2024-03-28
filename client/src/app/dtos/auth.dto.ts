export interface LoginUserDto {
  username: string;
  password: string;
}

export interface RegisterUserDto {
  username: string;
  email?: string;
  password: string;
}

export interface IAuthResponse {
  access_token: string;
}

export interface IErrorResponse {
  error: {
    error: string;
    message: string;
    statusCode: number;
  }
}
