import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthLayoutComponent } from './layout/auth-layout/auth-layout.component';
import { authGuard } from './common/guards/auth.guard';
import { FullLayoutComponent } from './layout/full-layout/full-layout.component';
import { ChatLayoutComponent } from './layout/chat-layout/chat-layout.component';

const routes: Routes = [
  {
    path: "auth",
    component: AuthLayoutComponent,
    loadChildren: () => import("./auth/auth.module").then(m => m.AuthModule),
    canActivate: [authGuard]
  },
  { path: "", redirectTo: "/chat", pathMatch: "full" },
  {
    path: "",
    component: FullLayoutComponent,
    children: [
      { path: "profile", loadChildren: () => import("./profile/profile.module").then(m => m.ProfileModule) },
    ],
    canActivate: [authGuard]
  },
  {
    path: "",
    component: ChatLayoutComponent,
    canActivate: [authGuard],
    children: [
      { path: "chat", loadChildren: () => import("./chat/chat.module").then(m => m.ChatModule) },
    ]
  },
  { path: "**", redirectTo: "/chat" }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
