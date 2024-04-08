import { Component, Input } from '@angular/core';
import { MessageDto } from 'src/app/dtos/message.dto';

@Component({
  selector: 'app-message',
  templateUrl: './message.component.html',
  styleUrls: ['./message.component.scss']
})
export class MessageComponent {
  @Input() message!: MessageDto;
}
