import { Component, Input } from '@angular/core';
import { IMessage } from 'src/app/common/models/message.model';

@Component({
  selector: 'app-message',
  templateUrl: './message.component.html',
  styleUrls: ['./message.component.scss']
})
export class MessageComponent {
  @Input() message!: IMessage;
}
