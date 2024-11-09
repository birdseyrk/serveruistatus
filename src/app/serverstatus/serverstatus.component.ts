import { Component } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { DatePipe } from '@angular/common';

import { MenuItem } from 'primeng/api';
import { MessageService } from 'primeng/api';

import { ServerService } from '../../services/server.service';
import { Server } from '../../modules/server.module';

import { interval, Subscription, take } from 'rxjs'; // throws something every second or what you define

@Component({
  selector: 'app-serverstatus',
  templateUrl: './serverstatus.component.html',
  styleUrl: './serverstatus.component.css',
})
export class ServerstatusComponent {
  paramsSubscription: Subscription = new Subscription();

  datePipe = new DatePipe('en-US');
  hostname: string = '';
  server: Server = new Server();

  hoststatus: any = {};
  groupstatus: any = [];
  groups: any[] = [];
  group: any = {};
  groupHost: any = {};
  hosts: any[] = [];
  status: any = [];
  menuItems: MenuItem[] = [];

  showProcessInfo: boolean = false;
  displayProcessesInfo: any[] = [];
  displayProcessesHeader: string = '';

  showCPUInfo: boolean = false;
  displayCPUHeader: string = '';
  displayCPUInfo: any[] = [];

  dataReady = false;

  constructor(
    private route: ActivatedRoute,
    public serverService: ServerService,
    private messageService: MessageService
  ) /*,TODO what is this private primengConfig: PrimeNGConfig*/
  {}

  ngOnInit() {
    //TODO not sure this is needed
    console.log('serverstatus.component - ngOnInit');

    this.hostname = this.route.snapshot.params['server'];
    this.paramsSubscription = this.route.params.subscribe((params: Params) => {
      this.hostname = this.route.snapshot.params['server'];
    });
  }

  onLoadServer(id: number) {}

  closeGroups() {
    this.serverService.group = [];
    this.serverService.groupHost = {};
  }

  closeHost() {
    this.serverService.groupHost = {};
  }

  setHostUp(host: Server) {
    // console.log("--- setHostUp --- " + host.hostname);
    // console.log(host);
    const myEpochDate = new Date();

    //const currentEpoch = (myEpochDate.valueOf() / 1000);
    const currentEpoch = myEpochDate.valueOf() + 10000;
    host.epoch = Number(Number(currentEpoch)).toFixed(3);
    host.status = 'green';
    host.lastUpdate = this.serverService.getStatusDate(host.epoch);

    this.serverService.rollupGroup(this.serverService.group);

    this.datePipe = new DatePipe('en-US');

    this.messageService.add({
      severity: 'success',
      summary: host.hostname,
      detail: 'Setting Host - ' + host.hostname + ' to Up',
    });
  }

  setHostDown(host: Server) {
    // console.log("--- setHostDown --- " + host.hostname);
    host.epoch = '1728597022';
    host.status = 'red';
    host.lastUpdate = this.serverService.getStatusDate(host.epoch);
    this.serverService.rollupGroup(this.serverService.group);

    this.messageService.add({
      severity: 'error',
      summary: host.hostname,
      detail: 'Setting Host - ' + host.hostname + ' to down',
    });
  }

  deleteHost(group: any, hostname: string) {
    console.log('--- deleteHost --- ' + hostname);
    this.serverService.deleteHost(group, hostname);
    this.serverService.rollupGroup(this.serverService.group);

    this.messageService.add({
      severity: 'info',
      summary: 'Delete Host',
      detail: 'Deleted Host - ' + hostname,
    });
  }

  // translateCPU(data:any): string[] {

  //   let myString:string[] = [];

  //   for (let i = 0; i < data.length; i++) {
  //     if (data[i].substring(0,9) === "processor") {
  //       myString.push("---------------------------------------------------------------------");
  //     }
  //     myString.push(data[i]); 
  //     //console.log(data[i].split(":"))
  //   }
  //   return myString;
  // }

  translateCPU(data:any): string[] {

    let myObjects:any[] = [];

    for (let i = 0; i < data.length; i++) {
      let mySplit:string[] = data[i].split(":");
      let myObject = {"key":mySplit[0], "value":mySplit[1],"color":"", "font":"", "height":"", "align":"align-items-center"};
      
      if (data[i].substring(0,9) === "processor") {
        myObject.color = "bg-blue-300";
        myObject.font  = "font-semibold";
        myObject.height  = "h-2rem";
        myObject.align  = "align-items-center justify-content-center";
      }
      //console.log(myObject);
      myObjects.push(myObject); 
    }
    return myObjects;
  }

  cpuInfo() {
    console.log('--- cpuInfo ---');
    this.showProcessInfo = false;
    this.showCPUInfo = true;
    this.displayCPUHeader = 'CPU Information';
    //this.displayProcessesInfo =  this.translateCPU(this.serverService.groupHost.cpuinfo);
    this.displayCPUInfo =  this.translateCPU(this.serverService.groupHost.cpuinfo);
    console.log(this.displayProcessesInfo);
  }


  translateProcesses(data:any): string[] {

    let myObjects:any[] = [];

    for (let i = 0; i < data.length; i++) {
      let myObject = {"data":data[i]};
      console.log(myObject);
      myObjects.push(myObject); 
    }
    return myObjects;
  }

  processInfo() {
    console.log('--- processInfo ---');
    this.showCPUInfo = false;
    this.showProcessInfo = true;
    this.displayProcessesHeader = 'Process Information';
    this.displayProcessesInfo = this.translateProcesses(this.serverService.groupHost.processinfo);
    console.log(this.serverService.groupHost.processinfo);
  }

  onLogin() {
    //this.authService.login();
  }

  onLogout() {
    //this.authService.logout();
  }

  public setMessage(serverity: string, summary: string, detail: string) {
    this.messageService.add({
      severity: serverity,
      summary: summary,
      detail: detail,
    });
  }
}
