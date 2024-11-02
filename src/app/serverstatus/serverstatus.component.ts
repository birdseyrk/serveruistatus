import { Component } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { DatePipe } from '@angular/common';

import {MenuItem} from 'primeng/api';
import {MessageService} from 'primeng/api';

import { ServerService } from '../services/server.service';
import { Server } from '../modules/server.module';

import { interval, Subscription, take } from 'rxjs';  // throws something every second or what you define


@Component({
  selector: 'app-serverstatus',
  templateUrl: './serverstatus.component.html',
  styleUrl: './serverstatus.component.css'
})
export class ServerstatusComponent {
  

  paramsSubscription: Subscription = new Subscription();
  
  //datePipe: DatePipe;
  datePipe = new DatePipe('en-US');
  hostname:string ="";
  server:Server = new Server();

  
  // server:Server = new Server(
  //   /*checksun*/       "",
  //   /*cpuinfo*/        [],
  //   /*disks*/          [],
  //   /*epoch*/          "",
  //   /*groups*/         [],
  //   /*hostname*/       "",
  //   /*icon*/           "pi pi-server",
  //   /*lastUpdate*/     "",
  //   /*local*/          "",
  //   /*logavail*/       "",
  //   /*logpercent*/     "",
  //   /*logtotal*/       "",
  //   /*logused*/        "",
  //   /*memory*/         {},
  //   /*nodemanagers*/   [],
  //   /*opsavail*/       "",
  //   /*opspercent*/     "",
  //   /*opstotal*/       "",
  //   /*opsused*/        "",
  //   /*os*/             "",
  //   /*osversion*/      "",
  //   /*processinfo*/    [],
  //   /*status*/         "red",
  //   /*subagent*/       [],
  //   /*tmpavail*/       "",
  //   /*tmppercent*/     "",
  //   /*tmptotal*/       "",
  //   /*tmpused*/        "",
  //   /*type*/           "",
  //   /*uptime*/         ""
  // );

  hoststatus:any  =  {};
  groupstatus:any =  [];  
  groups:any[] = [];
  group:any = {};
  groupHost:any = {};
  hosts:any[] = [];
  status:any = [];
  menuItems: MenuItem[] = [];

  showInfo:boolean = false;
  displaySideCarInfo:string = "";
  displaySideCarHeader:string = "";

  dataReady = false;
  
  constructor(
    private route: ActivatedRoute,
    public serverService: ServerService,
    private messageService: MessageService
     /*,TODO what is this private primengConfig: PrimeNGConfig*/
  ) { }

  ngOnInit() {
    //TODO not sure this is needed
    console.log('serverstatus.component - ngOnInit');

    this.hostname = this.route.snapshot.params['server']; 
    this.paramsSubscription = this.route.params
      .subscribe(
        (params: Params) => {
          this.hostname = this.route.snapshot.params['server']; 
        }
      );
    
    // not sure this needs to be called, if so use ehartbeat this.serverService.getHostStatus();

    //this.groupstatus = this.serverService.getGroupStatus();

    // this.hosts = this.serverService.getHosts();
    // this.hoststatus = this.serverService.getAllStatus();
    // if (this.hoststatus.length > 0) {
    //   this.dataReady= true;
    // } else {
    //   this.dataReady= false;
    // }
  }

  onLoadServer(id: number) {
    
  }

  closeGroups() {
    this.serverService.group = [];
    this.serverService.groupHost = {};
  }

  closeHost() {
    this.serverService.groupHost = {}
  }

  setHostUp(host:Server) {
    // console.log("--- setHostUp --- " + host.hostname);
    // console.log(host);
    const myEpochDate = new Date();

    //const currentEpoch = (myEpochDate.valueOf() / 1000);
    const currentEpoch = (myEpochDate.valueOf() + 10000 );
    host.epoch = (Number(Number(currentEpoch)).toFixed(3));
    host.status="green";
    host.lastUpdate   = this.serverService.getStatusDate(host.epoch);

    this.serverService.rollupGroup(this.serverService.group);
      
    this.datePipe = new DatePipe('en-US');

    this.messageService.add({severity:'info', summary:  host.hostname, detail: 'Setting Host - ' + host.hostname + ' to Up'});

  }

  setHostDown(host:Server) {
    // console.log("--- setHostDown --- " + host.hostname);
    host.epoch = "1728597022";
    host.status="red";
    host.lastUpdate   = this.serverService.getStatusDate(host.epoch);
    this.serverService.rollupGroup(this.serverService.group);

    this.messageService.add({severity:'info', summary:  host.hostname, detail: 'Setting Host - ' + host.hostname + ' to down'});
  }

  deleteHost(group:any, hostname:string) {
    console.log("--- deleteHost --- " + hostname);
    this.serverService.deleteHost(group, hostname);
    this.messageService.add({severity:'success', summary: 'Success', detail: 'Deleted Host - ' + hostname});
  }

  cpuInfo() {
    console.log("--- cpuInfo ---");
    this.showInfo = true;
    this.displaySideCarHeader = "CPU Information"
    this.displaySideCarInfo =  this.serverService.groupHost.cpuinfo;
  }

  processInfo() {
    console.log("--- processInfo ---");
    this.showInfo = true;
    this.displaySideCarHeader = "Process Information"
    this.displaySideCarInfo =  this.serverService.groupHost.processinfo;
  }

  onLogin() {
    //this.authService.login();
  }

  onLogout() {
    //this.authService.logout();
  }

  public setMessage(serverity:string, summary:string, detail:string) {
    
    this.messageService.add({severity:serverity, summary:summary, detail:detail});
  }

}
