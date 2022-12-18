import { Component, OnInit } from '@angular/core';
//import { ConsoleReporter } from 'jasmine';

import { Injectable } from '@angular/core';

import { ServerService } from './servers/servers.Service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  constructor(
    private serverService: ServerService
    ) { }

  ngOnInit() {
    console.log('******** AppComponent ********');
    this.serverService.getStatus();
    this.serverService.setLastStatusUpdate();
    this.serverService.startStatusTimer();
  }
}
