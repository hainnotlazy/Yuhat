export interface ILoginUser {
  username: string;
  password: string;
  recaptcha: string;
}

export interface IRegisterUser {
  username: string;
  email?: string;
  password: string;
}
