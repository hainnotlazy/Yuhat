import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { removeAccessToken } from '../utils/local-storage.utl';
import { JwtHelperService } from '@auth0/angular-jwt';

const publicRoutes = [
  "/auth/login",
  "/auth/register",
  "/auth/success",
  "/auth/forget-password",
  "/auth/reset-password",
]

export const authGuard: CanActivateFn = (route, state) => {
  const jwtService = inject(JwtHelperService);
  const router = inject(Router);
  const currentUrl = state.url;

  // Public routes
  if (publicRoutes.includes(currentUrl)) {
    if (jwtService.isTokenExpired()) {
      removeAccessToken();
    } else {
      return router.navigate(["/chat"]);
    }
    return true;
  }

  if (jwtService.isTokenExpired()) {
    removeAccessToken();
    return router.navigate(["/auth"]);
  }
  return true;
};
