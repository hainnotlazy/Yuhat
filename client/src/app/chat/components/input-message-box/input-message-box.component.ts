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

  // Files upload
  selectedFiles: File[] = [];
  imageUrls: string[] = [];
  filesInput = new FormControl(null);

  onFileSelect(event: any) {
    const files: File[] = event.target.files;
    // this.selectedFiles = files;

    // Read selected image files as data URLs
    for (let file of files) {
      this.selectedFiles.push(file);
      if (file.type.startsWith('image/')) {
        const reader = new FileReader();
        reader.onload = () => {
          // Push the data URL into the imageUrls array
          this.imageUrls.push(reader.result as string);
        };
        reader.readAsDataURL(file);
      }
    }
    this.filesInput.patchValue(this.selectedFiles as any)
  }

  popSelectedFile(index: number) {
    this.imageUrls.splice(index, 1);
    this.selectedFiles?.splice(index, 1);
    this.filesInput.patchValue(this.selectedFiles as any);
  }

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

  onSendMessage() {
    if (this.messageInput.valid && !!this.messageInput.value?.trim()) {
      const msg = this.messageInput.value.split("\n").join("<br>");

      this.chatService.sendMessage(this.selectedRoomChat.id, msg, this.selectedFiles);

      this.resetInput();
    } else if (!this.messageInput.value?.trim()) {
      this.resetInput();
    }
  }

  private resetInput() {
    setTimeout(() => {
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
