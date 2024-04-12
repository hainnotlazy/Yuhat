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
