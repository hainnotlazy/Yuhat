import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { removeAccessToken } from 'src/app/common/utils/local-storage.utl';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent {
  constructor(private router: Router) {}

  logout() {
    removeAccessToken();
    this.router.navigate(["/auth"]);
  }
}
