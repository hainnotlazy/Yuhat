import { Component, Input } from '@angular/core';
import { IMessage } from 'src/app/common/models/message.model';

@Component({
  selector: 'app-message',
  templateUrl: './message.component.html',
  styleUrls: ['./message.component.scss']
})
export class MessageComponent {
  @Input() message!: IMessage;

  ngOnInit() {
    this.message.attachments.sort((a, b) => {
      const isFileA = this.isFile(a.filePath);
      const isFileB = this.isFile(b.filePath);

      if (isFileA && !isFileB) {
        return -1;
      } else if (!isFileA && isFileB) {
        return 1;
      }
      return 0;
    })
  }

  isFile(filePath: string) {
    return filePath.match(/\.(doc|pdf|zip|rar)$/i);
  }

  getFileName(filePath: string) {
    const fileParams = filePath.split("/");

    return fileParams[fileParams.length - 1];
  }
}
