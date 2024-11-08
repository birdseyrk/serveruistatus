import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations'
import { DatePipe } from '@angular/common';
import { provideHttpClient } from '@angular/common/http';
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


import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { ErrorPageComponent } from './error-page/error-page.component';
import { ServersComponent } from './servers/servers.component';
import { ServerstatusComponent } from './serverstatus/serverstatus.component';
import { ServerComponent } from './servers/server/server.component';

import { ServerService } from '../services/server.service';


const appRoutes: Routes = [
  {path: 'servers',      component: ServersComponent},
  {path: 'server',       component: ServerComponent},
  {path: 'serverstatus', component: ServerstatusComponent}
];

@NgModule({
  declarations: [
    AppComponent,
    ErrorPageComponent,
    ServersComponent,
    ServerstatusComponent,
    ServerComponent
  ],
  imports: [
    RouterModule.forRoot(appRoutes),
    AppRoutingModule,
    BrowserAnimationsModule,
    BrowserModule,
    AppRoutingModule,
    //HttpClientModule,
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
  exports: [RouterModule],
  providers: [provideHttpClient(), DatePipe, MessageService, ServerService],
  bootstrap: [AppComponent]
})
export class AppModule { }
