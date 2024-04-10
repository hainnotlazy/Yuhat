import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { DefaultPageComponent } from './pages/default-page/default-page.component';

const routes: Routes = [
  { path: "", component: DefaultPageComponent },
  { path: "r/:roomChatId", component: DashboardComponent },
  { path: "**", redirectTo: "" }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ChatRoutingModule { }
