import { Injectable, Component, OnInit, OnDestroy } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { DatePipe } from '@angular/common';

import { interval, Subscription, take } from 'rxjs';  // throws something every second or what you define
//import { ServerStatusComponent } from "../app/serverstatus/serverstatus.component";
import { Server } from "../modules/server.module";
import { ServerService } from '../services/server.service';


@Injectable({
  providedIn: 'root'
})

export class HeartbeatService {    
  
  private baseHostIP:   string = "192.168.1.100"; //"my.serverstatus.com/"; //"nginx.ingress.192.168.1.100.nip.io"; //"serverstatus-service.default"; //"mynginx.192.168.1.100.nip.io"; //"192.168.1.100";
  private basePort:     string = "30850";//"8085"; //"30850";  
  private baseUrl:      string = "http://"+ this.baseHostIP +":" + this.basePort +"/" ;
    
  private uptimeUrl:    string = this.baseUrl + "uptime";
  private hostStatusUrl:     string = this.baseUrl + "newhostStatus";

  private numbers = interval(60000); //one minute
  private takeFourNumbers = this.numbers.pipe();

  constructor(
    private http: HttpClient,
    public serverService: ServerService
   // public serverStatusComponent: ServerStatusComponent
) {
  }

  ngOnInit() {
  }

  startStatusTimer() {
      
      // console.log("--------- ServerService startStatusTimer ---------");
      this.takeFourNumbers.subscribe(x => {
          this.getStatus();
          //this.getHostStatus();
      });

  } 

  getStatus() { // combine this and the gethost status
    console.log("--- heartbeat getStatus ---");

    // Send Http request
    const pad = (i) => (i < 10) ? "0" + i : "" + i;
    const myDate = new Date();
    
    this.serverService.lastStatusUpdate =  myDate.getFullYear() + "-" + pad(myDate.getMonth() + 1) + "-" + pad(myDate.getDate()) + ":" + pad(myDate.getHours()) + ":" + pad(myDate.getMinutes()) + ":" + pad(myDate.getSeconds());
    console.log("ServerService - getStatus "  + this.uptimeUrl + " " + this.serverService.lastStatusUpdate);
    
    //console.log("--------- ServerService getStatus --------- " + this.uptimeUrl + " " + myDate.getFullYear() + "-" + pad(myDate.getMonth() + 1) + "-" + pad(myDate.getDate()) + ":" + pad(myDate.getHours()) + ":" + pad(myDate.getMinutes()) + ":" + pad(myDate.getSeconds()));
   
    console.log("*** TODO Remove return ***");
    
    this.serverService.checkStatus(); // #####   remove this ####

    return;   // #####   remove this ####

    this.serverService.hosts = []; //TODO we do not want to set this to blank and we do not want to add the same host twice.
    this.http
      .get(this.uptimeUrl)
      .pipe(
        map(responseData => {
          const postsArray = [];
          for (const key in responseData) {
            if (responseData.hasOwnProperty(key)) {
              postsArray.push({ ...responseData[key], id: key });
            }
          }
          // console.log("--------- ServerService getStatus postsArray --------- [" + postsArray +"]");
          return postsArray;
        })
      )
      .subscribe(serverData => {
        
        // console.log("--------- ServerService loadServers serverData ---------");
        // console.log(serverData);

        let myIcon:string = "";

        for (const host in serverData) {
              // console.log(this.hosts);
              // console.log("serverData[host].hostname ["+ serverData[host].hostname + "] epoch [" + serverData[host].hostname + "]");
              
              //TODO remove this
              if ((serverData[host].hostname === 'creede') || (serverData[host].hostname === 'creede02') || (serverData[host].hostname === 'creede03')) {
                serverData[host].type = "Server";
                myIcon = "pi pi-server";
              } else if (serverData[host].hostname === 'ansible-master') {
                serverData[host].type = "Cloud"
                myIcon = "pi pi-cloud";
              } else if (serverData[host].hostname.substring(0,11) === 'ubuntu-node') {
                serverData[host].type = "Cloud"
                myIcon = "pi pi-cloud";
              } else if (serverData[host].hostname.substring(0,3) === '172') {
                serverData[host].type = "Cloud"
                myIcon = "pi pi-cloud";
              } else {
                serverData[host].type = "Laptop"
                myIcon = "pi pi-briefcase";
              }

          if ( this.serverService.hosts.includes(serverData[host].hostname) ) {
              // this.loadedServers[serverData[host].hostname].hostname = serverData[host].hostname;
              // this.loadedServers[serverData[host].hostname].epoch = serverData[host].epoch;
              // this.loadedServers[serverData[host].hostname].lastUpdate = serverData[host].lastupdate;
              // this.loadedServers[serverData[host].hostname].uptime = (Number(Number(serverData[host].uptime)/3600)).toFixed(3);
          
          } else {
             // const myServer = new Server(serverData[host].hostname, serverData[host].type, "pi pi-server", serverData[host].epoch, serverData[host].lastupdate, (Number(Number(serverData[host].uptime)/3600)).toFixed(3), "red");
              const myServer = new Server(
                /*checksun*/        "",
                /*cpuinfo*/         [],
                /*disks*/           [],
                /*epoch*/           "",
                /*groups*/          [],
                /*hostname*/        serverData[host].hostname,
                /*icon*/            myIcon,
                /*lastUpdate*/      serverData[host].lastupdate,
                /*local*/           "",
                /*logavail*/        "",
                /*logpercent*/      "",
                /*logtotal*/        "",
                /*logused*/         "",
                /*memory*/          {},
                /*nodemanagers*/    [],
                /*opsavail*/        "",
                /*opspercent*/      "",
                /*opstotal*/        "",
                /*opsused*/         "",
                /*os*/              "",
                /*osversion*/       "",
                /*processinfo*/     [],
                /*status*/          "red",
                /*subagent*/        [],
                /*tmpavail*/        "",
                /*tmppercent*/      "",
                /*tmptotal*/        "",
                /*tmpused*/         "",
                /*type*/            serverData[host].type,
                /*uptime*/          (Number(Number(serverData[host].uptime)/3600)).toFixed(3)
              );
              
              
              
              // if (serverData[host].type === "Cloud")  {
              //   // console.log("In Cloud " + serverData[host].hostname);
              //   myServer.setIcon("pi pi-cloud");
              // } else if (serverData[host].type === "Laptop") {
              //   // console.log("In else - Laptop " + serverData[host].hostname);
              //   myServer.setIcon("pi pi-briefcase");
              // } else {
              //   // console.log("In else - Server " + serverData[host].hostname);
              //   myServer.setIcon("pi pi-server");
              // }
              
              // this.loadedServers[serverData[host].hostname] = myServer;
              this.serverService.hosts.push(serverData[host].hostname);
          }

          // this.addServer(this.loadedServers[serverData[host].hostname]);
        }
        this.serverService.hosts = this.serverService.hosts.sort();

        this.serverService.checkStatus();
      
        //remove this.setGroupStatus();
      });
  }
  
