import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-edit-profile',
  templateUrl: './edit-profile.component.html',
  styleUrls: ['./edit-profile.component.scss']
})
export class EditProfileComponent {
  editProfileForm = new FormGroup({
    fullname: new FormControl(""),
    age: new FormControl(""),
    bio: new FormControl(""),
    gender: new FormControl(""),
    avatar: new FormControl(""),
  })

}
