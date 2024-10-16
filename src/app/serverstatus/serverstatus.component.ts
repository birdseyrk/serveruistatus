import { Component } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { DatePipe } from '@angular/common';

//import { Subscription } from 'rxjs-compat/Subscription';

import {MenuItem} from 'primeng/api';
import {MessageService} from 'primeng/api';

import { ServerService } from '../../services/servers.Service';
import { Server } from '../../modules/server.module';

import { interval, Subscription, take } from 'rxjs';  // throws something every second or what you define

@Component ({
  selector: 'app-serverstatus',
  templateUrl: './serverstatus.component.html',
  styleUrls: ['./serverstatus.component.css'],
  providers: [MessageService]
})

export class ServerStatusComponent {
  // private numbers = interval(60000); //one minute
  // private takeFourNumbers = this.numbers.pipe();

  paramsSubscription: Subscription;
  //datePipe: DatePipe;
  datePipe = new DatePipe('en-US');
  hostname:string ="";
  server:Server;

  hoststatus:any  =  {};
  groupstatus:any =  [];  
  groups:any[] = [];
  group:any = {};
  groupHost:any = {};
  hosts:any[] = [];
  status:any = [];
  menuItems: MenuItem[] = [];

  showCPUInfo:boolean = false;
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
    
    this.serverService.getHostStatus();

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
    console.log("--- setHostUp --- " + host.hostname);
    console.log(host);
    const myEpochDate = new Date();

    const currentEpoch = (myEpochDate.valueOf() / 1000);
    host.epoch = (Number(Number(currentEpoch)).toFixed(3));

    let myLastUpdate = new Date();
      
    this.datePipe = new DatePipe('en-US');

    this.messageService.add({severity:'info', summary:  host.hostname, detail: 'Setting Host - ' + host.hostname + ' to Up'});

    //host.lastUpdate = this.datePipe.transform(myLastUpdate,"yyyy-MM-dd hh:mm:ss");

  }

  setHostDown(host:Server) {
    console.log("--- setHostDown --- " + host.hostname);
    host.epoch = "1728597022";
    this.messageService.add({severity:'info', summary:  host.hostname, detail: 'Setting Host - ' + host.hostname + ' to down'});
  }

  deleteHost(group:any, hostname:string) {
    console.log("--- deleteHost --- " + hostname);
    this.serverService.deleteHost(group, hostname);
    this.messageService.add({severity:'success', summary: 'Success', detail: 'Deleted Host - ' + hostname});
  }

  cpuInfo() {
    this.showCPUInfo = true;
    this.displaySideCarHeader = "CPU Information"
    this.displaySideCarInfo =  this.serverService.groupHost.cpuinfo;
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

  // getHostandGroups(data:any, hosts:any): any {
  //   console.log("--- serverstatus.components.getHostandGroups ---");
  //   console.log(data);
  //   let tempGroups:string[] = [];
  //   this.groups = [];
  //   let group:any = {};
  //   let myMenuItem:any = {"label":"", items:[]};
  //   this.menuItems = [];
    

  //   for (let host = 0; host < hosts.length; host++) {

  //     for (let i = 0; i < data[host].groups.length; i++) {
  //       myMenuItem = {"label":"", items:[]};
  //       group = {};
  //       if ( !tempGroups.includes(data[host].groups[i]) ) {
  //         tempGroups.push(data[host].groups[i]);
  //         group.name = data[host].groups[i];
  //         group.status = "red"
  //         this.groups.push(JSON.parse('{"name":"' + data[host].groups[i] + '", "status":"red"}'));
  //         myMenuItem.label = data[host].groups[i];
  //         this.menuItems.push(myMenuItem);
  //       }

  //     }
  //   }

  //   for (let mygroup = 0; mygroup < this.menuItems.length; mygroup++) {
      
  //     let myCommands = [];
  //     let workingGroup:string = "";

  //     for (let host = 0; host < hosts.length; host++) {
  //       console.log("status " +data[host].status);
        
  //       let myItem:any = {"label":"", "command":"", "icon": "", "styleClass": "red-icon"};

  //       let myCommand:any = {};

  //       for (let i = 0; i < data[host].groups.length; i++) {

  //         if (data[host].groups[i] == this.menuItems[mygroup].label) {

  //           workingGroup = data[host].groups[i];

  //           myItem.label = data[host].hostname;
  //           myItem.icon = data[host].icon;
  //           myCommand = () => this.displayServer(myItem.label);
  //           myItem.command = myCommand;
  //           myCommands.push(myItem);

  //         }
  //       }
  //     }

  //     if (workingGroup == this.menuItems[mygroup].label) {
  //       this.menuItems[mygroup].items = myCommands;
  //     }

  //   }

  //   //TODO sort groups
  //   console.log("--- this.menuItems ---");
  //   console.log(this.menuItems);

  //   return this.groups;

  // }

  // getStatus() {
  //   console.log('--- server status getStatus ---');
  //   this.hoststatus = this.serverService.getAllStatus();
    
  //   if (this.hoststatus.length > 0) {
  //     this.dataReady= true;
  //   } else {
  //     this.dataReady= false;
  //   }

  //   this.hosts = this.serverService.getHosts();
  //   this.hosts = this.hosts.sort();

  //   this.getHostandGroups(this.hoststatus, this.hosts);

  //   this.groupstatus = this.getGroupStatus();
  //   //this.groupstatus = this.serverService.groups;
  //   console.log("--- this.groupstatus ---");
  //   console.log(this.groupstatus);
  // }

  // getGroupStatus() {
  //   console.log('--- server status getGroupStatus ---');
  //   return this.serverService.getGroupStatus();
  // }

  // getHosts() {
  //   console.log(this.serverService.getHosts());
  // }

  // getServerList(group:string):any[] {
  //   let myList:string[] = [];

  //   return myList;
  // }

  // showGroups(group:string) {
  //   console.log("showGroups " + group);
  // }

  // displayServer(group:string) {
  //   console.log("displayServer " + group);
  // }

  // roleUpHostStatus(myGroup:any) {
  //   console.log('--- serverService roleUpHostStatus ---');

  //   let myStatus:string = "green";

  //   for (let i = 0; i < myGroup.hosts.length; i++) {
  //     console.log ( myGroup.hosts[i]);
  //     if (myGroup.hosts[i].status === "yellow") {
  //       myStatus = myGroup.hosts[i].status;
  //     } else if (myGroup.hosts[i].status === "red") {
  //       myStatus = myGroup.hosts[i].status;
  //       return myGroup.hosts[i].status;
  //     }
  //   }

  //   return myStatus;
  // }

}
