import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ChatRoutingModule } from './chat-routing.module';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { RoomChatSelectorComponent } from './components/room-chat-selector/room-chat-selector.component';
import { SharedModule } from '../shared/shared.module';
import { MessageComponent } from './components/message/message.component';

@NgModule({
  declarations: [
    DashboardComponent,
    RoomChatSelectorComponent,
    MessageComponent,
  ],
  imports: [
    CommonModule,
    ChatRoutingModule,
    SharedModule
  ]
})
export class ChatModule { }
