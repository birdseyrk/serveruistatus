import { Component, OnInit } from '@angular/core';

import { MessageService } from 'primeng/api';
import { ServerService } from '../services/server.service';
import { HeartbeatService } from '../services/heartbeat.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
})
export class AppComponent {
  constructor(
    private heartbeatService: HeartbeatService,
    public serverService: ServerService,
    private messageService: MessageService
  ) {}

  myError = null;
  ngOnInit() {
    console.log('******** AppComponent ********');
    this.heartbeatService.getStatus();
    this.heartbeatService.startStatusTimer();
    console.log('error 1 [' + this.myError + ']');
    this.myError = this.serverService.httpError;
    console.log('error 2 [' + this.myError + ']');
  }
}
