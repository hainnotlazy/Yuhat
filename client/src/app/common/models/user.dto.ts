export interface IUser {
  [key: string]: any;
  id: string;
  username: string;
  password: string;
  fullname: string;
  dob: Date;
  bio: string;
  gender: string;
  avatar: string;
  isActive: boolean;
  emailVerificationCode: number;
  emailVerified: boolean;
  availableTimeVerifyEmail: Date;
  email: string;
  github: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface IChangePassword {
  [key: string]: any;
  password: string;
  newPassword: string;
  passwordConfirmation: string;
}
