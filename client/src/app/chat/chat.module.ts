import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ChatRoutingModule } from './chat-routing.module';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { RoomChatSelectorComponent } from './components/room-chat-selector/room-chat-selector.component';
import { SharedModule } from '../shared/shared.module';
import { MessageComponent } from './components/message/message.component';
import { InputMessageBoxComponent } from './components/input-message-box/input-message-box.component';
import { RoomChatInfoComponent } from './components/room-chat-info/room-chat-info.component';
import { DefaultPageComponent } from './pages/default-page/default-page.component';
import { LiveSearchComponent } from './components/live-search/live-search.component';
import { DialogCreateGroupChatComponent } from './components/dialog-create-group-chat/dialog-create-group-chat.component';
import { DialogViewImageComponent } from './components/dialog-view-image/dialog-view-image.component';
import { DialogManageMemberComponent } from './components/dialog-manage-member/dialog-manage-member.component';

@NgModule({
  declarations: [
    DashboardComponent,
    RoomChatSelectorComponent,
    MessageComponent,
    InputMessageBoxComponent,
    RoomChatInfoComponent,
    DefaultPageComponent,
    LiveSearchComponent,
    DialogCreateGroupChatComponent,
    DialogViewImageComponent,
    DialogManageMemberComponent,
  ],
  imports: [
    CommonModule,
    ChatRoutingModule,
    SharedModule
  ]
})
export class ChatModule { }
