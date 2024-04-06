import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthLayoutComponent } from './auth-layout/auth-layout.component';
import { HeaderComponent } from './components/header/header.component';
import { FooterComponent } from './components/footer/footer.component';
import { RouterModule } from '@angular/router';
import { FullLayoutComponent } from './full-layout/full-layout.component';
import { ChatLayoutComponent } from './chat-layout/chat-layout.component';

@NgModule({
  declarations: [
    HeaderComponent,
    FooterComponent,
    AuthLayoutComponent,
    FullLayoutComponent,
    ChatLayoutComponent
  ],
  imports: [
    RouterModule,
    CommonModule
  ],
  exports: [
    HeaderComponent,
    FooterComponent,
    AuthLayoutComponent
  ]
})
export class LayoutModule { }
