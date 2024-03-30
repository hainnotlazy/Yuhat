import { Component, OnInit } from '@angular/core';
import { ChatService } from '../services/chat.service';

@Component({
  selector: 'app-test',
  templateUrl: './test.component.html',
  styleUrls: ['./test.component.scss']
})
export class TestComponent implements OnInit {
  message = "Hello server";
  messages: string[] = [];

  constructor(private chatService: ChatService) {}

  ngOnInit() {
    this.chatService.getMessage().subscribe(
      message => this.messages.push(message)
    )
  }

  sendMessage() {
    this.chatService.sendMessage(this.message);
  }
}
