import { MessagesComponent } from './messages/messages.component';
import { SharedModule } from './../shared/shared.module';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { HeaderComponent } from './navigation/header/header.component';
import { SidenavListComponent } from './navigation/sidenav-list/sidenav-list.component';
import { WelcomeComponent } from './welcome/welcome.component';

import { AppRoutingModule } from '../app-routing.module';

@NgModule({
  declarations: [HeaderComponent, SidenavListComponent, WelcomeComponent, MessagesComponent],
  imports: [CommonModule, AppRoutingModule, SharedModule],
  exports: [WelcomeComponent, HeaderComponent, SidenavListComponent, MessagesComponent],
})
export class CoreModule {}
