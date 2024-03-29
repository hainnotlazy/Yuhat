import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ProfileRoutingModule } from './profile-routing.module';
import { EditProfileComponent } from './pages/edit-profile/edit-profile.component';
import { SharedModule } from '../shared/shared.module';

@NgModule({
  declarations: [
    EditProfileComponent
  ],
  imports: [
    CommonModule,
    ProfileRoutingModule,
    SharedModule,
  ]
})
export class ProfileModule { }
