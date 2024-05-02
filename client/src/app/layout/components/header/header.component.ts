import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { tap } from 'rxjs';
import { removeAccessToken } from 'src/app/common/utils/local-storage.utl';
import { UsersService } from 'src/app/services/users.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {
  fullname = "";
  username = "";
  avatar = "";

  constructor(
    private router: Router,
    private usersService: UsersService
  ) {}

  ngOnInit(): void {
    this.usersService.findUser().pipe(
      tap(
        data => {
          this.fullname = data.fullname as string;
          this.username = data.username as string;
          this.avatar = data.avatar as string;
        }
      )
    ).subscribe();
  }

  logout() {
    removeAccessToken();
    this.router.navigate(["/auth"]);
  }
}
