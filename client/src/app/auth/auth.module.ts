import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AuthRoutingModule } from './auth-routing.module';
import { LoginComponent } from './pages/login/login.component';
import { RegisterComponent } from './pages/register/register.component';
import { SharedModule } from '../shared/shared.module';
import { SuccessComponent } from './pages/success/success.component';
import { VerifyEmailComponent } from './pages/verify-email/verify-email.component';
import { ForgetPasswordStep1Component } from './pages/forget-password-step-1/forget-password-step-1.component';
import { ForgetPasswordStep2Component } from './pages/forget-password-step-2/forget-password-step-2.component';

@NgModule({
  declarations: [
    LoginComponent,
    RegisterComponent,
    SuccessComponent,
    VerifyEmailComponent,
    ForgetPasswordStep1Component,
    ForgetPasswordStep2Component
  ],
  imports: [
    CommonModule,
    AuthRoutingModule,
    SharedModule,
  ]
})
export class AuthModule { }
