import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';

export const authGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);
  const currentUrl = state.url;

  if (currentUrl.split("/")[1] === "auth") {
    if (authService.isAuthenticated()) {
      router.navigate(["/dashboard"]);
      return false;
    }
    return true;
  }

  if (!authService.isAuthenticated()) {
    router.navigate(["/auth"]);
    return false;
  }
  return true;
};
