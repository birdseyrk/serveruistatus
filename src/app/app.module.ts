import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations'
import { HttpClientModule } from '@angular/common/http';
import { Routes, RouterModule } from "@angular/router";

import { ButtonModule } from 'primeng/button';
import { MenuModule } from 'primeng/menu';
import { PanelModule } from 'primeng/panel';
import { ScrollPanelModule } from 'primeng/scrollpanel';
import { ToastModule } from 'primeng/toast';
import { TabViewModule } from 'primeng/tabview';
import { TableModule } from 'primeng/table';
import { InputTextareaModule } from 'primeng/inputtextarea';

//import { AppRoutingModule } from './app-routing.module';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { ServersComponent } from './servers/servers.component';
import { ServerComponent }  from './servers/server/server.component';
import { HomeComponent } from './home/home.component';

import { ServerService } from './servers/servers.Service';
import { ErrorPageComponent } from './error-page/error-page.component';

@NgModule({
  declarations: [
    AppComponent,
    ServersComponent,
    ServerComponent,
    HomeComponent,
    ErrorPageComponent
  ],
  imports: [
    BrowserAnimationsModule,
    BrowserModule,
    HttpClientModule,
    AppRoutingModule,
    //RouterModule.forRoot(appRoutes),
    ButtonModule,
    InputTextareaModule,
    MenuModule,
    PanelModule,
    ScrollPanelModule,
    TableModule,
    TabViewModule,
    ToastModule
  ],
  providers: [ServerService],
  bootstrap: [AppComponent]
})
export class AppModule { }
