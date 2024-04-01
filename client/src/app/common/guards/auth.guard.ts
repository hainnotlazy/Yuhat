import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { removeAccessToken } from '../utils/local-storage.utl';
import { JwtHelperService } from '@auth0/angular-jwt';

export const authGuard: CanActivateFn = (route, state) => {
  const jwtService = inject(JwtHelperService);
  const router = inject(Router);
  const currentUrl = state.url;

  // FIXME: Protect route verify email
  if (currentUrl === "/auth/verify-email" && !jwtService.isTokenExpired()) {
    return true;
  }

  if (currentUrl.split("/")[1] === "auth") {
    if (!jwtService.isTokenExpired()) {
      router.navigate(["/dashboard"]);
      return false;
    }
    removeAccessToken();
    return true;
  }

  if (jwtService.isTokenExpired()) {
    removeAccessToken();
    router.navigate(["/auth"]);
    return false;
  }
  return true;
};
