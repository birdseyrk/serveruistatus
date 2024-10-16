import { Component, OnInit } from '@angular/core';
//import { ConsoleReporter } from 'jasmine';

import { Injectable } from '@angular/core';

import { MessageService } from 'primeng/api';
import { ServerService } from '../services/servers.Service';
import { HeartbeatService } from '../services/heartbeat.Service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  constructor(
    private heartbeatService: HeartbeatService,
    private serverService: ServerService,
    private messageService: MessageService
    ) { }

  ngOnInit() {
    console.log('******** AppComponent ********');
    this.serverService.getStatus();
    this.serverService.startStatusTimer();
    this.heartbeatService.startStatusTimer();
  }
}
