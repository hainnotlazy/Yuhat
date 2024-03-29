import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-edit-profile',
  templateUrl: './edit-profile.component.html',
  styleUrls: ['./edit-profile.component.scss']
})
export class EditProfileComponent implements OnInit {
  someMessage?: Observable<string>;
  constructor(private httpClient: HttpClient) {}

  ngOnInit(): void {
    this.someMessage = this.httpClient.get<string>("api");
  }
}
