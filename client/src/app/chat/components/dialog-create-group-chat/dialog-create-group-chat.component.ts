import { Component, ElementRef, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { debounceTime, distinctUntilChanged, of, startWith, switchMap, tap } from 'rxjs';
import { UsersService } from 'src/app/services/users.service';
import { IUser } from 'src/app/common/models/user.model';
import { IValidationMessages } from 'src/app/common/interfaces/form.interface';
import { RoomChatService } from 'src/app/services/room-chat.service';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';

@Component({
  selector: 'app-dialog-create-group-chat',
  templateUrl: './dialog-create-group-chat.component.html',
  styleUrls: ['./dialog-create-group-chat.component.scss']
})
export class DialogCreateGroupChatComponent {
  imageUrl = "http://localhost:3000/public/avatars/default-group-chat.jpg";
  nameRequirement = {
    minlength: 5,
    maxlength: 255,
  }
  usernameValidationMsg: IValidationMessages = {
    required: "Group name is required",
    minlength: `Group name must have more than ${this.nameRequirement.minlength} characters`,
    maxlength: `Group name must have less than ${this.nameRequirement.maxlength} characters`,
  }

  form = new FormGroup({
    name: new FormControl("", [
      Validators.required,
      Validators.minLength(this.nameRequirement.minlength),
      Validators.maxLength(this.nameRequirement.maxlength)
    ]),
    members: new FormControl(""),
    avatar: new FormControl("")
  })
  memberSelected: IUser[] = [];
  member$ = this.form.get("members")?.valueChanges.pipe(
    debounceTime(300),
    distinctUntilChanged(),
    startWith(null),
    switchMap(searchQuery => {
      if (!searchQuery || typeof searchQuery === "object") return of([]);
      return this.usersService.findUsersByNameOrUsername(searchQuery.trim());
    })
  )

  @ViewChild("memberInput") memberInput!: ElementRef<HTMLInputElement>;

  constructor(
    private usersService: UsersService,
    private roomChatService: RoomChatService,
    private dialog: MatDialog,
    private router: Router,
  ) {}

  onSubmit() {
    if (this.form.valid) {
      this.roomChatService.createNewGroupChat(
        this.memberSelected,
        this.form.get("name")?.value as string,
        this.form.get("avatar")?.value as string
      ).pipe(
        tap(
          data => {
            this.router.navigate([`/chat/r/${data.id}`])
            this.dialog.closeAll();
          }
        )
      ).subscribe();
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
      this.form.patchValue({ avatar: file as any });
    }
  }

  remove(memberId: string): void {
    const index = this.memberSelected.findIndex(member => member.id === memberId);

    if (index >= 0) {
      this.memberSelected.splice(index, 1);
    }
  }

  selected(event: MatAutocompleteSelectedEvent): void {
    const user = event.option.value;

    const isSelected = !!this.memberSelected.find(member => member.id === user.id);

    if (!isSelected) {
      this.memberSelected.push(user);
      this.memberInput.nativeElement.value = "";
      this.form.get("members")?.setValue(null);
    }
  }

  getObjectKeys(arg: any): string[] {
    try {
      return Object.keys(arg);
    } catch (err) {
      return [];
    }
  }
}
