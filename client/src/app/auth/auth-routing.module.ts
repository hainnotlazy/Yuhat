import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './pages/login/login.component';
import { RegisterComponent } from './pages/register/register.component';
import { SuccessComponent } from './pages/success/success.component';
import { VerifyEmailComponent } from './pages/verify-email/verify-email.component';
import { ForgetPasswordStep1Component } from './pages/forget-password-step-1/forget-password-step-1.component';
import { ForgetPasswordStep2Component } from './pages/forget-password-step-2/forget-password-step-2.component';

const routes: Routes = [
  { path: "login", component: LoginComponent },
  { path: "register", component: RegisterComponent },
  { path: "success", component: SuccessComponent },
  { path: "verify-email", component: VerifyEmailComponent },
  { path: "forget-password", component: ForgetPasswordStep1Component },
  { path: "reset-password", component: ForgetPasswordStep2Component },
  { path: "**", redirectTo: "login" }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AuthRoutingModule { }
