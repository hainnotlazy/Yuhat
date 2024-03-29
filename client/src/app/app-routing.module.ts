import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AppComponent } from './app.component';
import { AuthLayoutComponent } from './layout/auth-layout/auth-layout.component';
import { authGuard } from './common/guards/auth.guard';
import { FullLayoutComponent } from './layout/full-layout/full-layout.component';

const routes: Routes = [
  {
    path: "auth",
    component: AuthLayoutComponent,
    loadChildren: () => import("./auth/auth.module").then(m => m.AuthModule),
    canActivate: [authGuard]
  },
  {
    path: "profile",
    component: FullLayoutComponent,
    loadChildren: () => import("./profile/profile.module").then(m => m.ProfileModule),
    canActivate: [authGuard]
  },
  { path: "", component: AppComponent, canActivate: [authGuard] },
  { path: "**", redirectTo: "" }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
