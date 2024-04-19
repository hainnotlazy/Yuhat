import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-dialog-view-image',
  templateUrl: './dialog-view-image.component.html',
  styleUrls: ['./dialog-view-image.component.scss']
})
export class DialogViewImageComponent {
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: { filePath: string }
  ) {}
}
