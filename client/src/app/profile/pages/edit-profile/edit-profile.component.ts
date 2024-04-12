import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { IUser } from 'src/app/common/models/user.dto';
import { IValidationMessages } from 'src/app/common/interfaces/form.interface';
import { UsersService } from 'src/app/services/users.service';
import { environment } from 'src/environments/environment.development';

@Component({
  selector: 'app-edit-profile',
  templateUrl: './edit-profile.component.html',
  styleUrls: ['./edit-profile.component.scss'],
})
export class EditProfileComponent implements OnInit {
  imageUrl?: string;

  fullnameRequirements = {
    minlength: 3,
    maxlength: 255
  }
  bioRequirements = {
    maxlength: 255
  }

  fullnameValidationMsg: IValidationMessages = {
    required: "Fullname is required",
    minlength: `Fullname must have more than ${this.fullnameRequirements.minlength} characters`,
    maxlength: `Fullname must have less than ${this.fullnameRequirements.maxlength} characters`
  }
  bioValidationmsg: IValidationMessages = {
    maxlength: `Bio must have less than ${this.bioRequirements.maxlength} characters`
  }

  editProfileForm = new FormGroup({
    fullname: new FormControl('', [
      Validators.required,
      Validators.minLength(this.fullnameRequirements.minlength),
      Validators.maxLength(this.fullnameRequirements.maxlength)
    ]),
    dob: new FormControl(new Date()),
    bio: new FormControl('', [
      Validators.maxLength(this.bioRequirements.maxlength)
    ]),
    gender: new FormControl(''),
    avatar: new FormControl(null),
  });

  constructor(private usersService: UsersService) {}

  ngOnInit(): void {
    this.usersService.findUser().subscribe((data) => {
      this.editProfileForm.patchValue({
        fullname: data.fullname,
        bio: data.bio,
        gender: data.gender,
        dob: data.dob,
      });
      this.imageUrl = data.avatar?.includes("https") ? data.avatar : `${environment.server}/${data.avatar}`;
    });
  }

  getObjectKeys(arg: any): string[] {
    try {
      return Object.keys(arg);
    } catch (err) {
      return [];
    }
  }

  onImageUpload(event: Event) {
    const fileList = (event.target as HTMLInputElement).files;

    if (fileList && fileList.length > 0) {
      const file = fileList[0];
      const reader = new FileReader();
      reader.onload = (e: any) => {
        this.imageUrl = e.target.result;
      };
      reader.readAsDataURL(file);
      this.editProfileForm.patchValue({ avatar: file as any });
    }
  }

  onSubmit() {
    if (this.editProfileForm.valid) {
      this.usersService.updateUser(this.editProfileForm.value as Partial<IUser>).subscribe()
    }
  }
}
