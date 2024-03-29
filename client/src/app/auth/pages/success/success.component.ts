import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { setAccessToken } from 'src/app/common/utils/local-storage.utl';

@Component({
  selector: 'app-success',
  templateUrl: './success.component.html',
  styleUrls: ['./success.component.scss']
})
export class SuccessComponent implements OnInit {
  constructor(
    private router: Router
  ) {}

  ngOnInit(): void {
    const accessToken = this.getCookie('access_token');
    console.log(document.cookie);
    console.log(accessToken);
    if (accessToken) {
      setAccessToken(accessToken);
      this.removeCookie('access_token');
      this.router.navigate([""]);
    } else {
      this.router.navigate(["auth/login"]);
    }
  }

  private getCookie(name: string): string {
    const cookieValue = document.cookie
      .split('; ')
      .find(row => row.startsWith(name))
      ?.split('=')[1];
    return cookieValue || '';
  }

  private removeCookie(name: string) {
    document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
  }
}
