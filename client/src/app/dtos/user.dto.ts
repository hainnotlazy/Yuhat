export interface UserDto {
  id?: string;
  username?: string;
  password?: string;
  fullname?: string;
  bio?: string;
  dob?: Date;
  gender?: string;
  avatar?: string;
  isActive?: boolean;
  emailVerificationCode?: number;
  emailVerified?: boolean;
  availableTimeVerifyEmail: Date;
  email?: string;
  github?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface UpdateUserDto {
  [key: string]: any;
  fullname?: string;
  bio?: string;
  dob?: Date;
  gender?: string;
  avatar?: File;
}

export interface ChangePasswordDto {
  [key: string]: any;
  password: string;
  newPassword: string;
  passwordConfirmation: string;
}
