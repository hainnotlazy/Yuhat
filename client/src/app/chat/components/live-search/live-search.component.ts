import { Component, ElementRef, HostListener, ViewChild } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { debounceTime, distinctUntilChanged, of, switchMap, tap } from 'rxjs';
import { RoomChatService } from 'src/app/services/room-chat.service';
import { UsersService } from 'src/app/services/users.service';

@Component({
  selector: 'app-live-search',
  templateUrl: './live-search.component.html',
  styleUrls: ['./live-search.component.scss'],
  host: { class: "relative" }
})
export class LiveSearchComponent {
  @ViewChild("hint") hintRef!: ElementRef;

  searchControl = new FormControl("", [Validators.required]);
  searchedUsers$ = this.searchControl.valueChanges.pipe(
    debounceTime(300),
    distinctUntilChanged(),
    switchMap(searchQuery => {
      if (!searchQuery) return of([]);
      return this.usersService.findUsersByNameOrUsername(searchQuery.trim());
    })
  )

  constructor(
    private router: Router,
    private elementRef: ElementRef,
    private usersService: UsersService,
    private roomChatService: RoomChatService
  ) {}

  @HostListener("document:click", ["$event"])
  onClickOutside(event: MouseEvent) {
    if (this.elementRef.nativeElement.contains(event.target)) {
      this.hintRef.nativeElement.classList.remove("hidden");
    } else {
      this.hintRef.nativeElement.classList.add("hidden");
    }
  }

  onCreateNewChat(userId: string = "") {
    if (!userId) return;
    this.roomChatService.createNewRoomChat(userId).pipe(
      tap(
        roomChat => {
          this.searchControl.reset();
          this.router.navigate([`/chat/r/${roomChat.id}`]);
        }
      )
    ).subscribe()
  }
}
