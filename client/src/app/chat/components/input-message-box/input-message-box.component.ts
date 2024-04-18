import { AfterViewInit, Component, ElementRef, Input, ViewChild } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { fromEvent, tap } from 'rxjs';
import { IRoomChat } from 'src/app/common/models/room-chat.model';
import { ChatService } from 'src/app/services/chat.service';

@Component({
  selector: 'app-input-message-box',
  templateUrl: './input-message-box.component.html',
  styleUrls: ['./input-message-box.component.scss']
})
export class InputMessageBoxComponent implements AfterViewInit {
  @Input() selectedRoomChat!: IRoomChat;

  @ViewChild("input") inputRef!: ElementRef;
  inputInitialHeight = 40;
  inputMaxHeight = 120;

  messageInput = new FormControl("", [
    Validators.required,
  ]);
  filesInput = new FormControl(null);

  // Files upload
  selectedFiles: File[] = [];

  // Used for preview after uploaded
  fileTypesAllowed: string[] = [
    "application/pdf",
    "application/msword",
    "application/x-zip-compressed",
    "application/x-compressed"
  ];
  filesForPreview: string[] = [];
  imagesForPreview: string[] = [];

  constructor(private chatService: ChatService) {}

  ngAfterViewInit() {
    this.inputInitialHeight = this.inputRef.nativeElement.offsetHeight;

    fromEvent(this.inputRef.nativeElement, 'keydown').pipe(
      tap((event: any) => {
        if (event.shiftKey && event.key === 'Enter') {
          this.growInputHeight();
        }
        else if (event.key === "Enter") {
          this.onSendMessage();
        }
      })
    ).subscribe();
  }

  onFileSelect(event: any) {
    const files: File[] = event.target.files;

    // Read selected image files as data URLs
    for (let file of files) {
      if (file.type.startsWith('image/')) {
        const reader = new FileReader();
        reader.onload = () => {
          // Push the data URL into the imageUrls array
          this.imagesForPreview.push(reader.result as string);
        };
        reader.readAsDataURL(file);
      } else if (this.fileTypesAllowed.includes(file.type)) {
        const fileName = file.name;
        this.filesForPreview.push(fileName);
      } else {
        return;
      }
      this.selectedFiles.push(file);
    }
  }

  popSelectedFile(index: number) {
    this.imagesForPreview.splice(index, 1);
    this.selectedFiles?.splice(index, 1);
  }

  onSendMessage() {
    if (this.messageInput.valid && !!this.messageInput.value?.trim()) {
      const msg = this.messageInput.value.split("\n").join("<br>");

      this.chatService.sendMessage(this.selectedRoomChat.id, msg, this.selectedFiles);

      this.resetInput();
    } else if (!this.messageInput.value?.trim() && this.selectedFiles.length > 0) {
      this.chatService.sendMessage(this.selectedRoomChat.id, "", this.selectedFiles);

      this.resetInput();
    } else if (!this.messageInput.value?.trim()) {
      this.resetInput();
    }
  }

  private resetInput() {
    setTimeout(() => {
      this.selectedFiles = [];
      this.imagesForPreview = [];
      this.filesForPreview = [];
      this.filesInput.reset();
      this.messageInput.reset();
      this.messageInput.setValue(('').trim());
      this.inputRef.nativeElement.style.height = this.inputInitialHeight + "px";
    }, 0);
  }

  private growInputHeight() {
    if (this.inputRef.nativeElement.scrollHeight <= this.inputMaxHeight) {
      this.inputRef.nativeElement.style.height = this.inputRef.nativeElement.scrollHeight + 20 + "px";
    }
  }
}
