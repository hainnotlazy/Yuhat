import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { UserDto } from '../dtos/user.dto';

export interface updateUser {
  fullname: string;
  dob?: Date;
  bio?: string;
  gender?: string;
  avatar?: File;
}

@Injectable({
  providedIn: 'root'
})
export class UsersService {
  constructor(private httpClient: HttpClient) { }

  findUser() {
    return this.httpClient.get<UserDto>("api/users");
  }

  updateUser(updateUser: updateUser) {
    const { fullname, dob, bio, gender, avatar } = updateUser;
    const formData = new FormData();
    formData.append("fullname", fullname);
    if (bio) formData.append("bio", bio);
    // if (dob) formData.append("dob", dob);
    if (gender) formData.append("gender", gender);
  }
}
