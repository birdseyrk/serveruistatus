import { Component } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { Subscription } from 'rxjs-compat/Subscription';

import {MenuItem} from 'primeng/api';

import { ServerService } from '../servers/servers.Service';
import { Server } from '../servers/server.module';

@Component({
  selector: 'app-serverstatus',
  templateUrl: './serverstatus.component.html',
  styleUrls: ['./serverstatus.component.css']
})
export class ServerStatusComponent {

  paramsSubscription: Subscription;
  hostname:string ="";
  server:Server;

  hoststatus:any =  {};
  groups:any[] = [];
  hosts:any[] = [];
  status:any = [];
  menuItems: MenuItem[] = [];

  dataReady = false;

  //constructor(private router: Router, private authService: AuthService) { }
  
  constructor(
    private route: ActivatedRoute,
    private serverService: ServerService
  ) { }
  //constructor() { }

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
    this.hosts = this.serverService.getHosts();
    // console.log('serverstatus.component - this.hosts');
    // console.log(this.hosts);
    this.hoststatus = this.serverService.getAllStatus();
    if (this.hoststatus.length > 0) {
      this.dataReady= true;
    } else {
      this.dataReady= false;
    }
  }

  onLoadServer(id: number) {
    
  }

  onLogin() {
    //this.authService.login();
  }

  onLogout() {
    //this.authService.logout();
  }

  getHostandGroups(data:any, hosts:any): any {
    console.log("--- serverstatus.components.getHostandGroups ---");
    console.log(data);
    let tempGroups:string[] = [];
    this.groups = [];
    let group:any = {};
    let myMenuItem:any = {"label":"", items:[]};
    this.menuItems = [];
    

    for (let host = 0; host < hosts.length; host++) {

      for (let i = 0; i < data[host].groups.length; i++) {
        myMenuItem = {"label":"", items:[]};
        group = {};
        if ( !tempGroups.includes(data[host].groups[i]) ) {
          tempGroups.push(data[host].groups[i]);
          group.name = data[host].groups[i];
          group.status = "red"
          this.groups.push(JSON.parse('{"name":"' + data[host].groups[i] + '", "status":"red"}'));
          myMenuItem.label = data[host].groups[i];
          this.menuItems.push(myMenuItem);
        }

      }
    }

    for (let mygroup = 0; mygroup < this.menuItems.length; mygroup++) {
      
      let myCommands = [];
      let workingGroup:string = "";

      for (let host = 0; host < hosts.length; host++) {
        console.log("status " +data[host].status);
        
        let myItem:any = {"label":"", "command":"", "icon": "", "styleClass": "red-icon"};

        let myCommand:any = {};

        for (let i = 0; i < data[host].groups.length; i++) {

          if (data[host].groups[i] == this.menuItems[mygroup].label) {

            workingGroup = data[host].groups[i];

            myItem.label = data[host].hostname;
            myItem.icon = data[host].icon;
            myCommand = () => this.displayServer(myItem.label);
            myItem.command = myCommand;
            myCommands.push(myItem);

          }
        }
      }

      if (workingGroup == this.menuItems[mygroup].label) {
        this.menuItems[mygroup].items = myCommands;
      }

    }

    //TODO sort groups
    console.log("--- this.menuItems ---");
    console.log(this.menuItems);

    return this.groups;

  }

  getStatus() {
    console.log('--- server status getStatus ---');
    this.hoststatus = this.serverService.getAllStatus();
    
    if (this.hoststatus.length > 0) {
      this.dataReady= true;
    } else {
      this.dataReady= false;
    }

    this.hosts = this.serverService.getHosts();
    this.hosts = this.hosts.sort();

    this.getHostandGroups(this.hoststatus, this.hosts);
  }

  getHosts() {
    console.log(this.serverService.getHosts());
  }

  getServerList(group:string):any[] {
    let myList:string[] = [];

    return myList;
  }

  showGroups(group:string) {
    console.log("showGroups " + group);


  }

  displayServer(group:string) {
    console.log("displayServer " + group);


  }

}
