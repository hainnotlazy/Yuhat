import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  title = 'client';
  subTitle?: Observable<Object>;
  constructor(private httpClient: HttpClient) {

  }

  ngOnInit() {
    this.subTitle = this.httpClient.get<Object>("api");
  }
}
