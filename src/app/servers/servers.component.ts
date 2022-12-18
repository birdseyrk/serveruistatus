import { Component, OnInit, OnDestroy } from '@angular/core';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router, ActivatedRoute } from '@angular/router';
import { SortEvent } from 'primeng/api';

import { Observable, throwError } from 'rxjs';
import { interval, Subscription, take } from 'rxjs';  // throws something every second or whatyou define
import { map } from 'rxjs/operators';

import { catchError, retry } from 'rxjs/operators';

import { ServerService } from './servers.Service';
import { Server } from './server.module';

@Component({
  selector: 'app-servers',
  templateUrl: './servers.component.html',
  styleUrls: ['./servers.component.css']
})

export class ServersComponent implements OnInit {

  cols: any[];
  servers: Server[]; 
  hosts: string[]; 
  myServers: any[]; 
  //lastStatusUpdate: string = "No Update";

  selectedServer: Server;

  httpClient: HttpClient;

  private numbers = interval(60000); //one minute
  //private takeFourNumbers = this.numbers.pipe(take(4)); // only emits four numbers, if you leave off it will keep going
  private takeFourNumbers = this.numbers.pipe();
  
  constructor( 
    private http: HttpClient, 
    private router: Router,
    public serverService: ServerService) { }

  ngOnInit() {

    this.cols = [
        { field: 'hostName', header: 'Host Name' },
        { field: 'suite', header: 'Suite' },
        { field: 'icon', header: 'Icon' },
        { field: 'epoch', header: 'Epoch' },
        { field: 'lastUpdate', header: 'Last Update' },
        { field: 'uptime', header: 'Up Time (hrs)' },
        { field: 'status', header: 'Status' }
    ];

    this.hosts = [];
    this.servers = [];
    this.getStatus();
    //this.lastStatusUpdate = this.serverService.getLastStatusUpdate();
    
    // this.takeFourNumbers.subscribe(x => {
    //   console.log('********** ServersComponent Get Status: ********** ', x);
    //   this.getStatus();
    // });

  }

  //Called when leaving the page
  ngOnDestroy() {
    //this.numbers.unsubscribe(); need to figure this out
  }

  onRowSelect(event) {
    console.log(this.selectedServer);
    this.router.navigate(['/server', this.selectedServer.hostName]);
  }

  onCreatePost(postData: { title: string; content: string }) {
    console.log("---------- serversComponent onCreatePost ----------");
  }

  getStatus() {
    
    console.log("---------- serversComponent getStatus ----------");
    
    //console.log(this.hosts);
    this.hosts = this.serverService.getHosts();
    //console.log(this.serverService.getServers());
    this.servers = this.serverService.getServers();
    this.serverService.checkStatus();
    //this.lastStatusUpdate = this.serverService.getLastStatusUpdate();
    //this.lastStatusUpdate = this.serverService.lastStatusUpdate;

  }

  deleteStatus() {
    console.log("--------- serversComponent deleteStatus ---------");
    this.serverService.clearServers();
  }

  setStatus() {
    console.log("--------- serversComponent setStatus ---------");
    this.serverService.setServersStatus("purple");
  }

  mySort(event: SortEvent) {
    console.log("--------- serversComponent mySort ---------");
    console.log(event);
  }
  customSort(event: SortEvent) {
    console.log("--------- serversComponent customSort ---------");
    event.data.sort((data1, data2) => {
        
        let value1 = this.servers[data1][event.field];
        let value2 = this.servers[data2][event.field];
        let result = null;

        if (value1 == null && value2 != null)
            result = -1;
        else if (value1 != null && value2 == null)
            result = 1;
        else if (value1 == null && value2 == null)
            result = 0;
        else if (typeof value1 === 'string' && typeof value2 === 'string')
            result = value1.localeCompare(value2);
        else
            result = (value1 < value2) ? -1 : (value1 > value2) ? 1 : 0;

        return (event.order * result);
    });
  }
}