  getHostStatus() {  // remove this in the index.js return everything on the uptime
    // Send Http request
    const pad = (i) => (i < 10) ? "0" + i : "" + i;
    const myDate = new Date();
    this.serverService.lastStatusUpdate =  myDate.getFullYear() + "-" + pad(myDate.getMonth() + 1) + "-" + pad(myDate.getDate()) + ":" + pad(myDate.getHours()) + ":" + pad(myDate.getMinutes()) + ":" + pad(myDate.getSeconds());
    console.log("ServerService - getHostStatus " + this.hostStatusUrl + " " + this.serverService.lastStatusUpdate);
    console.log("*** TODO Remove return ***");
    return;  // ### remove this

    let postsArray: any[] = [];

    this.serverService.hosts = [];

    this.http
      .get(this.hostStatusUrl)
      .pipe(
        map(responseData => {
            // console.log("--- responseData ---");
            // console.log(responseData); 
            return responseData;
        })
      )
      .subscribe(serverData => {
        // console.log("--------------------- ServerService - getHostStatus serverData ---------------------");
        // console.log(serverData);
       for (const host in serverData) {
        
        if ((serverData[host].hostname === 'creede') || (serverData[host].hostname === 'creede02') || (serverData[host].hostname === 'creede03')) {
          serverData[host].type = "Server"
          serverData[host].icon = "pi pi-server"
          serverData[host].status = "red"
        } else if (serverData[host].hostname === 'ansible-master') {
          serverData[host].type = "Cloud"
          serverData[host].icon = "pi pi-cloud"
          serverData[host].status = "red"
        } else if (serverData[host].hostname.substring(0,11) === 'ubuntu-node') {
          serverData[host].type = "Cloud"
          serverData[host].icon = "pi pi-cloud"
          serverData[host].status = "red"
        } else if (serverData[host].hostname.substring(0,3) === '172') {
          serverData[host].type = "Cloud"
          serverData[host].icon = "pi pi-cloud"
          serverData[host].status = "red"
        } else {
          serverData[host].type = "Laptop"
          serverData[host].icon = "pi pi-briefcase"
          serverData[host].status = "red"
        }

        postsArray.push(serverData[host]);
        this.serverService.hosts.push(serverData[host].hostname);

       }

       this.serverService.status = postsArray;
       //  console.log("---- this.status ----");
       //  console.log(this.status);

       this.serverService.groups = this.serverService.translateToGroups(this.serverService.status);

       for (let group = 0; group < this.serverService.groups.length; group++) {
          this.serverService.rollupGroup(this.serverService.groups[group]);
        }

        //Need to roll up the displayed group
        if (this.serverService.group) {
          this.serverService.rollupGroup(this.serverService.group);
        }
      
        this.serverService.hosts = this.serverService.hosts.sort();
  
        this.serverService.checkStatus();

        //this.serverStatusComponent.setMessage("success", "Host Update", "Heartbeat Active");

      }); 

      // console.log("return postsArray");
      // console.log(postsArray);
      
      return postsArray;
  }

}
