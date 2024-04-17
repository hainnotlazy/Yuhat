import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { removeAccessToken } from 'src/app/common/utils/local-storage.utl';
import { UsersService } from 'src/app/services/users.service';
import { environment } from 'src/environments/environment.development';

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
    this.usersService.findUser().subscribe(
      data => {
        this.fullname = data.fullname || "";
        this.username = data.username || "";
        if (data.avatar) {
          this.avatar = data.avatar?.includes("https") ? data.avatar : `${environment.server}/${data.avatar}`;
        } else {
          this.avatar = `${environment.server}/public/avatars/default-avatar.jpg`
        }
      }
    )
  }

  logout() {
    removeAccessToken();
    this.router.navigate(["/auth"]);
  }
}
