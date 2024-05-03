import { Component, Inject } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { catchError, debounceTime, distinctUntilChanged, of, startWith, switchMap, tap } from 'rxjs';
import { IRoomChat } from 'src/app/common/models/room-chat.model';
import { RoomChatService } from 'src/app/services/room-chat.service';
import { UsersService } from 'src/app/services/users.service';

@Component({
  selector: 'app-dialog-manage-member',
  templateUrl: './dialog-manage-member.component.html',
  styleUrls: ['./dialog-manage-member.component.scss']
})
export class DialogManageMemberComponent {
  nameControl = new FormControl("");
  user$ = this.nameControl.valueChanges.pipe(
    debounceTime(300),
    distinctUntilChanged(),
    startWith(null),
    switchMap(searchQuery => {
      if (!searchQuery || typeof searchQuery === "object") return of([]);
      return this.usersService.findUsersByNameOrUsername(searchQuery.trim());
    })
  )

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: IRoomChat,
    private roomChatService: RoomChatService,
    private usersService: UsersService
  ) { }

  removeUser(index: number, userId: string = "") {
    const roomChatId = this.data.id;

    this.roomChatService.removeUserFromGroupChat(roomChatId, userId).subscribe(
      () => {
        this.data.participants.splice(index, 1);
      }
    );
  }

  selected(event: MatAutocompleteSelectedEvent) {
    const user = event.option.value;
    const roomChatId = this.data.id;

    this.roomChatService.addUserToGroupChat(roomChatId, user.id).subscribe(
      () => {
        this.data.participants.push({
          role: "member",
          user: user
        });
        this.nameControl.setValue("");
      }
    )
  }
}
