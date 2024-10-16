import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations'
import { DatePipe } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { Routes, RouterModule } from "@angular/router";

import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import  {DividerModule } from 'primeng/divider';
// import { IconFieldModule } from 'primeng/iconfield';
// import { InputIconModule } from 'primeng/inputicon';
import { MenubarModule } from 'primeng/menubar';
import { MenuItem } from 'primeng/api';
import { MenuModule } from 'primeng/menu';
import { MessageService } from 'primeng/api';
import { PanelModule } from 'primeng/panel';
import { ScrollPanelModule } from 'primeng/scrollpanel';
import { SidebarModule } from 'primeng/sidebar';
import { ToastModule } from 'primeng/toast';
import { TabViewModule } from 'primeng/tabview';
import { TableModule } from 'primeng/table';
import { InputTextareaModule } from 'primeng/inputtextarea';

//import { AppRoutingModule } from './app-routing.module';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { ServersComponent } from './servers/servers.component';
import { ServerComponent }  from './servers/server/server.component';
import { ServerStatusComponent } from './serverstatus/serverstatus.component';

import { ServerService } from '../services/servers.Service';
import { ErrorPageComponent } from './error-page/error-page.component';

@NgModule({
  declarations: [
    AppComponent,
    ServersComponent,
    ServerComponent,
    ServerStatusComponent,
    ErrorPageComponent
  ],
  imports: [
    BrowserAnimationsModule,
    BrowserModule,
    HttpClientModule,
    AppRoutingModule,
    //RouterModule.forRoot(appRoutes),
    ButtonModule,
    CardModule,
    DatePipe,
    DividerModule,
    InputTextareaModule,
    MenubarModule,
    MenuModule,
    PanelModule,
    ScrollPanelModule,
    SidebarModule,
    TableModule,
    TabViewModule,
    ToastModule
  ],
  providers: [DatePipe, MessageService, ServerService],
  bootstrap: [AppComponent]
})
export class AppModule { }
