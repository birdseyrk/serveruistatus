import { Component, OnInit, OnDestroy } from '@angular/core';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router, ActivatedRoute } from '@angular/router';
import { SortEvent } from 'primeng/api';

import { Observable, throwError } from 'rxjs';
import { interval, Subscription, take } from 'rxjs';  // throws something every second or whatyou define
import { map } from 'rxjs/operators';

import { catchError, retry } from 'rxjs/operators';

import { ServerService } from '../../services/servers.Service';
import { TestserviceService } from '../../tests/testservice.Service';
import { Server } from '../../modules/server.module';

@Component({
  selector: 'app-servers',
  templateUrl: './servers.component.html',
  styleUrls: ['./servers.component.css']
})

export class ServersComponent implements OnInit {

  cols: any[];
  servers: Server[];
  groups: any[]; 
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
    public serverService: ServerService,
    public testserviceService: TestserviceService
  ) { }

  ngOnInit() {

    this.cols = [
        { field: 'hostName', header: 'Host Name' },
        { field: 'type', header: 'type' },
        { field: 'icon', header: 'Icon' },
        { field: 'epoch', header: 'Epoch' },
        { field: 'lastUpdate', header: 'Last Update' },
        { field: 'uptime', header: 'Up Time (hrs)' },
        { field: 'status', header: 'Status' }
    ];

    this.hosts = [];
    this.groups = [];
    //this.servers = [];
    this.getStatus();
    //this.lastStatusUpdate = this.serverService.getLastStatusUpdate();
    
    // this.takeFourNumbers.subscribe(x => {
    // console.log('********** ServersComponent Get Status: ********** ', x);
    //   this.getStatus();
    // });

  }

  //Called when leaving the page
  ngOnDestroy() {
    //this.numbers.unsubscribe(); need to figure this out
  }

  onRowSelect(event) {
    console.log(this.selectedServer);
    this.router.navigate(['/server', this.selectedServer.hostname]);
  }

  onCreatePost(postData: { title: string; content: string }) {
    console.log("---------- serversComponent onCreatePost ----------");
  }

  getStatus() {
    
    console.log("---------- serversComponent getStatus ----------");
    
    //console.log(this.hosts);
    this.hosts = this.serverService.getHosts();
    // console.log(this.serverService.getServers());
    this.servers = this.serverService.getServers();
    this.groups = this.serverService.getGroupStatus();
    // console.log(this.groups);
    this.serverService.checkStatus();
    //this.lastStatusUpdate = this.serverService.getLastStatusUpdate();
    //this.lastStatusUpdate = this.serverService.lastStatusUpdate;

  }

  deleteStatus() {
    console.log("--------- serversComponent deleteStatus ---------");
    this.serverService.clearServers();
  }

  setTestStatus() {
    console.log("--------- serversComponent setTestStatus ---------");
    this.testserviceService.setTestServersStatus("purple");
    //this.groups = this.serverService.getGroupStatus();
    this.groups = [];
  }

  set100Hosts() {
    console.log("--------- serversComponent set100Hosts ---------");
    this.testserviceService.setTest100ServersStatus("purple");
  }

  setHostStatus(host:string) {
    // console.log('---- setHostStatus ----');
    // console.log(host);
    //console.log(this.servers);
    this.testserviceService.setTestHostStatus(host);

  }

  mySort(event: SortEvent) {
    console.log("--------- serversComponent mySort ---------");
    console.log(event);
  }

  customSort(event: SortEvent) {
    // console.log("--------- serversComponent customSort ---------");
    //arrayOfObjects.sort((a, b) => (a.propertyToSortBy < b.propertyToSortBy ? -1 : 1));
    // console.log(event.field);

    event.data.sort((data1, data2) => {
      
    let value1:any = "";
    let value2:any = ""; 
        
      switch(event.field) { 
        case "hostname": { 
          value1 = data1.hostname;
          value2 = data2.hostname; 
           break; 
        } 
        case "icon": { 
          value1 = data1.icon;
          value2 = data2.icon; 
           break; 
        } 
        case "uptime": { 
          value1 = data1.uptime;
          value2 = data2.uptime; 
           break; 
        } 
        case "type": { 
          value1 = data1.type;
          value2 = data2.type; 
           break; 
        } 
        case "lastUpdate": {
        value1 = data1.lastUpdate;
        value2 = data2.lastUpdate; 
           break; 
        } 
        case "epoch": { 
          value1 = data1.epoch;
          value2 = data2.epoch; 
           break; 
        } 
        default: { 
          value1 = data1.hostname;
          value2 = data2.hostname; 
           break; 
        } 
     } 
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
