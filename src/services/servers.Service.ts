import { Component, OnInit, OnDestroy } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { Server } from "../modules/server.module";
import { DatePipe } from '@angular/common';

import { Injectable } from '@angular/core';
import { interval, Subscription, take } from 'rxjs';  // throws something every second or what you define

@Injectable()
export class ServerService {

  
  datePipe = new DatePipe('en-US');

    //TODO Get from somewhere else - more dynamic  This needs to use properties
    private baseHostIP:   string = "192.168.1.100"; //"my.serverstatus.com/"; //"nginx.ingress.192.168.1.100.nip.io"; //"serverstatus-service.default"; //"mynginx.192.168.1.100.nip.io"; //"192.168.1.100";
    private basePort:     string = "30850";//"8085"; //"30850";  
    private baseUrl:      string = "http://"+ this.baseHostIP +":" + this.basePort +"/" ;
    
    private uptimeUrl:    string = this.baseUrl + "uptime";
    private upMemUrl:     string = this.baseUrl + "meminfo";
    private upDiskUrl:    string = this.baseUrl + "diskinfo";
    private upCPUUrl:     string = this.baseUrl + "cpuinfo";
    private upProcessUrl: string = this.baseUrl + "processinfo";
    
    private upOSUrl:     string = this.baseUrl + "os";
    private upGroupUrl:     string = this.baseUrl + "groups";
    private hostStatusUrl:     string = this.baseUrl + "newhostStatus";

    public hosts: string[] = []; 
    public groups: any[] = [];
    public group:any = {};
    public groupHost:any = {};
    private lastGroup:string = "";
    private lastHost:string = "";

    public status: any[] = [];
    public lastStatusUpdate: string = "No Update";

    private numbers = interval(60000); //one minute
    private takeFourNumbers = this.numbers.pipe();
    
    constructor(
        private http: HttpClient
    ) {
        this.hosts   = [];
        this.groups  = [];
        this.status  = [];
        this.lastStatusUpdate = "No Update";
    }

    ngOnInit() {
    }

    startStatusTimer() {
        
        // console.log("--------- ServerService startStatusTimer ---------");
        this.takeFourNumbers.subscribe(x => {
            //this.getStatus();
            //this.getHostStatus();
        });

    }

    getStatus() {
      // Send Http request
      const pad = (i) => (i < 10) ? "0" + i : "" + i;
      const myDate = new Date();
      
      this.lastStatusUpdate =  myDate.getFullYear() + "-" + pad(myDate.getMonth() + 1) + "-" + pad(myDate.getDate()) + ":" + pad(myDate.getHours()) + ":" + pad(myDate.getMinutes()) + ":" + pad(myDate.getSeconds());
      console.log("ServerService - getStatus "  + this.uptimeUrl + " " + this.lastStatusUpdate);
      
      //console.log("--------- ServerService getStatus --------- " + this.uptimeUrl + " " + myDate.getFullYear() + "-" + pad(myDate.getMonth() + 1) + "-" + pad(myDate.getDate()) + ":" + pad(myDate.getHours()) + ":" + pad(myDate.getMinutes()) + ":" + pad(myDate.getSeconds()));
     
      console.log("*** TODO Remove return ***");
      
      this.checkStatus(); // #####   remove this ####

      return;   // #####   remove this ####

      this.hosts = []; //TODO we do not want to set this to blank and we do not want to add the same host twice.
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

            if ( this.hosts.includes(serverData[host].hostname) ) {
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
                this.hosts.push(serverData[host].hostname);
            }

            // this.addServer(this.loadedServers[serverData[host].hostname]);
          }
          this.hosts = this.hosts.sort();

          this.checkStatus();
        
          //remove this.setGroupStatus();
        });
    }

  translateToGroups(data:any[]): any {
    //console.log("====================================  start translateToGroups ====================================");
    let myTempGroups:any = [];
    let myGroups:any = [];
    
    for (let i = 0; i < data.length; i++) {
      for (let group = 0; group < data[i].groups.length; group++) {
        let myGroup:any = {"group":"", "status":"", hosts:[]}
        //console.log( data[i]);
        
          // let myServer = new Server(
          //   /*checksun*/        data[i].checksum,
          //   /*cpuinfo*/         [],
          //   /*disks*/           [],
          //   /*epoch*/           data[i].epoch,
          //   /*groups*/          [],
          //   /*hostname*/        data[i].hostname,
          //   /*icon*/            data[i].icon,
          //   /*lastUpdate*/      data[i].lastUpdate,
          //   /*local*/           data[i].local,
          //   /*logavail*/        data[i].logavail,
          //   /*logpercent*/      data[i].logpercent,
          //   /*logtotal*/        data[i].logtotal,
          //   /*logused*/         data[i].logused,
          //   /*memory*/          data[i].memory,
          //   /*nodemanagers*/    data[i].nodemanagers,
          //   /*opsavail*/        data[i].opsavail,
          //   /*opspercent*/      data[i].opspercent,
          //   /*opstotal*/        data[i].opstotal,
          //   /*opsused*/         data[i].opsused,
          //   /*os*/              data[i].os,
          //   /*osversion*/       data[i].osversion,
          //   /*processinfo*/     [],
          //   /*status*/          data[i].status,
          //   /*subagent*/        data[i].subagent,
          //   /*tmpavail*/        data[i].tmpavail,
          //   /*tmppercent*/      data[i].tmppercent,
          //   /*tmptotal*/        data[i].tmptotal,
          //   /*tmpused*/         data[i].tmpused,
          //   /*type*/            data[i].type,
          //   /*uptime*/          data[i].uptime
          // );

          
          // myServer.disks.push({"name":"OPS", "avail":data[i].opsavail, "used":data[i].opsused, "total":data[i].opstotal, "percent":data[i].opspercent});
          // myServer.disks.push({"name":"LOG", "avail":data[i].logavail, "used":data[i].logused, "total":data[i].logtotal, "percent":data[i].logpercent});
          // myServer.disks.push({"name":"TMP", "avail":data[i].tmpavail, "used":data[i].tmpused, "total":data[i].tmptotal, "percent":data[i].tmppercent});

          data[i].disks = [];
          data[i].disks.push({"name":"OPS", "avail":data[i].opsavail, "used":data[i].opsused, "total":data[i].opstotal, "percent":data[i].opspercent});
          data[i].disks.push({"name":"LOG", "avail":data[i].logavail, "used":data[i].logused, "total":data[i].logtotal, "percent":data[i].logpercent});
          data[i].disks.push({"name":"TMP", "avail":data[i].tmpavail, "used":data[i].tmpused, "total":data[i].tmptotal, "percent":data[i].tmppercent});

        myGroup.group = data[i].groups[group];
        myGroup.status = "";

       // myGroup.hosts.push(myServer);
        myGroup.hosts.push(data[i]);
        myTempGroups.push(myGroup);
      }

    }

    for (let i = 0; i < myTempGroups.length; i++) {

      let index = -1;
      //let myStatus = "";
      if (myGroups.length == 0 ) {
        myTempGroups[i].status = myTempGroups[i].hosts[0].status;
        myGroups.push(myTempGroups[i]);
      } else {
        for (let group = 0; group < myGroups.length; group++) {
          if (myTempGroups[i].group == myGroups[group].group) {
            index = group;
            break;
          }
        }
        if (index == -1 ) {
          myTempGroups[i].status = myTempGroups[i].hosts[0].status;
          myGroups.push(myTempGroups[i]);
        } else {
          if (myTempGroups[i].hosts[0].status == "red" ) {
            myTempGroups[i].status = myTempGroups[i].hosts[0].status;
          } else if (myGroups.status == "green" ) {
            myTempGroups[i].status = myTempGroups[i].hosts[0].status;
          }
          myGroups[index].hosts.push(myTempGroups[i].hosts[0]);
        }
      }
    } 

    this.groups = myGroups;

    for (let group = 0; group < this.groups.length; group++) {
      this.rollupGroup(this.groups[group]);
    }

    // console.log("---------------------- Translated myGroups ----------------------");
    // console.log(myGroups);
    
    // console.log("====================================  end translateToGroups ====================================");
    return myGroups;
  }

    getServers() {
        // console.log("--------- ServerService getServers ---------");
        return this.status;
    }

    getServer(host: string) {
        // console.log("--------- ServerService getServer " + host + "---------");
        for (let host = 0; host < this.status.length; host++) {
          if (this.status[host].hostname === host) { 
            return this.status[host];
          }
        }
        //return this.servers[host];
    }

    getServerStatus(host: string) {
        // console.log("--------- ServerService getServerStatus [" + host + "] ---------");
        for (let host = 0; host < this.status.length; host++) {
          if (this.status[host].hostname === host) { 
            return this.status[host].status;
          }
        }
       // return this.servers[host].status;
    }

    getAllStatus() {
      // console.log("--------- ServerService getAllStatus ---------");
      return this.status;
    }

    getHosts() {
        // console.log("--------- ServerService gethostnames ---------");
       return this.hosts.sort();  
    }

    getLastStatusUpdate() {
        // console.log("--------- ServerService getLastStatusUpdate " + this.lastStatusUpdate + " ---------");
        return this.lastStatusUpdate;
    }

    checkStatus() {
      // console.log("--------- ServerService checkStatus ---------");
      const myDate = new Date();
  
      const currentEpoch = (myDate.valueOf() / 1000);

      for (const host in this.status) {
        // console.log(host);
        // console.log(this.status[host]);
        // console.log("this.status[host].hostname ["+ this.status[host].hostname + "] epoch [" + this.status[host].epoch + "] diff " + (currentEpoch - Number(this.status[host].epoch)) );
        if (currentEpoch - Number(this.status[host].epoch) > 300) { 
          this.status[host].status = "red";
          this.status[host].uptime = "0.000";
          this.rollupGroup(this.group);
        } else {
          this.status[host].status = "green";
          this.rollupGroup(this.group);
        }
      }

      // console.log("--- this.status ---");
      // console.log(this.status);

      this.setGroupStatus();
    }

    rollupGroups(groups:any, group: string, status:string) {  
      
      // console.log("--- rollupGroups ---");
      // console.log(group);
      // console.log(status);
      // console.log(groups);
      
      if (!this.groups) {
        return;
      }
      for (let myGroup = 0; myGroup < groups.length; myGroup++) {
        if (groups[myGroup].group === group) {
          groups[myGroup].status = status;
          break;
        }
      }
    }

    rollupGroup(group:any) {
      // console.log("--- rollupGroup ---");

      group.status = ""
      let oneHostUp = false;
      let oneHostDown = false;
      
      if (!group.hosts) {
        return;
      }

      for (let  host = 0; host < group.hosts.length; host++) {
        // console.log(group.hosts[host].hostname + " is " + group.hosts[host].status);
        if ( group.hosts[host].status === "red") {
          group.status = "red";
          oneHostDown = true;
        } else if (group.hosts[host].status === "green") {
          oneHostUp = true;
        }
      }

      // console.log("oneHostDown " + oneHostDown + " oneHostUp " + oneHostUp);
      if (oneHostDown) {
        if (oneHostUp) {
          // console.log("setting group.status yellow");
          group.status = "yellow";
          this.rollupGroups(this.groups, group.group, group.status);
        } else {
          // console.log("setting group.status red");
          group.status = "red";
          this.rollupGroups(this.groups, group.group, group.status);
        }
      } else if (oneHostUp) {
        // console.log("setting group.status green");
        group.status = "green";
        this.rollupGroups(this.groups, group.group, group.status);
      }
      // console.log(group);
      
    }

    clearServers() {
        // console.log("--------- ServerService clearServers --------- " + this.uptimeUrl);
        
        this.http
        .delete(this.uptimeUrl)
        .pipe(
          map(responseData => {
            const postsArray = [];
            return postsArray;
          })
        )
        .subscribe(deleteStatus => {
          
          // console.log(deleteStatus);
        });
        this.hosts = [];
        //this.servers = [];
        this.groups = [];
        this.status = [];
    }
  
    getHostStatus() {
      // Send Http request
      const pad = (i) => (i < 10) ? "0" + i : "" + i;
      const myDate = new Date();
      this.lastStatusUpdate =  myDate.getFullYear() + "-" + pad(myDate.getMonth() + 1) + "-" + pad(myDate.getDate()) + ":" + pad(myDate.getHours()) + ":" + pad(myDate.getMinutes()) + ":" + pad(myDate.getSeconds());
      console.log("ServerService - getHostStatus " + this.hostStatusUrl + " " + this.lastStatusUpdate);
      console.log("*** TODO Remove return ***");
      return;  // ### remove this
      let postsArray: any[] = [];
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

         }

         this.status = postsArray;
        //  console.log("---- this.status ----");
        //  console.log(this.status);

         this.groups = this.translateToGroups(this.status);

         for (let group = 0; group < this.groups.length; group++) {
            this.rollupGroup(this.groups[group]);
          }

          //Need to roll up the displayed group
          this.rollupGroup(this.group);

        });

        // console.log("return postsArray");
        // console.log(postsArray);
        
        return postsArray;
    }
  
    getMemInfo(host:string) {
      // Send Http request
      // console.log("getMemInfo- Server Component [" + host + "] " + this.upMemUrl);
      
      const postsArray = [];

      if ( (typeof host !== 'undefined') && (host.length > 1)) {
        this.http
          .get(this.upMemUrl+"/"+host)
          .pipe(
            map(responseData => {
                // no change
                return responseData;
            })
          )
          .subscribe(serverData => {
            // console.log("--------------------- getMemInfo serverData ---------------------");
            // console.log('serverData');
            // console.log(serverData);
            postsArray.push(serverData);
            
          });
        }
        
        return postsArray;
    }
  
    getOSInfo(host:string) {
      // Send Http request
      // console.log("getOSInfo- Server Component [" + host + "] " + this.upOSUrl +"/" + host);
      
      const postsArray = [];

      if ( (typeof host !== 'undefined') && (host.length > 1)) {
        this.http
          .get(this.upOSUrl+"/"+host)
          .pipe(
            map(responseData => {
                // no change
                // console.log("--- responseData ---");
                // console.log(responseData);
                return responseData;
            })
          )
          .subscribe(serverData => {
            // console.log("--------------------- getOSInfo serverData ---------------------");
            // console.log(serverData);

            postsArray.push(serverData);
            
          });
        }
        
        return postsArray;
    }
  
    getGroupInfo(host:string) {
      // Send Http request
      // console.log("getGroupInfo- Server Component [" + host + "] " + this.upGroupUrl +"/" + host);
      
      const postsArray = [];

      if ( (typeof host !== 'undefined') && (host.length > 1)) {
        this.http
          .get(this.upGroupUrl +"/"+host)
          .pipe(
            map(responseData => {
                // no change
                // console.log("--- responseData ---");
                // console.log(responseData);
                return responseData;
            })
          )
          .subscribe(serverData => {
            // console.log("--------------------- getGroupInfo serverData ---------------------");
            // console.log(serverData);
            Object.values(serverData).forEach(function (value: string) {
              postsArray.push(value);
            });

            //postsArray.push(serverData);
            
          });
        }
        
        return postsArray;
    }
    
    getDiskInfo(host:string) {
      // Send Http request
      // console.log("getDiskInfo- Server Component [" + host + "] " + this.upDiskUrl +"/" + host);
      
      const postsArray = [];

      if ( (typeof host !== 'undefined') && (host.length > 1)) {
        this.http
          .get(this.upDiskUrl+"/"+host)
          .pipe(
            map(responseData => {
                //Do nothing - pass through
                // console.log(responseData);
                return responseData;
            })
          )
          .subscribe(serverData => {
            postsArray.push(serverData);
          });
        }
        return postsArray;
    }
    
    getCPUInfo(host:string) {
      // Send Http request
      // console.log("getCPUInfo- Server Component [" + host + "] " + this.upCPUUrl);
      
      const postsArray = [];
      var headerData = [];
      var rowData = [];
      var header = true;
      
      if ( (typeof host !== 'undefined') && (host.length > 1)) {
        this.http
          .get(this.upCPUUrl+"/"+host)
          .pipe(
            map(responseData => {
                // No change - pass through
                  return responseData;
            })
          )
          .subscribe(serverData => {
            
            // console.log("--------------------- getCPUInfo serverData ---------------------");
            
            Object.values(serverData).forEach(function (value: string) {

                if (value.length > 0) {
                    
                    var newValue= value.split(":");

                    if (header) {
                        headerData[headerData.length] = newValue[0].toString().trim();
                    }

                    rowData[rowData.length] = newValue[1].toString().trim();
                } else {
                    // if (header) {
                    //     //postsArray.push(headerData);
                    // }
                    rowData[0] = parseInt(rowData[0]); 
                    rowData[2] = parseInt(rowData[2]); 
                    rowData[3] = parseInt(rowData[3]); 
                    rowData[5] = parseInt(rowData[5]); 
                    rowData[7] = parseInt(rowData[7]); 
                    rowData[9] = parseInt(rowData[9]); 
                    rowData[10] = parseInt(rowData[10]); 
                    rowData[12] = parseInt(rowData[12]); 
                    rowData[13] = parseInt(rowData[13]); 
                    rowData[14] = parseInt(rowData[14]); 
                    rowData[17] = parseInt(rowData[17]); 
                    rowData[22] = parseFloat(rowData[22]); 
                    rowData[23] = parseInt(rowData[23]); 
                    rowData[24] = parseInt(rowData[24]); 
                    
                    postsArray.push(rowData);
                    rowData = [];
                    header = false;
                }
            });
          });
        }
        return postsArray;
    }
    
    getProcessInfo(host:string) {
      // Send Http request
      // console.log("getProcessInfo- Server Component [" + host + "] " + this.upProcessUrl);
      
      const postsArray = [];
      
      if ( (typeof host !== 'undefined') && (host.length > 1)) {
        this.http
          .get(this.upProcessUrl+"/"+host)
          .pipe(
            map(responseData => {
              const postsArray = [];
              return responseData;
            })
          )
          .subscribe(serverData => {
            // console.log("--------------------- ServerService getProcessInfo serverData ---------------------");
            
            Object.values(serverData).forEach(function (value: string) {
              postsArray.push(value);
            });
          });
        }
        return postsArray;
    }

    setGroupStatus() {
      // console.log('--- serversService setGroupStatus ---');
      // console.log(this.status);
      this.groups = this.translateToGroups(this.status);
      // console.log(this.groups);

      // console.log("this.lastGroup ["+ this.lastGroup + "]");
      if (this.lastGroup) {
        this.onServer(this.lastGroup);
      }
      
      // console.log("this.lastHost ["+ this.lastHost + "]");
      if (this.lastHost) {  
        this.onHost(this.lastHost);
      }
    }

    getGroupStatus():any {
      // console.log('--- serversService getGroupStatus ---');
      
      this.groups = this.translateToGroups(this.status);

      return this.groups;
    }

    getStatusDate(epoch:any):string {

      console.log("----- getStatusDate -----");
      // console.log(epoch);

      let myDate = new Date(0);
      
      this.datePipe = new DatePipe('en-US');
      myDate.setUTCSeconds(epoch);
      return this.datePipe.transform(myDate,"yyyy-MM-dd hh:mm:ss");
    }

    public deleteHost(group:any, hostname:string) {
      console.log("---  serverService deleteHost --- group " + group.group + " hostname " + hostname);
      
      this.groupHost = {};
      this.lastHost = ""; 

      for (let host = 0; host < group.hosts.length; host++) {
        if (hostname === group.hosts[host].hostname) {
          console.log("--- Deleting group host [" + group.hosts[host].hostname + "]");
          group.hosts.splice(host, 1);
          break;
        }
      }

      for (let host = 0; host < this.status.length; host++) {
        if (hostname === this.status[host].hostname) {
          console.log("--- Deleting status host [" + this.status[host].hostname + "]");
          this.status.splice(host, 1);
          break;
        }
      }

      if (group.hosts.length === 0 ) {
        console.log("--- Deleteing group [ " + group.group + " ]");
        for (let myGroup = 0; myGroup < this.groups.length; myGroup++) {
          if (group.group === this.groups[myGroup].group) {
            console.log("--- Deleting group [" + this.groups[myGroup].group + "]");
            this.group = [];
            this.lastGroup = "";
            this.groups.splice(myGroup, 1);
            break;
          }
        }
      }

    }

    public onServer(myGroup:any) {
      // console.log('--- serversService onServer ---');
      // console.log(myGroup);
      // console.log('--- groups[0] ---');
      // console.log(this.groups[0].group);

      if (!this.groups) {
        return;
      }

      this.groupHost = {};
  
      for (let group = 0; group < this.groups.length; group++) {
        if (this.groups[group].group == myGroup) {
          this.group = this.groups[group];
          break;
        }
      }
      this.lastGroup = myGroup;
      
      // console.log("*** setting lastGroup [" + this.lastGroup + "]");
      // console.log(this.group);
    }
  
    public onHost(myHost:any) {
      console.log('--- serversService onHost ---');
      console.log(myHost);
      // console.log(this.group);

      if (!this.lastGroup) {  
        return;
      }

      for (let thisHost = 0; thisHost < this.group.hosts.length; thisHost++) {  
        console.log(this.group.hosts[thisHost].hostname + " " + myHost);
        if (this.group.hosts[thisHost].hostname == myHost) {
          
          this.groupHost =this.group.hosts[thisHost];
          break;
        }
      }

      if (this.groupHost) {

        this.groupHost.lastUpdate = this.getStatusDate(this.groupHost.epoch);

      }

      // console.log("this.groupHost");
      // console.log(this.groupHost);
      
      this.lastHost = myHost;
      
    }

    logServers() {
        // console.log(this.servers);
    }

    logHosts() {
        // console.log(this.getHosts());
    }


// // ----------------------------------------------   Tests  ----------------------------------------------
    


//     setTestServer(myCPU:[], myEpoch:string, myGroups:[], myhostname:string, myIcon:string, myLastUpdate:string, myStatus:string, myType:string, myUptime:string):Server {
      
//       const myServer = new Server(
//         /*checksun*/       "TODO",
//         /*disks*/          [],
//         /*cpuinfo*/        myCPU,
//         /*epoch*/          myEpoch,
//         /*groups*/         myGroups,
//         /*hostname*/       myhostname,
//         /*icon*/           myIcon,
//         /*lastUpdate*/     myLastUpdate,
//         /*local*/          "None",
//         /*logavail*/       "0 Bytes",
//         /*logpercent*/     "100.00%",
//         /*logtotal*/       "1 Byte",
//         /*logused*/        "1 Byte",
//         /*memory*/         {
//           "nocache": {
//             "free": 24766,
//             "used": 7035
//             },
//             "real": {
//                 "free": 3033,
//                 "total": 31801,
//                 "used": 28768
//             },
//             "swap": {
//                 "cached": 0,
//                 "free": 2047,
//                 "total": 2047,
//                 "used": 0
//             }
//         },
//         /*nodemanagers*/   ["No-NodeManager-running"],
//         /*opsavail*/       "0 Bytes",
//         /*opspercent*/     "100.00%",
//         /*opstotal*/       "1 Byte",
//         /*opsused*/        "1 Byte",
//         /*os*/             "Ubuntu",
//         /*osversion*/      "24.04",
//         /*processinfo*/     [],
//         /*status*/         myStatus,
//         /*subagent*/       ["No-SubAgent-running"],
//         /*tmpavail*/       "0 Bytes",
//         /*tmppercent*/     "100.00%",
//         /*tmptotal*/       "1 Byte",
//         /*tmpused*/        "1 Byte",
//         /*type*/           myType,
//         /*uptime*/         myUptime
//       );

//       return myServer;
//     }

//     setTest100ServersStatus(myStatus: string) {
//       // console.log("--------- ServerService setTestServersStatus ---------");
//       // console.log("Color " + myStatus);
      
//       const myDate = new Date();
      
//       //this.servers = [];
//       //this.hosts = this.hosts;
//       // this.loadedServers =[];

//       //let serverData:Server[] = [];
//       let postsArray:any = this.status;

//       //let myServer:Server = new Server;


//       const currentEpoch = (myDate.valueOf() / 1000 );

//       for (let host = 0; host <100; host++) {
      
//         let myhostname:string   = "ubuntu-grb" + host;
//         let myType:string       = "Cloud";
//         let myGroups:any        = ["cloud-nodes"];
//         let myCPU:any           = [];
//         let myEpoch             = (Number(Number(currentEpoch)).toFixed(3));
//         let myIcon:string       = "pi pi-cloud";
//         let myLastUpdate:string = "2024-10-10:21:50:22";
//         let myUptime:string     = (Number(Number("3279890.20")/3600)).toFixed(3);
  
//         let myServer = this.setTestServer(myCPU, myEpoch, myGroups, myhostname, myIcon, myLastUpdate, myStatus, myType, myUptime);
  
//         // console.log("--------- myServer1  ---------");
//         // console.log(myServer1);
        
//         postsArray.push(myServer);
  
//         this.hosts.push(myhostname);
//       }


//       this.hosts = this.hosts.sort();

//       this.checkStatus();

//       this.status = postsArray;

//       this.groups = this.translateToGroups(this.status);

//        for (let group = 0; group < this.groups.length; group++) {
//           this.rollupGroup(this.groups[group]);
//         }

//         //Need to roll up the displayed group
//         this.rollupGroup(this.group);

//       //this.getHostStatus();

//       this.group = {};
//       this.groupHost = {};


//       console.log("===================================== info start =====================================");
//       console.log("------- hosts ------");
//       console.log(this.hosts);
      
//       // console.log("------- servers ------");
//       // console.log(this.servers);
      
//       // console.log("------- servers host 0------");
//       // console.log(this.servers[this.hosts[0]]);

//       console.log("------- groups ------");
//       console.log(this.groups);
      
//       // console.log("------- loadedServers ------");
//       // console.log(this.loadedServers);
      
//       console.log("------- status ------");
//       console.log(this.status);

//       console.log("===================================== info end =====================================");

//   }

//     setTestServersStatus(myStatus: string) {
//         console.log("--------- ServerService setTestServersStatus ---------");
//         console.log("Color " + myStatus);
        
//         const myDate = new Date();

//         let serverData:Server[] = [];
//         let postsArray:any = this.status;

//         const currentEpoch = (myDate.valueOf() / 1000 );

//         let myhostname:string = "ansible-master";
//         let myType:string = "Cloud";
//         let myGroups:any =  ["cloud-servers"];
//         let myCPU:any = [
//           "processor\t: 0",
//           "vendor_id\t: GenuineIntel",
//           "cpu family\t: 6",
//           "model\t\t: 154",
//           "model name\t: 12th Gen Intel(R) Core(TM) i7-1255U",
//           "stepping\t: 4",
//           "microcode\t: 0x433",
//           "cpu MHz\t\t: 3838.597",
//           "cache size\t: 12288 KB",
//           "physical id\t: 0",
//           "siblings\t: 12",
//           "core id\t\t: 0",
//           "cpu cores\t: 10",
//           "apicid\t\t: 0",
//           "initial apicid\t: 0",
//           "fpu\t\t: yes",
//           "fpu_exception\t: yes",
//           "cpuid level\t: 32",
//           "wp\t\t: yes",
//           "flags\t\t: fpu vme de pse tsc msr pae mce cx8 apic sep mtrr pge mca cmov pat pse36 clflush dts acpi mmx fxsr sse sse2 ss ht tm pbe syscall nx pdpe1gb rdtscp lm contant_tsc art arch_perfmon pebs bts rep_good nopl xtopology nonstop_tsc cpuid aperfmperf tsc_known_freq pni pclmulqdq dtes64 monitor ds_cpl vmx smx est tm2 ssse3 sdbg fma cx16 xpr pdcm sse4_1 sse4_2 x2apic movbe popcnt tsc_deadline_timer aes xsave avx f16c rdrand lahf_lm abm 3dnowprefetch cpuid_fault epb cat_l2 cdp_l2 ssbd ibrs ibpb stibp ibrs_enhance tpr_shadow flexpriority ept vpid ept_ad fsgsbase tsc_adjust bmi1 avx2 smep bmi2 erms invpcid rdt_a rdseed adx smap clflushopt clwb intel_pt sha_ni xsaveopt xsavec xgetbv1 xsavs split_lock_detect user_shstk avx_vnni dtherm ida arat pln pts hwp hwp_notify hwp_act_window hwp_epp hwp_pkg_req hfi vnmi umip pku ospke waitpkg gfni vaes vpclmulqdq rdpid moviri movdir64b fsrm md_clear serialize arch_lbr ibt flush_l1d arch_capabilities",
//           "vmx flags\t: vnmi preemption_timer posted_intr invvpid ept_x_only ept_ad ept_1gb flexpriority apicv tsc_offset vtpr mtf vapic ept vpid unrestricted_guest vapic_regvid ple shadow_vmcs ept_mode_based_exec tsc_scaling usr_wait_pause",
//           "bugs\t\t: spectre_v1 spectre_v2 spec_store_bypass swapgs eibrs_pbrsb rfds bhi",
//           "bogomips\t: 5222.40",
//           "clflush size\t: 64",
//           "cache_alignment\t: 64",
//           "address sizes\t: 39 bits physical, 48 bits virtual",
//           "power management:",
//           "",
//           "processor\t: 1",
//           "vendor_id\t: GenuineIntel",
//           "cpu family\t: 6",
//           "model\t\t: 154",
//           "model name\t: 12th Gen Intel(R) Core(TM) i7-1255U",
//           "stepping\t: 4",
//           "microcode\t: 0x433",
//           "cpu MHz\t\t: 4099.481",
//           "cache size\t: 12288 KB",
//           "physical id\t: 0",
//           "siblings\t: 12",
//           "core id\t\t: 0",
//           "cpu cores\t: 10",
//           "apicid\t\t: 1",
//           "initial apicid\t: 1",
//           "fpu\t\t: yes",
//           "fpu_exception\t: yes",
//           "cpuid level\t: 32",
//           "wp\t\t: yes",
//           "flags\t\t: fpu vme de pse tsc msr pae mce cx8 apic sep mtrr pge mca cmov pat pse36 clflush dts acpi mmx fxsr sse sse2 ss ht tm pbe syscall nx pdpe1gb rdtscp lm contant_tsc art arch_perfmon pebs bts rep_good nopl xtopology nonstop_tsc cpuid aperfmperf tsc_known_freq pni pclmulqdq dtes64 monitor ds_cpl vmx smx est tm2 ssse3 sdbg fma cx16 xpr pdcm sse4_1 sse4_2 x2apic movbe popcnt tsc_deadline_timer aes xsave avx f16c rdrand lahf_lm abm 3dnowprefetch cpuid_fault epb cat_l2 cdp_l2 ssbd ibrs ibpb stibp ibrs_enhance tpr_shadow flexpriority ept vpid ept_ad fsgsbase tsc_adjust bmi1 avx2 smep bmi2 erms invpcid rdt_a rdseed adx smap clflushopt clwb intel_pt sha_ni xsaveopt xsavec xgetbv1 xsavs split_lock_detect user_shstk avx_vnni dtherm ida arat pln pts hwp hwp_notify hwp_act_window hwp_epp hwp_pkg_req hfi vnmi umip pku ospke waitpkg gfni vaes vpclmulqdq rdpid moviri movdir64b fsrm md_clear serialize arch_lbr ibt flush_l1d arch_capabilities",
//           "vmx flags\t: vnmi preemption_timer posted_intr invvpid ept_x_only ept_ad ept_1gb flexpriority apicv tsc_offset vtpr mtf vapic ept vpid unrestricted_guest vapic_regvid ple shadow_vmcs ept_mode_based_exec tsc_scaling usr_wait_pause",
//           "bugs\t\t: spectre_v1 spectre_v2 spec_store_bypass swapgs eibrs_pbrsb rfds bhi",
//           "bogomips\t: 5222.40",
//           "clflush size\t: 64",
//           "cache_alignment\t: 64",
//           "address sizes\t: 39 bits physical, 48 bits virtual",
//           "power management:",
//           "",
//           "processor\t: 2",
//           "vendor_id\t: GenuineIntel",
//           "cpu family\t: 6",
//           "model\t\t: 154",
//           "model name\t: 12th Gen Intel(R) Core(TM) i7-1255U",
//           "stepping\t: 4",
//           "microcode\t: 0x433",
//           "cpu MHz\t\t: 4100.041",
//           "cache size\t: 12288 KB",
//           "physical id\t: 0",
//           "siblings\t: 12",
//           "core id\t\t: 4",
//           "cpu cores\t: 10",
//           "apicid\t\t: 8",
//           "initial apicid\t: 8",
//           "fpu\t\t: yes",
//           "fpu_exception\t: yes",
//           "cpuid level\t: 32",
//           "wp\t\t: yes",
//           "flags\t\t: fpu vme de pse tsc msr pae mce cx8 apic sep mtrr pge mca cmov pat pse36 clflush dts acpi mmx fxsr sse sse2 ss ht tm pbe syscall nx pdpe1gb rdtscp lm contant_tsc art arch_perfmon pebs bts rep_good nopl xtopology nonstop_tsc cpuid aperfmperf tsc_known_freq pni pclmulqdq dtes64 monitor ds_cpl vmx smx est tm2 ssse3 sdbg fma cx16 xpr pdcm sse4_1 sse4_2 x2apic movbe popcnt tsc_deadline_timer aes xsave avx f16c rdrand lahf_lm abm 3dnowprefetch cpuid_fault epb cat_l2 cdp_l2 ssbd ibrs ibpb stibp ibrs_enhance tpr_shadow flexpriority ept vpid ept_ad fsgsbase tsc_adjust bmi1 avx2 smep bmi2 erms invpcid rdt_a rdseed adx smap clflushopt clwb intel_pt sha_ni xsaveopt xsavec xgetbv1 xsavs split_lock_detect user_shstk avx_vnni dtherm ida arat pln pts hwp hwp_notify hwp_act_window hwp_epp hwp_pkg_req hfi vnmi umip pku ospke waitpkg gfni vaes vpclmulqdq rdpid moviri movdir64b fsrm md_clear serialize arch_lbr ibt flush_l1d arch_capabilities",
//           "vmx flags\t: vnmi preemption_timer posted_intr invvpid ept_x_only ept_ad ept_1gb flexpriority apicv tsc_offset vtpr mtf vapic ept vpid unrestricted_guest vapic_regvid ple shadow_vmcs ept_mode_based_exec tsc_scaling usr_wait_pause",
//           "bugs\t\t: spectre_v1 spectre_v2 spec_store_bypass swapgs eibrs_pbrsb rfds bhi",
//           "bogomips\t: 5222.40",
//           "clflush size\t: 64",
//           "cache_alignment\t: 64",
//           "address sizes\t: 39 bits physical, 48 bits virtual",
//           "power management:",
//           "",
//           "processor\t: 3",
//           "vendor_id\t: GenuineIntel",
//           "cpu family\t: 6",
//           "model\t\t: 154",
//           "model name\t: 12th Gen Intel(R) Core(TM) i7-1255U",
//           "stepping\t: 4",
//           "microcode\t: 0x433",
//           "cpu MHz\t\t: 400.000",
//           "cache size\t: 12288 KB",
//           "physical id\t: 0",
//           "siblings\t: 12",
//           "core id\t\t: 4",
//           "cpu cores\t: 10",
//           "apicid\t\t: 9",
//           "initial apicid\t: 9",
//           "fpu\t\t: yes",
//           "fpu_exception\t: yes",
//           "cpuid level\t: 32",
//           "wp\t\t: yes",
//           "flags\t\t: fpu vme de pse tsc msr pae mce cx8 apic sep mtrr pge mca cmov pat pse36 clflush dts acpi mmx fxsr sse sse2 ss ht tm pbe syscall nx pdpe1gb rdtscp lm contant_tsc art arch_perfmon pebs bts rep_good nopl xtopology nonstop_tsc cpuid aperfmperf tsc_known_freq pni pclmulqdq dtes64 monitor ds_cpl vmx smx est tm2 ssse3 sdbg fma cx16 xpr pdcm sse4_1 sse4_2 x2apic movbe popcnt tsc_deadline_timer aes xsave avx f16c rdrand lahf_lm abm 3dnowprefetch cpuid_fault epb cat_l2 cdp_l2 ssbd ibrs ibpb stibp ibrs_enhance tpr_shadow flexpriority ept vpid ept_ad fsgsbase tsc_adjust bmi1 avx2 smep bmi2 erms invpcid rdt_a rdseed adx smap clflushopt clwb intel_pt sha_ni xsaveopt xsavec xgetbv1 xsavs split_lock_detect user_shstk avx_vnni dtherm ida arat pln pts hwp hwp_notify hwp_act_window hwp_epp hwp_pkg_req hfi vnmi umip pku ospke waitpkg gfni vaes vpclmulqdq rdpid moviri movdir64b fsrm md_clear serialize arch_lbr ibt flush_l1d arch_capabilities",
//           "vmx flags\t: vnmi preemption_timer posted_intr invvpid ept_x_only ept_ad ept_1gb flexpriority apicv tsc_offset vtpr mtf vapic ept vpid unrestricted_guest vapic_regvid ple shadow_vmcs ept_mode_based_exec tsc_scaling usr_wait_pause",
//           "bugs\t\t: spectre_v1 spectre_v2 spec_store_bypass swapgs eibrs_pbrsb rfds bhi",
//           "bogomips\t: 5222.40",
//           "clflush size\t: 64",
//           "cache_alignment\t: 64",
//           "address sizes\t: 39 bits physical, 48 bits virtual",
//           "power management:",
//           "",
//           "processor\t: 4",
//           "vendor_id\t: GenuineIntel",
//           "cpu family\t: 6",
//           "model\t\t: 154",
//           "model name\t: 12th Gen Intel(R) Core(TM) i7-1255U",
//           "stepping\t: 4",
//           "microcode\t: 0x433",
//           "cpu MHz\t\t: 3500.086",
//           "cache size\t: 12288 KB",
//           "physical id\t: 0",
//           "siblings\t: 12",
//           "core id\t\t: 8",
//           "cpu cores\t: 10",
//           "apicid\t\t: 16",
//           "initial apicid\t: 16",
//           "fpu\t\t: yes",
//           "fpu_exception\t: yes",
//           "cpuid level\t: 32",
//           "wp\t\t: yes",
//           "flags\t\t: fpu vme de pse tsc msr pae mce cx8 apic sep mtrr pge mca cmov pat pse36 clflush dts acpi mmx fxsr sse sse2 ss ht tm pbe syscall nx pdpe1gb rdtscp lm contant_tsc art arch_perfmon pebs bts rep_good nopl xtopology nonstop_tsc cpuid aperfmperf tsc_known_freq pni pclmulqdq dtes64 monitor ds_cpl vmx smx est tm2 ssse3 sdbg fma cx16 xpr pdcm sse4_1 sse4_2 x2apic movbe popcnt tsc_deadline_timer aes xsave avx f16c rdrand lahf_lm abm 3dnowprefetch cpuid_fault epb cat_l2 cdp_l2 ssbd ibrs ibpb stibp ibrs_enhance tpr_shadow flexpriority ept vpid ept_ad fsgsbase tsc_adjust bmi1 avx2 smep bmi2 erms invpcid rdt_a rdseed adx smap clflushopt clwb intel_pt sha_ni xsaveopt xsavec xgetbv1 xsavs split_lock_detect user_shstk avx_vnni dtherm ida arat pln pts hwp hwp_notify hwp_act_window hwp_epp hwp_pkg_req hfi vnmi umip pku ospke waitpkg gfni vaes vpclmulqdq rdpid moviri movdir64b fsrm md_clear serialize arch_lbr ibt flush_l1d arch_capabilities",
//           "vmx flags\t: vnmi preemption_timer posted_intr invvpid ept_x_only ept_ad ept_1gb flexpriority apicv tsc_offset vtpr mtf vapic ept vpid unrestricted_guest vapic_regvid ple shadow_vmcs ept_mode_based_exec tsc_scaling usr_wait_pause",
//           "bugs\t\t: spectre_v1 spectre_v2 spec_store_bypass swapgs eibrs_pbrsb rfds bhi",
//           "bogomips\t: 5222.40",
//           "clflush size\t: 64",
//           "cache_alignment\t: 64",
//           "address sizes\t: 39 bits physical, 48 bits virtual",
//           "power management:",
//           "",
//           "processor\t: 5",
//           "vendor_id\t: GenuineIntel",
//           "cpu family\t: 6",
//           "model\t\t: 154",
//           "model name\t: 12th Gen Intel(R) Core(TM) i7-1255U",
//           "stepping\t: 4",
//           "microcode\t: 0x433",
//           "cpu MHz\t\t: 3500.026",
//           "cache size\t: 12288 KB",
//           "physical id\t: 0",
//           "siblings\t: 12",
//           "core id\t\t: 9",
//           "cpu cores\t: 10",
//           "apicid\t\t: 18",
//           "initial apicid\t: 18",
//           "fpu\t\t: yes",
//           "fpu_exception\t: yes",
//           "cpuid level\t: 32",
//           "wp\t\t: yes",
//           "flags\t\t: fpu vme de pse tsc msr pae mce cx8 apic sep mtrr pge mca cmov pat pse36 clflush dts acpi mmx fxsr sse sse2 ss ht tm pbe syscall nx pdpe1gb rdtscp lm contant_tsc art arch_perfmon pebs bts rep_good nopl xtopology nonstop_tsc cpuid aperfmperf tsc_known_freq pni pclmulqdq dtes64 monitor ds_cpl vmx smx est tm2 ssse3 sdbg fma cx16 xpr pdcm sse4_1 sse4_2 x2apic movbe popcnt tsc_deadline_timer aes xsave avx f16c rdrand lahf_lm abm 3dnowprefetch cpuid_fault epb cat_l2 cdp_l2 ssbd ibrs ibpb stibp ibrs_enhance tpr_shadow flexpriority ept vpid ept_ad fsgsbase tsc_adjust bmi1 avx2 smep bmi2 erms invpcid rdt_a rdseed adx smap clflushopt clwb intel_pt sha_ni xsaveopt xsavec xgetbv1 xsavs split_lock_detect user_shstk avx_vnni dtherm ida arat pln pts hwp hwp_notify hwp_act_window hwp_epp hwp_pkg_req hfi vnmi umip pku ospke waitpkg gfni vaes vpclmulqdq rdpid moviri movdir64b fsrm md_clear serialize arch_lbr ibt flush_l1d arch_capabilities",
//           "vmx flags\t: vnmi preemption_timer posted_intr invvpid ept_x_only ept_ad ept_1gb flexpriority apicv tsc_offset vtpr mtf vapic ept vpid unrestricted_guest vapic_regvid ple shadow_vmcs ept_mode_based_exec tsc_scaling usr_wait_pause",
//           "bugs\t\t: spectre_v1 spectre_v2 spec_store_bypass swapgs eibrs_pbrsb rfds bhi",
//           "bogomips\t: 5222.40",
//           "clflush size\t: 64",
//           "cache_alignment\t: 64",
//           "address sizes\t: 39 bits physical, 48 bits virtual",
//           "power management:",
//           "",
//           "processor\t: 6",
//           "vendor_id\t: GenuineIntel",
//           "cpu family\t: 6",
//           "model\t\t: 154",
//           "model name\t: 12th Gen Intel(R) Core(TM) i7-1255U",
//           "stepping\t: 4",
//           "microcode\t: 0x433",
//           "cpu MHz\t\t: 3499.464",
//           "cache size\t: 12288 KB",
//           "physical id\t: 0",
//           "siblings\t: 12",
//           "core id\t\t: 10",
//           "cpu cores\t: 10",
//           "apicid\t\t: 20",
//           "initial apicid\t: 20",
//           "fpu\t\t: yes",
//           "fpu_exception\t: yes",
//           "cpuid level\t: 32",
//           "wp\t\t: yes",
//           "flags\t\t: fpu vme de pse tsc msr pae mce cx8 apic sep mtrr pge mca cmov pat pse36 clflush dts acpi mmx fxsr sse sse2 ss ht tm pbe syscall nx pdpe1gb rdtscp lm contant_tsc art arch_perfmon pebs bts rep_good nopl xtopology nonstop_tsc cpuid aperfmperf tsc_known_freq pni pclmulqdq dtes64 monitor ds_cpl vmx smx est tm2 ssse3 sdbg fma cx16 xpr pdcm sse4_1 sse4_2 x2apic movbe popcnt tsc_deadline_timer aes xsave avx f16c rdrand lahf_lm abm 3dnowprefetch cpuid_fault epb cat_l2 cdp_l2 ssbd ibrs ibpb stibp ibrs_enhance tpr_shadow flexpriority ept vpid ept_ad fsgsbase tsc_adjust bmi1 avx2 smep bmi2 erms invpcid rdt_a rdseed adx smap clflushopt clwb intel_pt sha_ni xsaveopt xsavec xgetbv1 xsavs split_lock_detect user_shstk avx_vnni dtherm ida arat pln pts hwp hwp_notify hwp_act_window hwp_epp hwp_pkg_req hfi vnmi umip pku ospke waitpkg gfni vaes vpclmulqdq rdpid moviri movdir64b fsrm md_clear serialize arch_lbr ibt flush_l1d arch_capabilities",
//           "vmx flags\t: vnmi preemption_timer posted_intr invvpid ept_x_only ept_ad ept_1gb flexpriority apicv tsc_offset vtpr mtf vapic ept vpid unrestricted_guest vapic_regvid ple shadow_vmcs ept_mode_based_exec tsc_scaling usr_wait_pause",
//           "bugs\t\t: spectre_v1 spectre_v2 spec_store_bypass swapgs eibrs_pbrsb rfds bhi",
//           "bogomips\t: 5222.40",
//           "clflush size\t: 64",
//           "cache_alignment\t: 64",
//           "address sizes\t: 39 bits physical, 48 bits virtual",
//           "power management:",
//           "",
//           "processor\t: 7",
//           "vendor_id\t: GenuineIntel",
//           "cpu family\t: 6",
//           "model\t\t: 154",
//           "model name\t: 12th Gen Intel(R) Core(TM) i7-1255U",
//           "stepping\t: 4",
//           "microcode\t: 0x433",
//           "cpu MHz\t\t: 400.000",
//           "cache size\t: 12288 KB",
//           "physical id\t: 0",
//           "siblings\t: 12",
//           "core id\t\t: 11",
//           "cpu cores\t: 10",
//           "apicid\t\t: 22",
//           "initial apicid\t: 22",
//           "fpu\t\t: yes",
//           "fpu_exception\t: yes",
//           "cpuid level\t: 32",
//           "wp\t\t: yes",
//           "flags\t\t: fpu vme de pse tsc msr pae mce cx8 apic sep mtrr pge mca cmov pat pse36 clflush dts acpi mmx fxsr sse sse2 ss ht tm pbe syscall nx pdpe1gb rdtscp lm contant_tsc art arch_perfmon pebs bts rep_good nopl xtopology nonstop_tsc cpuid aperfmperf tsc_known_freq pni pclmulqdq dtes64 monitor ds_cpl vmx smx est tm2 ssse3 sdbg fma cx16 xpr pdcm sse4_1 sse4_2 x2apic movbe popcnt tsc_deadline_timer aes xsave avx f16c rdrand lahf_lm abm 3dnowprefetch cpuid_fault epb cat_l2 cdp_l2 ssbd ibrs ibpb stibp ibrs_enhance tpr_shadow flexpriority ept vpid ept_ad fsgsbase tsc_adjust bmi1 avx2 smep bmi2 erms invpcid rdt_a rdseed adx smap clflushopt clwb intel_pt sha_ni xsaveopt xsavec xgetbv1 xsavs split_lock_detect user_shstk avx_vnni dtherm ida arat pln pts hwp hwp_notify hwp_act_window hwp_epp hwp_pkg_req hfi vnmi umip pku ospke waitpkg gfni vaes vpclmulqdq rdpid moviri movdir64b fsrm md_clear serialize arch_lbr ibt flush_l1d arch_capabilities",
//           "vmx flags\t: vnmi preemption_timer posted_intr invvpid ept_x_only ept_ad ept_1gb flexpriority apicv tsc_offset vtpr mtf vapic ept vpid unrestricted_guest vapic_regvid ple shadow_vmcs ept_mode_based_exec tsc_scaling usr_wait_pause",
//           "bugs\t\t: spectre_v1 spectre_v2 spec_store_bypass swapgs eibrs_pbrsb rfds bhi",
//           "bogomips\t: 5222.40",
//           "clflush size\t: 64",
//           "cache_alignment\t: 64",
//           "address sizes\t: 39 bits physical, 48 bits virtual",
//           "power management:",
//           "",
//           "processor\t: 8",
//           "vendor_id\t: GenuineIntel",
//           "cpu family\t: 6",
//           "model\t\t: 154",
//           "model name\t: 12th Gen Intel(R) Core(TM) i7-1255U",
//           "stepping\t: 4",
//           "microcode\t: 0x433",
//           "cpu MHz\t\t: 400.000",
//           "cache size\t: 12288 KB",
//           "physical id\t: 0",
//           "siblings\t: 12",
//           "core id\t\t: 12",
//           "cpu cores\t: 10",
//           "apicid\t\t: 24",
//           "initial apicid\t: 24",
//           "fpu\t\t: yes",
//           "fpu_exception\t: yes",
//           "cpuid level\t: 32",
//           "wp\t\t: yes",
//           "flags\t\t: fpu vme de pse tsc msr pae mce cx8 apic sep mtrr pge mca cmov pat pse36 clflush dts acpi mmx fxsr sse sse2 ss ht tm pbe syscall nx pdpe1gb rdtscp lm contant_tsc art arch_perfmon pebs bts rep_good nopl xtopology nonstop_tsc cpuid aperfmperf tsc_known_freq pni pclmulqdq dtes64 monitor ds_cpl vmx smx est tm2 ssse3 sdbg fma cx16 xpr pdcm sse4_1 sse4_2 x2apic movbe popcnt tsc_deadline_timer aes xsave avx f16c rdrand lahf_lm abm 3dnowprefetch cpuid_fault epb cat_l2 cdp_l2 ssbd ibrs ibpb stibp ibrs_enhance tpr_shadow flexpriority ept vpid ept_ad fsgsbase tsc_adjust bmi1 avx2 smep bmi2 erms invpcid rdt_a rdseed adx smap clflushopt clwb intel_pt sha_ni xsaveopt xsavec xgetbv1 xsavs split_lock_detect user_shstk avx_vnni dtherm ida arat pln pts hwp hwp_notify hwp_act_window hwp_epp hwp_pkg_req hfi vnmi umip pku ospke waitpkg gfni vaes vpclmulqdq rdpid moviri movdir64b fsrm md_clear serialize arch_lbr ibt flush_l1d arch_capabilities",
//           "vmx flags\t: vnmi preemption_timer posted_intr invvpid ept_x_only ept_ad ept_1gb flexpriority apicv tsc_offset vtpr mtf vapic ept vpid unrestricted_guest vapic_regvid ple shadow_vmcs ept_mode_based_exec tsc_scaling usr_wait_pause",
//           "bugs\t\t: spectre_v1 spectre_v2 spec_store_bypass swapgs eibrs_pbrsb rfds bhi",
//           "bogomips\t: 5222.40",
//           "clflush size\t: 64",
//           "cache_alignment\t: 64",
//           "address sizes\t: 39 bits physical, 48 bits virtual",
//           "power management:",
//           "",
//           "processor\t: 9",
//           "vendor_id\t: GenuineIntel",
//           "cpu family\t: 6",
//           "model\t\t: 154",
//           "model name\t: 12th Gen Intel(R) Core(TM) i7-1255U",
//           "stepping\t: 4",
//           "microcode\t: 0x433",
//           "cpu MHz\t\t: 3500.951",
//           "cache size\t: 12288 KB",
//           "physical id\t: 0",
//           "siblings\t: 12",
//           "core id\t\t: 13",
//           "cpu cores\t: 10",
//           "apicid\t\t: 26",
//           "initial apicid\t: 26",
//           "fpu\t\t: yes",
//           "fpu_exception\t: yes",
//           "cpuid level\t: 32",
//           "wp\t\t: yes",
//           "flags\t\t: fpu vme de pse tsc msr pae mce cx8 apic sep mtrr pge mca cmov pat pse36 clflush dts acpi mmx fxsr sse sse2 ss ht tm pbe syscall nx pdpe1gb rdtscp lm contant_tsc art arch_perfmon pebs bts rep_good nopl xtopology nonstop_tsc cpuid aperfmperf tsc_known_freq pni pclmulqdq dtes64 monitor ds_cpl vmx smx est tm2 ssse3 sdbg fma cx16 xpr pdcm sse4_1 sse4_2 x2apic movbe popcnt tsc_deadline_timer aes xsave avx f16c rdrand lahf_lm abm 3dnowprefetch cpuid_fault epb cat_l2 cdp_l2 ssbd ibrs ibpb stibp ibrs_enhance tpr_shadow flexpriority ept vpid ept_ad fsgsbase tsc_adjust bmi1 avx2 smep bmi2 erms invpcid rdt_a rdseed adx smap clflushopt clwb intel_pt sha_ni xsaveopt xsavec xgetbv1 xsavs split_lock_detect user_shstk avx_vnni dtherm ida arat pln pts hwp hwp_notify hwp_act_window hwp_epp hwp_pkg_req hfi vnmi umip pku ospke waitpkg gfni vaes vpclmulqdq rdpid moviri movdir64b fsrm md_clear serialize arch_lbr ibt flush_l1d arch_capabilities",
//           "vmx flags\t: vnmi preemption_timer posted_intr invvpid ept_x_only ept_ad ept_1gb flexpriority apicv tsc_offset vtpr mtf vapic ept vpid unrestricted_guest vapic_regvid ple shadow_vmcs ept_mode_based_exec tsc_scaling usr_wait_pause",
//           "bugs\t\t: spectre_v1 spectre_v2 spec_store_bypass swapgs eibrs_pbrsb rfds bhi",
//           "bogomips\t: 5222.40",
//           "clflush size\t: 64",
//           "cache_alignment\t: 64",
//           "address sizes\t: 39 bits physical, 48 bits virtual",
//           "power management:",
//           "",
//           "processor\t: 10",
//           "vendor_id\t: GenuineIntel",
//           "cpu family\t: 6",
//           "model\t\t: 154",
//           "model name\t: 12th Gen Intel(R) Core(TM) i7-1255U",
//           "stepping\t: 4",
//           "microcode\t: 0x433",
//           "cpu MHz\t\t: 3499.979",
//           "cache size\t: 12288 KB",
//           "physical id\t: 0",
//           "siblings\t: 12",
//           "core id\t\t: 14",
//           "cpu cores\t: 10",
//           "apicid\t\t: 28",
//           "initial apicid\t: 28",
//           "fpu\t\t: yes",
//           "fpu_exception\t: yes",
//           "cpuid level\t: 32",
//           "wp\t\t: yes",
//           "flags\t\t: fpu vme de pse tsc msr pae mce cx8 apic sep mtrr pge mca cmov pat pse36 clflush dts acpi mmx fxsr sse sse2 ss ht tm pbe syscall nx pdpe1gb rdtscp lm contant_tsc art arch_perfmon pebs bts rep_good nopl xtopology nonstop_tsc cpuid aperfmperf tsc_known_freq pni pclmulqdq dtes64 monitor ds_cpl vmx smx est tm2 ssse3 sdbg fma cx16 xpr pdcm sse4_1 sse4_2 x2apic movbe popcnt tsc_deadline_timer aes xsave avx f16c rdrand lahf_lm abm 3dnowprefetch cpuid_fault epb cat_l2 cdp_l2 ssbd ibrs ibpb stibp ibrs_enhance tpr_shadow flexpriority ept vpid ept_ad fsgsbase tsc_adjust bmi1 avx2 smep bmi2 erms invpcid rdt_a rdseed adx smap clflushopt clwb intel_pt sha_ni xsaveopt xsavec xgetbv1 xsavs split_lock_detect user_shstk avx_vnni dtherm ida arat pln pts hwp hwp_notify hwp_act_window hwp_epp hwp_pkg_req hfi vnmi umip pku ospke waitpkg gfni vaes vpclmulqdq rdpid moviri movdir64b fsrm md_clear serialize arch_lbr ibt flush_l1d arch_capabilities",
//           "vmx flags\t: vnmi preemption_timer posted_intr invvpid ept_x_only ept_ad ept_1gb flexpriority apicv tsc_offset vtpr mtf vapic ept vpid unrestricted_guest vapic_regvid ple shadow_vmcs ept_mode_based_exec tsc_scaling usr_wait_pause",
//           "bugs\t\t: spectre_v1 spectre_v2 spec_store_bypass swapgs eibrs_pbrsb rfds bhi",
//           "bogomips\t: 5222.40",
//           "clflush size\t: 64",
//           "cache_alignment\t: 64",
//           "address sizes\t: 39 bits physical, 48 bits virtual",
//           "power management:",
//           "",
//           "processor\t: 11",
//           "vendor_id\t: GenuineIntel",
//           "cpu family\t: 6",
//           "model\t\t: 154",
//           "model name\t: 12th Gen Intel(R) Core(TM) i7-1255U",
//           "stepping\t: 4",
//           "microcode\t: 0x433",
//           "cpu MHz\t\t: 3499.478",
//           "cache size\t: 12288 KB",
//           "physical id\t: 0",
//           "siblings\t: 12",
//           "core id\t\t: 15",
//           "cpu cores\t: 10",
//           "apicid\t\t: 30",
//           "initial apicid\t: 30",
//           "fpu\t\t: yes",
//           "fpu_exception\t: yes",
//           "cpuid level\t: 32",
//           "wp\t\t: yes",
//           "flags\t\t: fpu vme de pse tsc msr pae mce cx8 apic sep mtrr pge mca cmov pat pse36 clflush dts acpi mmx fxsr sse sse2 ss ht tm pbe syscall nx pdpe1gb rdtscp lm contant_tsc art arch_perfmon pebs bts rep_good nopl xtopology nonstop_tsc cpuid aperfmperf tsc_known_freq pni pclmulqdq dtes64 monitor ds_cpl vmx smx est tm2 ssse3 sdbg fma cx16 xpr pdcm sse4_1 sse4_2 x2apic movbe popcnt tsc_deadline_timer aes xsave avx f16c rdrand lahf_lm abm 3dnowprefetch cpuid_fault epb cat_l2 cdp_l2 ssbd ibrs ibpb stibp ibrs_enhance tpr_shadow flexpriority ept vpid ept_ad fsgsbase tsc_adjust bmi1 avx2 smep bmi2 erms invpcid rdt_a rdseed adx smap clflushopt clwb intel_pt sha_ni xsaveopt xsavec xgetbv1 xsavs split_lock_detect user_shstk avx_vnni dtherm ida arat pln pts hwp hwp_notify hwp_act_window hwp_epp hwp_pkg_req hfi vnmi umip pku ospke waitpkg gfni vaes vpclmulqdq rdpid moviri movdir64b fsrm md_clear serialize arch_lbr ibt flush_l1d arch_capabilities",
//           "vmx flags\t: vnmi preemption_timer posted_intr invvpid ept_x_only ept_ad ept_1gb flexpriority apicv tsc_offset vtpr mtf vapic ept vpid unrestricted_guest vapic_regvid ple shadow_vmcs ept_mode_based_exec tsc_scaling usr_wait_pause",
//           "bugs\t\t: spectre_v1 spectre_v2 spec_store_bypass swapgs eibrs_pbrsb rfds bhi",
//           "bogomips\t: 5222.40",
//           "clflush size\t: 64",
//           "cache_alignment\t: 64",
//           "address sizes\t: 39 bits physical, 48 bits virtual",
//           "power management:"];
//         let myEpoch:string = (Number(Number(currentEpoch)).toFixed(3));
//         let myIcon:string = "pi pi-cloud";
//         let myLastUpdate:string = "2024-10-10:21:50:22";
//         let myUptime:string = (Number(Number("3279890.20")/3600)).toFixed(3);

//         let myServer:Server = this.setTestServer(myCPU, myEpoch, myGroups, myhostname, myIcon, myLastUpdate, myStatus, myType, myUptime);

//         // console.log("--------- myServer ---------");
//         // console.log(myServer);

//         postsArray.push(myServer);

//         this.hosts.push(myhostname);
        
//         myhostname = "ubuntu-node01";
//         myCPU = [
//           "processor\t: 0",
//           "vendor_id\t: GenuineIntel",
//           "cpu family\t: 6",
//           "model\t\t: 154",
//           "model name\t: 12th Gen Intel(R) Core(TM) i7-1255U",
//           "stepping\t: 4",
//           "microcode\t: 0x433",
//           "cpu MHz\t\t: 4491.204",
//           "cache size\t: 12288 KB",
//           "physical id\t: 0",
//           "siblings\t: 12",
//           "core id\t\t: 0",
//           "cpu cores\t: 10",
//           "apicid\t\t: 0",
//           "initial apicid\t: 0",
//           "fpu\t\t: yes",
//           "fpu_exception\t: yes",
//           "cpuid level\t: 32",
//           "wp\t\t: yes",
//           "flags\t\t: fpu vme de pse tsc msr pae mce cx8 apic sep mtrr pge mca cmov pat pse36 clflush dts acpi mmx fxsr sse sse2 ss ht tm pbe syscall nx pdpe1gb rdtscp lm contant_tsc art arch_perfmon pebs bts rep_good nopl xtopology nonstop_tsc cpuid aperfmperf tsc_known_freq pni pclmulqdq dtes64 monitor ds_cpl vmx smx est tm2 ssse3 sdbg fma cx16 xpr pdcm sse4_1 sse4_2 x2apic movbe popcnt tsc_deadline_timer aes xsave avx f16c rdrand lahf_lm abm 3dnowprefetch cpuid_fault epb cat_l2 cdp_l2 ssbd ibrs ibpb stibp ibrs_enhance tpr_shadow flexpriority ept vpid ept_ad fsgsbase tsc_adjust bmi1 avx2 smep bmi2 erms invpcid rdt_a rdseed adx smap clflushopt clwb intel_pt sha_ni xsaveopt xsavec xgetbv1 xsavs split_lock_detect user_shstk avx_vnni dtherm ida arat pln pts hwp hwp_notify hwp_act_window hwp_epp hwp_pkg_req hfi vnmi umip pku ospke waitpkg gfni vaes vpclmulqdq rdpid moviri movdir64b fsrm md_clear serialize arch_lbr ibt flush_l1d arch_capabilities",
//           "vmx flags\t: vnmi preemption_timer posted_intr invvpid ept_x_only ept_ad ept_1gb flexpriority apicv tsc_offset vtpr mtf vapic ept vpid unrestricted_guest vapic_regvid ple shadow_vmcs ept_mode_based_exec tsc_scaling usr_wait_pause",
//           "bugs\t\t: spectre_v1 spectre_v2 spec_store_bypass swapgs eibrs_pbrsb rfds bhi",
//           "bogomips\t: 5222.40",
//           "clflush size\t: 64",
//           "cache_alignment\t: 64",
//           "address sizes\t: 39 bits physical, 48 bits virtual",
//           "power management:",
//           "",
//           "processor\t: 1",
//           "vendor_id\t: GenuineIntel",
//           "cpu family\t: 6",
//           "model\t\t: 154",
//           "model name\t: 12th Gen Intel(R) Core(TM) i7-1255U",
//           "stepping\t: 4",
//           "microcode\t: 0x433",
//           "cpu MHz\t\t: 4094.289",
//           "cache size\t: 12288 KB",
//           "physical id\t: 0",
//           "siblings\t: 12",
//           "core id\t\t: 0",
//           "cpu cores\t: 10",
//           "apicid\t\t: 1",
//           "initial apicid\t: 1",
//           "fpu\t\t: yes",
//           "fpu_exception\t: yes",
//           "cpuid level\t: 32",
//           "wp\t\t: yes",
//           "flags\t\t: fpu vme de pse tsc msr pae mce cx8 apic sep mtrr pge mca cmov pat pse36 clflush dts acpi mmx fxsr sse sse2 ss ht tm pbe syscall nx pdpe1gb rdtscp lm contant_tsc art arch_perfmon pebs bts rep_good nopl xtopology nonstop_tsc cpuid aperfmperf tsc_known_freq pni pclmulqdq dtes64 monitor ds_cpl vmx smx est tm2 ssse3 sdbg fma cx16 xpr pdcm sse4_1 sse4_2 x2apic movbe popcnt tsc_deadline_timer aes xsave avx f16c rdrand lahf_lm abm 3dnowprefetch cpuid_fault epb cat_l2 cdp_l2 ssbd ibrs ibpb stibp ibrs_enhance tpr_shadow flexpriority ept vpid ept_ad fsgsbase tsc_adjust bmi1 avx2 smep bmi2 erms invpcid rdt_a rdseed adx smap clflushopt clwb intel_pt sha_ni xsaveopt xsavec xgetbv1 xsavs split_lock_detect user_shstk avx_vnni dtherm ida arat pln pts hwp hwp_notify hwp_act_window hwp_epp hwp_pkg_req hfi vnmi umip pku ospke waitpkg gfni vaes vpclmulqdq rdpid moviri movdir64b fsrm md_clear serialize arch_lbr ibt flush_l1d arch_capabilities",
//           "vmx flags\t: vnmi preemption_timer posted_intr invvpid ept_x_only ept_ad ept_1gb flexpriority apicv tsc_offset vtpr mtf vapic ept vpid unrestricted_guest vapic_regvid ple shadow_vmcs ept_mode_based_exec tsc_scaling usr_wait_pause",
//           "bugs\t\t: spectre_v1 spectre_v2 spec_store_bypass swapgs eibrs_pbrsb rfds bhi",
//           "bogomips\t: 5222.40",
//           "clflush size\t: 64",
//           "cache_alignment\t: 64",
//           "address sizes\t: 39 bits physical, 48 bits virtual",
//           "power management:",
//           "",
//           "processor\t: 2",
//           "vendor_id\t: GenuineIntel",
//           "cpu family\t: 6",
//           "model\t\t: 154",
//           "model name\t: 12th Gen Intel(R) Core(TM) i7-1255U",
//           "stepping\t: 4",
//           "microcode\t: 0x433",
//           "cpu MHz\t\t: 3838.802",
//           "cache size\t: 12288 KB",
//           "physical id\t: 0",
//           "siblings\t: 12",
//           "core id\t\t: 4",
//           "cpu cores\t: 10",
//           "apicid\t\t: 8",
//           "initial apicid\t: 8",
//           "fpu\t\t: yes",
//           "fpu_exception\t: yes",
//           "cpuid level\t: 32",
//           "wp\t\t: yes",
//           "flags\t\t: fpu vme de pse tsc msr pae mce cx8 apic sep mtrr pge mca cmov pat pse36 clflush dts acpi mmx fxsr sse sse2 ss ht tm pbe syscall nx pdpe1gb rdtscp lm contant_tsc art arch_perfmon pebs bts rep_good nopl xtopology nonstop_tsc cpuid aperfmperf tsc_known_freq pni pclmulqdq dtes64 monitor ds_cpl vmx smx est tm2 ssse3 sdbg fma cx16 xpr pdcm sse4_1 sse4_2 x2apic movbe popcnt tsc_deadline_timer aes xsave avx f16c rdrand lahf_lm abm 3dnowprefetch cpuid_fault epb cat_l2 cdp_l2 ssbd ibrs ibpb stibp ibrs_enhance tpr_shadow flexpriority ept vpid ept_ad fsgsbase tsc_adjust bmi1 avx2 smep bmi2 erms invpcid rdt_a rdseed adx smap clflushopt clwb intel_pt sha_ni xsaveopt xsavec xgetbv1 xsavs split_lock_detect user_shstk avx_vnni dtherm ida arat pln pts hwp hwp_notify hwp_act_window hwp_epp hwp_pkg_req hfi vnmi umip pku ospke waitpkg gfni vaes vpclmulqdq rdpid moviri movdir64b fsrm md_clear serialize arch_lbr ibt flush_l1d arch_capabilities",
//           "vmx flags\t: vnmi preemption_timer posted_intr invvpid ept_x_only ept_ad ept_1gb flexpriority apicv tsc_offset vtpr mtf vapic ept vpid unrestricted_guest vapic_regvid ple shadow_vmcs ept_mode_based_exec tsc_scaling usr_wait_pause",
//           "bugs\t\t: spectre_v1 spectre_v2 spec_store_bypass swapgs eibrs_pbrsb rfds bhi",
//           "bogomips\t: 5222.40",
//           "clflush size\t: 64",
//           "cache_alignment\t: 64",
//           "address sizes\t: 39 bits physical, 48 bits virtual",
//           "power management:",
//           "",
//           "processor\t: 3",
//           "vendor_id\t: GenuineIntel",
//           "cpu family\t: 6",
//           "model\t\t: 154",
//           "model name\t: 12th Gen Intel(R) Core(TM) i7-1255U",
//           "stepping\t: 4",
//           "microcode\t: 0x433",
//           "cpu MHz\t\t: 400.000",
//           "cache size\t: 12288 KB",
//           "physical id\t: 0",
//           "siblings\t: 12",
//           "core id\t\t: 4",
//           "cpu cores\t: 10",
//           "apicid\t\t: 9",
//           "initial apicid\t: 9",
//           "fpu\t\t: yes",
//           "fpu_exception\t: yes",
//           "cpuid level\t: 32",
//           "wp\t\t: yes",
//           "flags\t\t: fpu vme de pse tsc msr pae mce cx8 apic sep mtrr pge mca cmov pat pse36 clflush dts acpi mmx fxsr sse sse2 ss ht tm pbe syscall nx pdpe1gb rdtscp lm contant_tsc art arch_perfmon pebs bts rep_good nopl xtopology nonstop_tsc cpuid aperfmperf tsc_known_freq pni pclmulqdq dtes64 monitor ds_cpl vmx smx est tm2 ssse3 sdbg fma cx16 xpr pdcm sse4_1 sse4_2 x2apic movbe popcnt tsc_deadline_timer aes xsave avx f16c rdrand lahf_lm abm 3dnowprefetch cpuid_fault epb cat_l2 cdp_l2 ssbd ibrs ibpb stibp ibrs_enhance tpr_shadow flexpriority ept vpid ept_ad fsgsbase tsc_adjust bmi1 avx2 smep bmi2 erms invpcid rdt_a rdseed adx smap clflushopt clwb intel_pt sha_ni xsaveopt xsavec xgetbv1 xsavs split_lock_detect user_shstk avx_vnni dtherm ida arat pln pts hwp hwp_notify hwp_act_window hwp_epp hwp_pkg_req hfi vnmi umip pku ospke waitpkg gfni vaes vpclmulqdq rdpid moviri movdir64b fsrm md_clear serialize arch_lbr ibt flush_l1d arch_capabilities",
//           "vmx flags\t: vnmi preemption_timer posted_intr invvpid ept_x_only ept_ad ept_1gb flexpriority apicv tsc_offset vtpr mtf vapic ept vpid unrestricted_guest vapic_regvid ple shadow_vmcs ept_mode_based_exec tsc_scaling usr_wait_pause",
//           "bugs\t\t: spectre_v1 spectre_v2 spec_store_bypass swapgs eibrs_pbrsb rfds bhi",
//           "bogomips\t: 5222.40",
//           "clflush size\t: 64",
//           "cache_alignment\t: 64",
//           "address sizes\t: 39 bits physical, 48 bits virtual",
//           "power management:",
//           "",
//           "processor\t: 4",
//           "vendor_id\t: GenuineIntel",
//           "cpu family\t: 6",
//           "model\t\t: 154",
//           "model name\t: 12th Gen Intel(R) Core(TM) i7-1255U",
//           "stepping\t: 4",
//           "microcode\t: 0x433",
//           "cpu MHz\t\t: 3500.003",
//           "cache size\t: 12288 KB",
//           "physical id\t: 0",
//           "siblings\t: 12",
//           "core id\t\t: 8",
//           "cpu cores\t: 10",
//           "apicid\t\t: 16",
//           "initial apicid\t: 16",
//           "fpu\t\t: yes",
//           "fpu_exception\t: yes",
//           "cpuid level\t: 32",
//           "wp\t\t: yes",
//           "flags\t\t: fpu vme de pse tsc msr pae mce cx8 apic sep mtrr pge mca cmov pat pse36 clflush dts acpi mmx fxsr sse sse2 ss ht tm pbe syscall nx pdpe1gb rdtscp lm contant_tsc art arch_perfmon pebs bts rep_good nopl xtopology nonstop_tsc cpuid aperfmperf tsc_known_freq pni pclmulqdq dtes64 monitor ds_cpl vmx smx est tm2 ssse3 sdbg fma cx16 xpr pdcm sse4_1 sse4_2 x2apic movbe popcnt tsc_deadline_timer aes xsave avx f16c rdrand lahf_lm abm 3dnowprefetch cpuid_fault epb cat_l2 cdp_l2 ssbd ibrs ibpb stibp ibrs_enhance tpr_shadow flexpriority ept vpid ept_ad fsgsbase tsc_adjust bmi1 avx2 smep bmi2 erms invpcid rdt_a rdseed adx smap clflushopt clwb intel_pt sha_ni xsaveopt xsavec xgetbv1 xsavs split_lock_detect user_shstk avx_vnni dtherm ida arat pln pts hwp hwp_notify hwp_act_window hwp_epp hwp_pkg_req hfi vnmi umip pku ospke waitpkg gfni vaes vpclmulqdq rdpid moviri movdir64b fsrm md_clear serialize arch_lbr ibt flush_l1d arch_capabilities",
//           "vmx flags\t: vnmi preemption_timer posted_intr invvpid ept_x_only ept_ad ept_1gb flexpriority apicv tsc_offset vtpr mtf vapic ept vpid unrestricted_guest vapic_regvid ple shadow_vmcs ept_mode_based_exec tsc_scaling usr_wait_pause",
//           "bugs\t\t: spectre_v1 spectre_v2 spec_store_bypass swapgs eibrs_pbrsb rfds bhi",
//           "bogomips\t: 5222.40",
//           "clflush size\t: 64",
//           "cache_alignment\t: 64",
//           "address sizes\t: 39 bits physical, 48 bits virtual",
//           "power management:",
//           "",
//           "processor\t: 5",
//           "vendor_id\t: GenuineIntel",
//           "cpu family\t: 6",
//           "model\t\t: 154",
//           "model name\t: 12th Gen Intel(R) Core(TM) i7-1255U",
//           "stepping\t: 4",
//           "microcode\t: 0x433",
//           "cpu MHz\t\t: 3498.771",
//           "cache size\t: 12288 KB",
//           "physical id\t: 0",
//           "siblings\t: 12",
//           "core id\t\t: 9",
//           "cpu cores\t: 10",
//           "apicid\t\t: 18",
//           "initial apicid\t: 18",
//           "fpu\t\t: yes",
//           "fpu_exception\t: yes",
//           "cpuid level\t: 32",
//           "wp\t\t: yes",
//           "flags\t\t: fpu vme de pse tsc msr pae mce cx8 apic sep mtrr pge mca cmov pat pse36 clflush dts acpi mmx fxsr sse sse2 ss ht tm pbe syscall nx pdpe1gb rdtscp lm contant_tsc art arch_perfmon pebs bts rep_good nopl xtopology nonstop_tsc cpuid aperfmperf tsc_known_freq pni pclmulqdq dtes64 monitor ds_cpl vmx smx est tm2 ssse3 sdbg fma cx16 xpr pdcm sse4_1 sse4_2 x2apic movbe popcnt tsc_deadline_timer aes xsave avx f16c rdrand lahf_lm abm 3dnowprefetch cpuid_fault epb cat_l2 cdp_l2 ssbd ibrs ibpb stibp ibrs_enhance tpr_shadow flexpriority ept vpid ept_ad fsgsbase tsc_adjust bmi1 avx2 smep bmi2 erms invpcid rdt_a rdseed adx smap clflushopt clwb intel_pt sha_ni xsaveopt xsavec xgetbv1 xsavs split_lock_detect user_shstk avx_vnni dtherm ida arat pln pts hwp hwp_notify hwp_act_window hwp_epp hwp_pkg_req hfi vnmi umip pku ospke waitpkg gfni vaes vpclmulqdq rdpid moviri movdir64b fsrm md_clear serialize arch_lbr ibt flush_l1d arch_capabilities",
//           "vmx flags\t: vnmi preemption_timer posted_intr invvpid ept_x_only ept_ad ept_1gb flexpriority apicv tsc_offset vtpr mtf vapic ept vpid unrestricted_guest vapic_regvid ple shadow_vmcs ept_mode_based_exec tsc_scaling usr_wait_pause",
//           "bugs\t\t: spectre_v1 spectre_v2 spec_store_bypass swapgs eibrs_pbrsb rfds bhi",
//           "bogomips\t: 5222.40",
//           "clflush size\t: 64",
//           "cache_alignment\t: 64",
//           "address sizes\t: 39 bits physical, 48 bits virtual",
//           "power management:",
//           "",
//           "processor\t: 6",
//           "vendor_id\t: GenuineIntel",
//           "cpu family\t: 6",
//           "model\t\t: 154",
//           "model name\t: 12th Gen Intel(R) Core(TM) i7-1255U",
//           "stepping\t: 4",
//           "microcode\t: 0x433",
//           "cpu MHz\t\t: 3501.847",
//           "cache size\t: 12288 KB",
//           "physical id\t: 0",
//           "siblings\t: 12",
//           "core id\t\t: 10",
//           "cpu cores\t: 10",
//           "apicid\t\t: 20",
//           "initial apicid\t: 20",
//           "fpu\t\t: yes",
//           "fpu_exception\t: yes",
//           "cpuid level\t: 32",
//           "wp\t\t: yes",
//           "flags\t\t: fpu vme de pse tsc msr pae mce cx8 apic sep mtrr pge mca cmov pat pse36 clflush dts acpi mmx fxsr sse sse2 ss ht tm pbe syscall nx pdpe1gb rdtscp lm contant_tsc art arch_perfmon pebs bts rep_good nopl xtopology nonstop_tsc cpuid aperfmperf tsc_known_freq pni pclmulqdq dtes64 monitor ds_cpl vmx smx est tm2 ssse3 sdbg fma cx16 xpr pdcm sse4_1 sse4_2 x2apic movbe popcnt tsc_deadline_timer aes xsave avx f16c rdrand lahf_lm abm 3dnowprefetch cpuid_fault epb cat_l2 cdp_l2 ssbd ibrs ibpb stibp ibrs_enhance tpr_shadow flexpriority ept vpid ept_ad fsgsbase tsc_adjust bmi1 avx2 smep bmi2 erms invpcid rdt_a rdseed adx smap clflushopt clwb intel_pt sha_ni xsaveopt xsavec xgetbv1 xsavs split_lock_detect user_shstk avx_vnni dtherm ida arat pln pts hwp hwp_notify hwp_act_window hwp_epp hwp_pkg_req hfi vnmi umip pku ospke waitpkg gfni vaes vpclmulqdq rdpid moviri movdir64b fsrm md_clear serialize arch_lbr ibt flush_l1d arch_capabilities",
//           "vmx flags\t: vnmi preemption_timer posted_intr invvpid ept_x_only ept_ad ept_1gb flexpriority apicv tsc_offset vtpr mtf vapic ept vpid unrestricted_guest vapic_regvid ple shadow_vmcs ept_mode_based_exec tsc_scaling usr_wait_pause",
//           "bugs\t\t: spectre_v1 spectre_v2 spec_store_bypass swapgs eibrs_pbrsb rfds bhi",
//           "bogomips\t: 5222.40",
//           "clflush size\t: 64",
//           "cache_alignment\t: 64",
//           "address sizes\t: 39 bits physical, 48 bits virtual",
//           "power management:",
//           "",
//           "processor\t: 7",
//           "vendor_id\t: GenuineIntel",
//           "cpu family\t: 6",
//           "model\t\t: 154",
//           "model name\t: 12th Gen Intel(R) Core(TM) i7-1255U",
//           "stepping\t: 4",
//           "microcode\t: 0x433",
//           "cpu MHz\t\t: 3500.041",
//           "cache size\t: 12288 KB",
//           "physical id\t: 0",
//           "siblings\t: 12",
//           "core id\t\t: 11",
//           "cpu cores\t: 10",
//           "apicid\t\t: 22",
//           "initial apicid\t: 22",
//           "fpu\t\t: yes",
//           "fpu_exception\t: yes",
//           "cpuid level\t: 32",
//           "wp\t\t: yes",
//           "flags\t\t: fpu vme de pse tsc msr pae mce cx8 apic sep mtrr pge mca cmov pat pse36 clflush dts acpi mmx fxsr sse sse2 ss ht tm pbe syscall nx pdpe1gb rdtscp lm contant_tsc art arch_perfmon pebs bts rep_good nopl xtopology nonstop_tsc cpuid aperfmperf tsc_known_freq pni pclmulqdq dtes64 monitor ds_cpl vmx smx est tm2 ssse3 sdbg fma cx16 xpr pdcm sse4_1 sse4_2 x2apic movbe popcnt tsc_deadline_timer aes xsave avx f16c rdrand lahf_lm abm 3dnowprefetch cpuid_fault epb cat_l2 cdp_l2 ssbd ibrs ibpb stibp ibrs_enhance tpr_shadow flexpriority ept vpid ept_ad fsgsbase tsc_adjust bmi1 avx2 smep bmi2 erms invpcid rdt_a rdseed adx smap clflushopt clwb intel_pt sha_ni xsaveopt xsavec xgetbv1 xsavs split_lock_detect user_shstk avx_vnni dtherm ida arat pln pts hwp hwp_notify hwp_act_window hwp_epp hwp_pkg_req hfi vnmi umip pku ospke waitpkg gfni vaes vpclmulqdq rdpid moviri movdir64b fsrm md_clear serialize arch_lbr ibt flush_l1d arch_capabilities",
//           "vmx flags\t: vnmi preemption_timer posted_intr invvpid ept_x_only ept_ad ept_1gb flexpriority apicv tsc_offset vtpr mtf vapic ept vpid unrestricted_guest vapic_regvid ple shadow_vmcs ept_mode_based_exec tsc_scaling usr_wait_pause",
//           "bugs\t\t: spectre_v1 spectre_v2 spec_store_bypass swapgs eibrs_pbrsb rfds bhi",
//           "bogomips\t: 5222.40",
//           "clflush size\t: 64",
//           "cache_alignment\t: 64",
//           "address sizes\t: 39 bits physical, 48 bits virtual",
//           "power management:",
//           "",
//           "processor\t: 8",
//           "vendor_id\t: GenuineIntel",
//           "cpu family\t: 6",
//           "model\t\t: 154",
//           "model name\t: 12th Gen Intel(R) Core(TM) i7-1255U",
//           "stepping\t: 4",
//           "microcode\t: 0x433",
//           "cpu MHz\t\t: 3500.111",
//           "cache size\t: 12288 KB",
//           "physical id\t: 0",
//           "siblings\t: 12",
//           "core id\t\t: 12",
//           "cpu cores\t: 10",
//           "apicid\t\t: 24",
//           "initial apicid\t: 24",
//           "fpu\t\t: yes",
//           "fpu_exception\t: yes",
//           "cpuid level\t: 32",
//           "wp\t\t: yes",
//           "flags\t\t: fpu vme de pse tsc msr pae mce cx8 apic sep mtrr pge mca cmov pat pse36 clflush dts acpi mmx fxsr sse sse2 ss ht tm pbe syscall nx pdpe1gb rdtscp lm contant_tsc art arch_perfmon pebs bts rep_good nopl xtopology nonstop_tsc cpuid aperfmperf tsc_known_freq pni pclmulqdq dtes64 monitor ds_cpl vmx smx est tm2 ssse3 sdbg fma cx16 xpr pdcm sse4_1 sse4_2 x2apic movbe popcnt tsc_deadline_timer aes xsave avx f16c rdrand lahf_lm abm 3dnowprefetch cpuid_fault epb cat_l2 cdp_l2 ssbd ibrs ibpb stibp ibrs_enhance tpr_shadow flexpriority ept vpid ept_ad fsgsbase tsc_adjust bmi1 avx2 smep bmi2 erms invpcid rdt_a rdseed adx smap clflushopt clwb intel_pt sha_ni xsaveopt xsavec xgetbv1 xsavs split_lock_detect user_shstk avx_vnni dtherm ida arat pln pts hwp hwp_notify hwp_act_window hwp_epp hwp_pkg_req hfi vnmi umip pku ospke waitpkg gfni vaes vpclmulqdq rdpid moviri movdir64b fsrm md_clear serialize arch_lbr ibt flush_l1d arch_capabilities",
//           "vmx flags\t: vnmi preemption_timer posted_intr invvpid ept_x_only ept_ad ept_1gb flexpriority apicv tsc_offset vtpr mtf vapic ept vpid unrestricted_guest vapic_regvid ple shadow_vmcs ept_mode_based_exec tsc_scaling usr_wait_pause",
//           "bugs\t\t: spectre_v1 spectre_v2 spec_store_bypass swapgs eibrs_pbrsb rfds bhi",
//           "bogomips\t: 5222.40",
//           "clflush size\t: 64",
//           "cache_alignment\t: 64",
//           "address sizes\t: 39 bits physical, 48 bits virtual",
//           "power management:",
//           "",
//           "processor\t: 9",
//           "vendor_id\t: GenuineIntel",
//           "cpu family\t: 6",
//           "model\t\t: 154",
//           "model name\t: 12th Gen Intel(R) Core(TM) i7-1255U",
//           "stepping\t: 4",
//           "microcode\t: 0x433",
//           "cpu MHz\t\t: 3500.011",
//           "cache size\t: 12288 KB",
//           "physical id\t: 0",
//           "siblings\t: 12",
//           "core id\t\t: 13",
//           "cpu cores\t: 10",
//           "apicid\t\t: 26",
//           "initial apicid\t: 26",
//           "fpu\t\t: yes",
//           "fpu_exception\t: yes",
//           "cpuid level\t: 32",
//           "wp\t\t: yes",
//           "flags\t\t: fpu vme de pse tsc msr pae mce cx8 apic sep mtrr pge mca cmov pat pse36 clflush dts acpi mmx fxsr sse sse2 ss ht tm pbe syscall nx pdpe1gb rdtscp lm contant_tsc art arch_perfmon pebs bts rep_good nopl xtopology nonstop_tsc cpuid aperfmperf tsc_known_freq pni pclmulqdq dtes64 monitor ds_cpl vmx smx est tm2 ssse3 sdbg fma cx16 xpr pdcm sse4_1 sse4_2 x2apic movbe popcnt tsc_deadline_timer aes xsave avx f16c rdrand lahf_lm abm 3dnowprefetch cpuid_fault epb cat_l2 cdp_l2 ssbd ibrs ibpb stibp ibrs_enhance tpr_shadow flexpriority ept vpid ept_ad fsgsbase tsc_adjust bmi1 avx2 smep bmi2 erms invpcid rdt_a rdseed adx smap clflushopt clwb intel_pt sha_ni xsaveopt xsavec xgetbv1 xsavs split_lock_detect user_shstk avx_vnni dtherm ida arat pln pts hwp hwp_notify hwp_act_window hwp_epp hwp_pkg_req hfi vnmi umip pku ospke waitpkg gfni vaes vpclmulqdq rdpid moviri movdir64b fsrm md_clear serialize arch_lbr ibt flush_l1d arch_capabilities",
//           "vmx flags\t: vnmi preemption_timer posted_intr invvpid ept_x_only ept_ad ept_1gb flexpriority apicv tsc_offset vtpr mtf vapic ept vpid unrestricted_guest vapic_regvid ple shadow_vmcs ept_mode_based_exec tsc_scaling usr_wait_pause",
//           "bugs\t\t: spectre_v1 spectre_v2 spec_store_bypass swapgs eibrs_pbrsb rfds bhi",
//           "bogomips\t: 5222.40",
//           "clflush size\t: 64",
//           "cache_alignment\t: 64",
//           "address sizes\t: 39 bits physical, 48 bits virtual",
//           "power management:",
//           "",
//           "processor\t: 10",
//           "vendor_id\t: GenuineIntel",
//           "cpu family\t: 6",
//           "model\t\t: 154",
//           "model name\t: 12th Gen Intel(R) Core(TM) i7-1255U",
//           "stepping\t: 4",
//           "microcode\t: 0x433",
//           "cpu MHz\t\t: 3499.934",
//           "cache size\t: 12288 KB",
//           "physical id\t: 0",
//           "siblings\t: 12",
//           "core id\t\t: 14",
//           "cpu cores\t: 10",
//           "apicid\t\t: 28",
//           "initial apicid\t: 28",
//           "fpu\t\t: yes",
//           "fpu_exception\t: yes",
//           "cpuid level\t: 32",
//           "wp\t\t: yes",
//           "flags\t\t: fpu vme de pse tsc msr pae mce cx8 apic sep mtrr pge mca cmov pat pse36 clflush dts acpi mmx fxsr sse sse2 ss ht tm pbe syscall nx pdpe1gb rdtscp lm contant_tsc art arch_perfmon pebs bts rep_good nopl xtopology nonstop_tsc cpuid aperfmperf tsc_known_freq pni pclmulqdq dtes64 monitor ds_cpl vmx smx est tm2 ssse3 sdbg fma cx16 xpr pdcm sse4_1 sse4_2 x2apic movbe popcnt tsc_deadline_timer aes xsave avx f16c rdrand lahf_lm abm 3dnowprefetch cpuid_fault epb cat_l2 cdp_l2 ssbd ibrs ibpb stibp ibrs_enhance tpr_shadow flexpriority ept vpid ept_ad fsgsbase tsc_adjust bmi1 avx2 smep bmi2 erms invpcid rdt_a rdseed adx smap clflushopt clwb intel_pt sha_ni xsaveopt xsavec xgetbv1 xsavs split_lock_detect user_shstk avx_vnni dtherm ida arat pln pts hwp hwp_notify hwp_act_window hwp_epp hwp_pkg_req hfi vnmi umip pku ospke waitpkg gfni vaes vpclmulqdq rdpid moviri movdir64b fsrm md_clear serialize arch_lbr ibt flush_l1d arch_capabilities",
//           "vmx flags\t: vnmi preemption_timer posted_intr invvpid ept_x_only ept_ad ept_1gb flexpriority apicv tsc_offset vtpr mtf vapic ept vpid unrestricted_guest vapic_regvid ple shadow_vmcs ept_mode_based_exec tsc_scaling usr_wait_pause",
//           "bugs\t\t: spectre_v1 spectre_v2 spec_store_bypass swapgs eibrs_pbrsb rfds bhi",
//           "bogomips\t: 5222.40",
//           "clflush size\t: 64",
//           "cache_alignment\t: 64",
//           "address sizes\t: 39 bits physical, 48 bits virtual",
//           "power management:",
//           "",
//           "processor\t: 11",
//           "vendor_id\t: GenuineIntel",
//           "cpu family\t: 6",
//           "model\t\t: 154",
//           "model name\t: 12th Gen Intel(R) Core(TM) i7-1255U",
//           "stepping\t: 4",
//           "microcode\t: 0x433",
//           "cpu MHz\t\t: 3500.179",
//           "cache size\t: 12288 KB",
//           "physical id\t: 0",
//           "siblings\t: 12",
//           "core id\t\t: 15",
//           "cpu cores\t: 10",
//           "apicid\t\t: 30",
//           "initial apicid\t: 30",
//           "fpu\t\t: yes",
//           "fpu_exception\t: yes",
//           "cpuid level\t: 32",
//           "wp\t\t: yes",
//           "flags\t\t: fpu vme de pse tsc msr pae mce cx8 apic sep mtrr pge mca cmov pat pse36 clflush dts acpi mmx fxsr sse sse2 ss ht tm pbe syscall nx pdpe1gb rdtscp lm contant_tsc art arch_perfmon pebs bts rep_good nopl xtopology nonstop_tsc cpuid aperfmperf tsc_known_freq pni pclmulqdq dtes64 monitor ds_cpl vmx smx est tm2 ssse3 sdbg fma cx16 xpr pdcm sse4_1 sse4_2 x2apic movbe popcnt tsc_deadline_timer aes xsave avx f16c rdrand lahf_lm abm 3dnowprefetch cpuid_fault epb cat_l2 cdp_l2 ssbd ibrs ibpb stibp ibrs_enhance tpr_shadow flexpriority ept vpid ept_ad fsgsbase tsc_adjust bmi1 avx2 smep bmi2 erms invpcid rdt_a rdseed adx smap clflushopt clwb intel_pt sha_ni xsaveopt xsavec xgetbv1 xsavs split_lock_detect user_shstk avx_vnni dtherm ida arat pln pts hwp hwp_notify hwp_act_window hwp_epp hwp_pkg_req hfi vnmi umip pku ospke waitpkg gfni vaes vpclmulqdq rdpid moviri movdir64b fsrm md_clear serialize arch_lbr ibt flush_l1d arch_capabilities",
//           "vmx flags\t: vnmi preemption_timer posted_intr invvpid ept_x_only ept_ad ept_1gb flexpriority apicv tsc_offset vtpr mtf vapic ept vpid unrestricted_guest vapic_regvid ple shadow_vmcs ept_mode_based_exec tsc_scaling usr_wait_pause",
//           "bugs\t\t: spectre_v1 spectre_v2 spec_store_bypass swapgs eibrs_pbrsb rfds bhi",
//           "bogomips\t: 5222.40",
//           "clflush size\t: 64",
//           "cache_alignment\t: 64",
//           "address sizes\t: 39 bits physical, 48 bits virtual",
//           "power management:"];
//         myType = "Cloud";
//         myGroups =  ["cloud-nodes"];
//         myEpoch = (Number(Number(currentEpoch)).toFixed(3));
//         myIcon = "pi pi-cloud";
//         myLastUpdate = "2024-10-10:21:50:22";
//         myUptime = (Number(Number("3279890.20")/3600)).toFixed(3);

//         myServer = this.setTestServer(myCPU, myEpoch, myGroups, myhostname, myIcon, myLastUpdate, myStatus, myType, myUptime);

//         // console.log("--------- myServer1  ---------");
//         // console.log(myServer1);
        
//         postsArray.push(myServer);

//         this.hosts.push(myhostname);
        
//         myhostname = "ubuntu-node02";
//         myCPU = [
//           "processor\t: 0",
//           "vendor_id\t: GenuineIntel",
//           "cpu family\t: 6",
//           "model\t\t: 154",
//           "model name\t: 12th Gen Intel(R) Core(TM) i7-1255U",
//           "stepping\t: 4",
//           "microcode\t: 0x433",
//           "cpu MHz\t\t: 4491.204",
//           "cache size\t: 12288 KB",
//           "physical id\t: 0",
//           "siblings\t: 12",
//           "core id\t\t: 0",
//           "cpu cores\t: 10",
//           "apicid\t\t: 0",
//           "initial apicid\t: 0",
//           "fpu\t\t: yes",
//           "fpu_exception\t: yes",
//           "cpuid level\t: 32",
//           "wp\t\t: yes",
//           "flags\t\t: fpu vme de pse tsc msr pae mce cx8 apic sep mtrr pge mca cmov pat pse36 clflush dts acpi mmx fxsr sse sse2 ss ht tm pbe syscall nx pdpe1gb rdtscp lm contant_tsc art arch_perfmon pebs bts rep_good nopl xtopology nonstop_tsc cpuid aperfmperf tsc_known_freq pni pclmulqdq dtes64 monitor ds_cpl vmx smx est tm2 ssse3 sdbg fma cx16 xpr pdcm sse4_1 sse4_2 x2apic movbe popcnt tsc_deadline_timer aes xsave avx f16c rdrand lahf_lm abm 3dnowprefetch cpuid_fault epb cat_l2 cdp_l2 ssbd ibrs ibpb stibp ibrs_enhance tpr_shadow flexpriority ept vpid ept_ad fsgsbase tsc_adjust bmi1 avx2 smep bmi2 erms invpcid rdt_a rdseed adx smap clflushopt clwb intel_pt sha_ni xsaveopt xsavec xgetbv1 xsavs split_lock_detect user_shstk avx_vnni dtherm ida arat pln pts hwp hwp_notify hwp_act_window hwp_epp hwp_pkg_req hfi vnmi umip pku ospke waitpkg gfni vaes vpclmulqdq rdpid moviri movdir64b fsrm md_clear serialize arch_lbr ibt flush_l1d arch_capabilities",
//           "vmx flags\t: vnmi preemption_timer posted_intr invvpid ept_x_only ept_ad ept_1gb flexpriority apicv tsc_offset vtpr mtf vapic ept vpid unrestricted_guest vapic_regvid ple shadow_vmcs ept_mode_based_exec tsc_scaling usr_wait_pause",
//           "bugs\t\t: spectre_v1 spectre_v2 spec_store_bypass swapgs eibrs_pbrsb rfds bhi",
//           "bogomips\t: 5222.40",
//           "clflush size\t: 64",
//           "cache_alignment\t: 64",
//           "address sizes\t: 39 bits physical, 48 bits virtual",
//           "power management:",
//           "",
//           "processor\t: 1",
//           "vendor_id\t: GenuineIntel",
//           "cpu family\t: 6",
//           "model\t\t: 154",
//           "model name\t: 12th Gen Intel(R) Core(TM) i7-1255U",
//           "stepping\t: 4",
//           "microcode\t: 0x433",
//           "cpu MHz\t\t: 4094.289",
//           "cache size\t: 12288 KB",
//           "physical id\t: 0",
//           "siblings\t: 12",
//           "core id\t\t: 0",
//           "cpu cores\t: 10",
//           "apicid\t\t: 1",
//           "initial apicid\t: 1",
//           "fpu\t\t: yes",
//           "fpu_exception\t: yes",
//           "cpuid level\t: 32",
//           "wp\t\t: yes",
//           "flags\t\t: fpu vme de pse tsc msr pae mce cx8 apic sep mtrr pge mca cmov pat pse36 clflush dts acpi mmx fxsr sse sse2 ss ht tm pbe syscall nx pdpe1gb rdtscp lm contant_tsc art arch_perfmon pebs bts rep_good nopl xtopology nonstop_tsc cpuid aperfmperf tsc_known_freq pni pclmulqdq dtes64 monitor ds_cpl vmx smx est tm2 ssse3 sdbg fma cx16 xpr pdcm sse4_1 sse4_2 x2apic movbe popcnt tsc_deadline_timer aes xsave avx f16c rdrand lahf_lm abm 3dnowprefetch cpuid_fault epb cat_l2 cdp_l2 ssbd ibrs ibpb stibp ibrs_enhance tpr_shadow flexpriority ept vpid ept_ad fsgsbase tsc_adjust bmi1 avx2 smep bmi2 erms invpcid rdt_a rdseed adx smap clflushopt clwb intel_pt sha_ni xsaveopt xsavec xgetbv1 xsavs split_lock_detect user_shstk avx_vnni dtherm ida arat pln pts hwp hwp_notify hwp_act_window hwp_epp hwp_pkg_req hfi vnmi umip pku ospke waitpkg gfni vaes vpclmulqdq rdpid moviri movdir64b fsrm md_clear serialize arch_lbr ibt flush_l1d arch_capabilities",
//           "vmx flags\t: vnmi preemption_timer posted_intr invvpid ept_x_only ept_ad ept_1gb flexpriority apicv tsc_offset vtpr mtf vapic ept vpid unrestricted_guest vapic_regvid ple shadow_vmcs ept_mode_based_exec tsc_scaling usr_wait_pause",
//           "bugs\t\t: spectre_v1 spectre_v2 spec_store_bypass swapgs eibrs_pbrsb rfds bhi",
//           "bogomips\t: 5222.40",
//           "clflush size\t: 64",
//           "cache_alignment\t: 64",
//           "address sizes\t: 39 bits physical, 48 bits virtual",
//           "power management:",
//           "",
//           "processor\t: 2",
//           "vendor_id\t: GenuineIntel",
//           "cpu family\t: 6",
//           "model\t\t: 154",
//           "model name\t: 12th Gen Intel(R) Core(TM) i7-1255U",
//           "stepping\t: 4",
//           "microcode\t: 0x433",
//           "cpu MHz\t\t: 3838.802",
//           "cache size\t: 12288 KB",
//           "physical id\t: 0",
//           "siblings\t: 12",
//           "core id\t\t: 4",
//           "cpu cores\t: 10",
//           "apicid\t\t: 8",
//           "initial apicid\t: 8",
//           "fpu\t\t: yes",
//           "fpu_exception\t: yes",
//           "cpuid level\t: 32",
//           "wp\t\t: yes",
//           "flags\t\t: fpu vme de pse tsc msr pae mce cx8 apic sep mtrr pge mca cmov pat pse36 clflush dts acpi mmx fxsr sse sse2 ss ht tm pbe syscall nx pdpe1gb rdtscp lm contant_tsc art arch_perfmon pebs bts rep_good nopl xtopology nonstop_tsc cpuid aperfmperf tsc_known_freq pni pclmulqdq dtes64 monitor ds_cpl vmx smx est tm2 ssse3 sdbg fma cx16 xpr pdcm sse4_1 sse4_2 x2apic movbe popcnt tsc_deadline_timer aes xsave avx f16c rdrand lahf_lm abm 3dnowprefetch cpuid_fault epb cat_l2 cdp_l2 ssbd ibrs ibpb stibp ibrs_enhance tpr_shadow flexpriority ept vpid ept_ad fsgsbase tsc_adjust bmi1 avx2 smep bmi2 erms invpcid rdt_a rdseed adx smap clflushopt clwb intel_pt sha_ni xsaveopt xsavec xgetbv1 xsavs split_lock_detect user_shstk avx_vnni dtherm ida arat pln pts hwp hwp_notify hwp_act_window hwp_epp hwp_pkg_req hfi vnmi umip pku ospke waitpkg gfni vaes vpclmulqdq rdpid moviri movdir64b fsrm md_clear serialize arch_lbr ibt flush_l1d arch_capabilities",
//           "vmx flags\t: vnmi preemption_timer posted_intr invvpid ept_x_only ept_ad ept_1gb flexpriority apicv tsc_offset vtpr mtf vapic ept vpid unrestricted_guest vapic_regvid ple shadow_vmcs ept_mode_based_exec tsc_scaling usr_wait_pause",
//           "bugs\t\t: spectre_v1 spectre_v2 spec_store_bypass swapgs eibrs_pbrsb rfds bhi",
//           "bogomips\t: 5222.40",
//           "clflush size\t: 64",
//           "cache_alignment\t: 64",
//           "address sizes\t: 39 bits physical, 48 bits virtual",
//           "power management:",
//           "",
//           "processor\t: 3",
//           "vendor_id\t: GenuineIntel",
//           "cpu family\t: 6",
//           "model\t\t: 154",
//           "model name\t: 12th Gen Intel(R) Core(TM) i7-1255U",
//           "stepping\t: 4",
//           "microcode\t: 0x433",
//           "cpu MHz\t\t: 400.000",
//           "cache size\t: 12288 KB",
//           "physical id\t: 0",
//           "siblings\t: 12",
//           "core id\t\t: 4",
//           "cpu cores\t: 10",
//           "apicid\t\t: 9",
//           "initial apicid\t: 9",
//           "fpu\t\t: yes",
//           "fpu_exception\t: yes",
//           "cpuid level\t: 32",
//           "wp\t\t: yes",
//           "flags\t\t: fpu vme de pse tsc msr pae mce cx8 apic sep mtrr pge mca cmov pat pse36 clflush dts acpi mmx fxsr sse sse2 ss ht tm pbe syscall nx pdpe1gb rdtscp lm contant_tsc art arch_perfmon pebs bts rep_good nopl xtopology nonstop_tsc cpuid aperfmperf tsc_known_freq pni pclmulqdq dtes64 monitor ds_cpl vmx smx est tm2 ssse3 sdbg fma cx16 xpr pdcm sse4_1 sse4_2 x2apic movbe popcnt tsc_deadline_timer aes xsave avx f16c rdrand lahf_lm abm 3dnowprefetch cpuid_fault epb cat_l2 cdp_l2 ssbd ibrs ibpb stibp ibrs_enhance tpr_shadow flexpriority ept vpid ept_ad fsgsbase tsc_adjust bmi1 avx2 smep bmi2 erms invpcid rdt_a rdseed adx smap clflushopt clwb intel_pt sha_ni xsaveopt xsavec xgetbv1 xsavs split_lock_detect user_shstk avx_vnni dtherm ida arat pln pts hwp hwp_notify hwp_act_window hwp_epp hwp_pkg_req hfi vnmi umip pku ospke waitpkg gfni vaes vpclmulqdq rdpid moviri movdir64b fsrm md_clear serialize arch_lbr ibt flush_l1d arch_capabilities",
//           "vmx flags\t: vnmi preemption_timer posted_intr invvpid ept_x_only ept_ad ept_1gb flexpriority apicv tsc_offset vtpr mtf vapic ept vpid unrestricted_guest vapic_regvid ple shadow_vmcs ept_mode_based_exec tsc_scaling usr_wait_pause",
//           "bugs\t\t: spectre_v1 spectre_v2 spec_store_bypass swapgs eibrs_pbrsb rfds bhi",
//           "bogomips\t: 5222.40",
//           "clflush size\t: 64",
//           "cache_alignment\t: 64",
//           "address sizes\t: 39 bits physical, 48 bits virtual",
//           "power management:",
//           "",
//           "processor\t: 4",
//           "vendor_id\t: GenuineIntel",
//           "cpu family\t: 6",
//           "model\t\t: 154",
//           "model name\t: 12th Gen Intel(R) Core(TM) i7-1255U",
//           "stepping\t: 4",
//           "microcode\t: 0x433",
//           "cpu MHz\t\t: 3500.003",
//           "cache size\t: 12288 KB",
//           "physical id\t: 0",
//           "siblings\t: 12",
//           "core id\t\t: 8",
//           "cpu cores\t: 10",
//           "apicid\t\t: 16",
//           "initial apicid\t: 16",
//           "fpu\t\t: yes",
//           "fpu_exception\t: yes",
//           "cpuid level\t: 32",
//           "wp\t\t: yes",
//           "flags\t\t: fpu vme de pse tsc msr pae mce cx8 apic sep mtrr pge mca cmov pat pse36 clflush dts acpi mmx fxsr sse sse2 ss ht tm pbe syscall nx pdpe1gb rdtscp lm contant_tsc art arch_perfmon pebs bts rep_good nopl xtopology nonstop_tsc cpuid aperfmperf tsc_known_freq pni pclmulqdq dtes64 monitor ds_cpl vmx smx est tm2 ssse3 sdbg fma cx16 xpr pdcm sse4_1 sse4_2 x2apic movbe popcnt tsc_deadline_timer aes xsave avx f16c rdrand lahf_lm abm 3dnowprefetch cpuid_fault epb cat_l2 cdp_l2 ssbd ibrs ibpb stibp ibrs_enhance tpr_shadow flexpriority ept vpid ept_ad fsgsbase tsc_adjust bmi1 avx2 smep bmi2 erms invpcid rdt_a rdseed adx smap clflushopt clwb intel_pt sha_ni xsaveopt xsavec xgetbv1 xsavs split_lock_detect user_shstk avx_vnni dtherm ida arat pln pts hwp hwp_notify hwp_act_window hwp_epp hwp_pkg_req hfi vnmi umip pku ospke waitpkg gfni vaes vpclmulqdq rdpid moviri movdir64b fsrm md_clear serialize arch_lbr ibt flush_l1d arch_capabilities",
//           "vmx flags\t: vnmi preemption_timer posted_intr invvpid ept_x_only ept_ad ept_1gb flexpriority apicv tsc_offset vtpr mtf vapic ept vpid unrestricted_guest vapic_regvid ple shadow_vmcs ept_mode_based_exec tsc_scaling usr_wait_pause",
//           "bugs\t\t: spectre_v1 spectre_v2 spec_store_bypass swapgs eibrs_pbrsb rfds bhi",
//           "bogomips\t: 5222.40",
//           "clflush size\t: 64",
//           "cache_alignment\t: 64",
//           "address sizes\t: 39 bits physical, 48 bits virtual",
//           "power management:",
//           "",
//           "processor\t: 5",
//           "vendor_id\t: GenuineIntel",
//           "cpu family\t: 6",
//           "model\t\t: 154",
//           "model name\t: 12th Gen Intel(R) Core(TM) i7-1255U",
//           "stepping\t: 4",
//           "microcode\t: 0x433",
//           "cpu MHz\t\t: 3498.771",
//           "cache size\t: 12288 KB",
//           "physical id\t: 0",
//           "siblings\t: 12",
//           "core id\t\t: 9",
//           "cpu cores\t: 10",
//           "apicid\t\t: 18",
//           "initial apicid\t: 18",
//           "fpu\t\t: yes",
//           "fpu_exception\t: yes",
//           "cpuid level\t: 32",
//           "wp\t\t: yes",
//           "flags\t\t: fpu vme de pse tsc msr pae mce cx8 apic sep mtrr pge mca cmov pat pse36 clflush dts acpi mmx fxsr sse sse2 ss ht tm pbe syscall nx pdpe1gb rdtscp lm contant_tsc art arch_perfmon pebs bts rep_good nopl xtopology nonstop_tsc cpuid aperfmperf tsc_known_freq pni pclmulqdq dtes64 monitor ds_cpl vmx smx est tm2 ssse3 sdbg fma cx16 xpr pdcm sse4_1 sse4_2 x2apic movbe popcnt tsc_deadline_timer aes xsave avx f16c rdrand lahf_lm abm 3dnowprefetch cpuid_fault epb cat_l2 cdp_l2 ssbd ibrs ibpb stibp ibrs_enhance tpr_shadow flexpriority ept vpid ept_ad fsgsbase tsc_adjust bmi1 avx2 smep bmi2 erms invpcid rdt_a rdseed adx smap clflushopt clwb intel_pt sha_ni xsaveopt xsavec xgetbv1 xsavs split_lock_detect user_shstk avx_vnni dtherm ida arat pln pts hwp hwp_notify hwp_act_window hwp_epp hwp_pkg_req hfi vnmi umip pku ospke waitpkg gfni vaes vpclmulqdq rdpid moviri movdir64b fsrm md_clear serialize arch_lbr ibt flush_l1d arch_capabilities",
//           "vmx flags\t: vnmi preemption_timer posted_intr invvpid ept_x_only ept_ad ept_1gb flexpriority apicv tsc_offset vtpr mtf vapic ept vpid unrestricted_guest vapic_regvid ple shadow_vmcs ept_mode_based_exec tsc_scaling usr_wait_pause",
//           "bugs\t\t: spectre_v1 spectre_v2 spec_store_bypass swapgs eibrs_pbrsb rfds bhi",
//           "bogomips\t: 5222.40",
//           "clflush size\t: 64",
//           "cache_alignment\t: 64",
//           "address sizes\t: 39 bits physical, 48 bits virtual",
//           "power management:",
//           "",
//           "processor\t: 6",
//           "vendor_id\t: GenuineIntel",
//           "cpu family\t: 6",
//           "model\t\t: 154",
//           "model name\t: 12th Gen Intel(R) Core(TM) i7-1255U",
//           "stepping\t: 4",
//           "microcode\t: 0x433",
//           "cpu MHz\t\t: 3501.847",
//           "cache size\t: 12288 KB",
//           "physical id\t: 0",
//           "siblings\t: 12",
//           "core id\t\t: 10",
//           "cpu cores\t: 10",
//           "apicid\t\t: 20",
//           "initial apicid\t: 20",
//           "fpu\t\t: yes",
//           "fpu_exception\t: yes",
//           "cpuid level\t: 32",
//           "wp\t\t: yes",
//           "flags\t\t: fpu vme de pse tsc msr pae mce cx8 apic sep mtrr pge mca cmov pat pse36 clflush dts acpi mmx fxsr sse sse2 ss ht tm pbe syscall nx pdpe1gb rdtscp lm contant_tsc art arch_perfmon pebs bts rep_good nopl xtopology nonstop_tsc cpuid aperfmperf tsc_known_freq pni pclmulqdq dtes64 monitor ds_cpl vmx smx est tm2 ssse3 sdbg fma cx16 xpr pdcm sse4_1 sse4_2 x2apic movbe popcnt tsc_deadline_timer aes xsave avx f16c rdrand lahf_lm abm 3dnowprefetch cpuid_fault epb cat_l2 cdp_l2 ssbd ibrs ibpb stibp ibrs_enhance tpr_shadow flexpriority ept vpid ept_ad fsgsbase tsc_adjust bmi1 avx2 smep bmi2 erms invpcid rdt_a rdseed adx smap clflushopt clwb intel_pt sha_ni xsaveopt xsavec xgetbv1 xsavs split_lock_detect user_shstk avx_vnni dtherm ida arat pln pts hwp hwp_notify hwp_act_window hwp_epp hwp_pkg_req hfi vnmi umip pku ospke waitpkg gfni vaes vpclmulqdq rdpid moviri movdir64b fsrm md_clear serialize arch_lbr ibt flush_l1d arch_capabilities",
//           "vmx flags\t: vnmi preemption_timer posted_intr invvpid ept_x_only ept_ad ept_1gb flexpriority apicv tsc_offset vtpr mtf vapic ept vpid unrestricted_guest vapic_regvid ple shadow_vmcs ept_mode_based_exec tsc_scaling usr_wait_pause",
//           "bugs\t\t: spectre_v1 spectre_v2 spec_store_bypass swapgs eibrs_pbrsb rfds bhi",
//           "bogomips\t: 5222.40",
//           "clflush size\t: 64",
//           "cache_alignment\t: 64",
//           "address sizes\t: 39 bits physical, 48 bits virtual",
//           "power management:",
//           "",
//           "processor\t: 7",
//           "vendor_id\t: GenuineIntel",
//           "cpu family\t: 6",
//           "model\t\t: 154",
//           "model name\t: 12th Gen Intel(R) Core(TM) i7-1255U",
//           "stepping\t: 4",
//           "microcode\t: 0x433",
//           "cpu MHz\t\t: 3500.041",
//           "cache size\t: 12288 KB",
//           "physical id\t: 0",
//           "siblings\t: 12",
//           "core id\t\t: 11",
//           "cpu cores\t: 10",
//           "apicid\t\t: 22",
//           "initial apicid\t: 22",
//           "fpu\t\t: yes",
//           "fpu_exception\t: yes",
//           "cpuid level\t: 32",
//           "wp\t\t: yes",
//           "flags\t\t: fpu vme de pse tsc msr pae mce cx8 apic sep mtrr pge mca cmov pat pse36 clflush dts acpi mmx fxsr sse sse2 ss ht tm pbe syscall nx pdpe1gb rdtscp lm contant_tsc art arch_perfmon pebs bts rep_good nopl xtopology nonstop_tsc cpuid aperfmperf tsc_known_freq pni pclmulqdq dtes64 monitor ds_cpl vmx smx est tm2 ssse3 sdbg fma cx16 xpr pdcm sse4_1 sse4_2 x2apic movbe popcnt tsc_deadline_timer aes xsave avx f16c rdrand lahf_lm abm 3dnowprefetch cpuid_fault epb cat_l2 cdp_l2 ssbd ibrs ibpb stibp ibrs_enhance tpr_shadow flexpriority ept vpid ept_ad fsgsbase tsc_adjust bmi1 avx2 smep bmi2 erms invpcid rdt_a rdseed adx smap clflushopt clwb intel_pt sha_ni xsaveopt xsavec xgetbv1 xsavs split_lock_detect user_shstk avx_vnni dtherm ida arat pln pts hwp hwp_notify hwp_act_window hwp_epp hwp_pkg_req hfi vnmi umip pku ospke waitpkg gfni vaes vpclmulqdq rdpid moviri movdir64b fsrm md_clear serialize arch_lbr ibt flush_l1d arch_capabilities",
//           "vmx flags\t: vnmi preemption_timer posted_intr invvpid ept_x_only ept_ad ept_1gb flexpriority apicv tsc_offset vtpr mtf vapic ept vpid unrestricted_guest vapic_regvid ple shadow_vmcs ept_mode_based_exec tsc_scaling usr_wait_pause",
//           "bugs\t\t: spectre_v1 spectre_v2 spec_store_bypass swapgs eibrs_pbrsb rfds bhi",
//           "bogomips\t: 5222.40",
//           "clflush size\t: 64",
//           "cache_alignment\t: 64",
//           "address sizes\t: 39 bits physical, 48 bits virtual",
//           "power management:",
//           "",
//           "processor\t: 8",
//           "vendor_id\t: GenuineIntel",
//           "cpu family\t: 6",
//           "model\t\t: 154",
//           "model name\t: 12th Gen Intel(R) Core(TM) i7-1255U",
//           "stepping\t: 4",
//           "microcode\t: 0x433",
//           "cpu MHz\t\t: 3500.111",
//           "cache size\t: 12288 KB",
//           "physical id\t: 0",
//           "siblings\t: 12",
//           "core id\t\t: 12",
//           "cpu cores\t: 10",
//           "apicid\t\t: 24",
//           "initial apicid\t: 24",
//           "fpu\t\t: yes",
//           "fpu_exception\t: yes",
//           "cpuid level\t: 32",
//           "wp\t\t: yes",
//           "flags\t\t: fpu vme de pse tsc msr pae mce cx8 apic sep mtrr pge mca cmov pat pse36 clflush dts acpi mmx fxsr sse sse2 ss ht tm pbe syscall nx pdpe1gb rdtscp lm contant_tsc art arch_perfmon pebs bts rep_good nopl xtopology nonstop_tsc cpuid aperfmperf tsc_known_freq pni pclmulqdq dtes64 monitor ds_cpl vmx smx est tm2 ssse3 sdbg fma cx16 xpr pdcm sse4_1 sse4_2 x2apic movbe popcnt tsc_deadline_timer aes xsave avx f16c rdrand lahf_lm abm 3dnowprefetch cpuid_fault epb cat_l2 cdp_l2 ssbd ibrs ibpb stibp ibrs_enhance tpr_shadow flexpriority ept vpid ept_ad fsgsbase tsc_adjust bmi1 avx2 smep bmi2 erms invpcid rdt_a rdseed adx smap clflushopt clwb intel_pt sha_ni xsaveopt xsavec xgetbv1 xsavs split_lock_detect user_shstk avx_vnni dtherm ida arat pln pts hwp hwp_notify hwp_act_window hwp_epp hwp_pkg_req hfi vnmi umip pku ospke waitpkg gfni vaes vpclmulqdq rdpid moviri movdir64b fsrm md_clear serialize arch_lbr ibt flush_l1d arch_capabilities",
//           "vmx flags\t: vnmi preemption_timer posted_intr invvpid ept_x_only ept_ad ept_1gb flexpriority apicv tsc_offset vtpr mtf vapic ept vpid unrestricted_guest vapic_regvid ple shadow_vmcs ept_mode_based_exec tsc_scaling usr_wait_pause",
//           "bugs\t\t: spectre_v1 spectre_v2 spec_store_bypass swapgs eibrs_pbrsb rfds bhi",
//           "bogomips\t: 5222.40",
//           "clflush size\t: 64",
//           "cache_alignment\t: 64",
//           "address sizes\t: 39 bits physical, 48 bits virtual",
//           "power management:",
//           "",
//           "processor\t: 9",
//           "vendor_id\t: GenuineIntel",
//           "cpu family\t: 6",
//           "model\t\t: 154",
//           "model name\t: 12th Gen Intel(R) Core(TM) i7-1255U",
//           "stepping\t: 4",
//           "microcode\t: 0x433",
//           "cpu MHz\t\t: 3500.011",
//           "cache size\t: 12288 KB",
//           "physical id\t: 0",
//           "siblings\t: 12",
//           "core id\t\t: 13",
//           "cpu cores\t: 10",
//           "apicid\t\t: 26",
//           "initial apicid\t: 26",
//           "fpu\t\t: yes",
//           "fpu_exception\t: yes",
//           "cpuid level\t: 32",
//           "wp\t\t: yes",
//           "flags\t\t: fpu vme de pse tsc msr pae mce cx8 apic sep mtrr pge mca cmov pat pse36 clflush dts acpi mmx fxsr sse sse2 ss ht tm pbe syscall nx pdpe1gb rdtscp lm contant_tsc art arch_perfmon pebs bts rep_good nopl xtopology nonstop_tsc cpuid aperfmperf tsc_known_freq pni pclmulqdq dtes64 monitor ds_cpl vmx smx est tm2 ssse3 sdbg fma cx16 xpr pdcm sse4_1 sse4_2 x2apic movbe popcnt tsc_deadline_timer aes xsave avx f16c rdrand lahf_lm abm 3dnowprefetch cpuid_fault epb cat_l2 cdp_l2 ssbd ibrs ibpb stibp ibrs_enhance tpr_shadow flexpriority ept vpid ept_ad fsgsbase tsc_adjust bmi1 avx2 smep bmi2 erms invpcid rdt_a rdseed adx smap clflushopt clwb intel_pt sha_ni xsaveopt xsavec xgetbv1 xsavs split_lock_detect user_shstk avx_vnni dtherm ida arat pln pts hwp hwp_notify hwp_act_window hwp_epp hwp_pkg_req hfi vnmi umip pku ospke waitpkg gfni vaes vpclmulqdq rdpid moviri movdir64b fsrm md_clear serialize arch_lbr ibt flush_l1d arch_capabilities",
//           "vmx flags\t: vnmi preemption_timer posted_intr invvpid ept_x_only ept_ad ept_1gb flexpriority apicv tsc_offset vtpr mtf vapic ept vpid unrestricted_guest vapic_regvid ple shadow_vmcs ept_mode_based_exec tsc_scaling usr_wait_pause",
//           "bugs\t\t: spectre_v1 spectre_v2 spec_store_bypass swapgs eibrs_pbrsb rfds bhi",
//           "bogomips\t: 5222.40",
//           "clflush size\t: 64",
//           "cache_alignment\t: 64",
//           "address sizes\t: 39 bits physical, 48 bits virtual",
//           "power management:",
//           "",
//           "processor\t: 10",
//           "vendor_id\t: GenuineIntel",
//           "cpu family\t: 6",
//           "model\t\t: 154",
//           "model name\t: 12th Gen Intel(R) Core(TM) i7-1255U",
//           "stepping\t: 4",
//           "microcode\t: 0x433",
//           "cpu MHz\t\t: 3499.934",
//           "cache size\t: 12288 KB",
//           "physical id\t: 0",
//           "siblings\t: 12",
//           "core id\t\t: 14",
//           "cpu cores\t: 10",
//           "apicid\t\t: 28",
//           "initial apicid\t: 28",
//           "fpu\t\t: yes",
//           "fpu_exception\t: yes",
//           "cpuid level\t: 32",
//           "wp\t\t: yes",
//           "flags\t\t: fpu vme de pse tsc msr pae mce cx8 apic sep mtrr pge mca cmov pat pse36 clflush dts acpi mmx fxsr sse sse2 ss ht tm pbe syscall nx pdpe1gb rdtscp lm contant_tsc art arch_perfmon pebs bts rep_good nopl xtopology nonstop_tsc cpuid aperfmperf tsc_known_freq pni pclmulqdq dtes64 monitor ds_cpl vmx smx est tm2 ssse3 sdbg fma cx16 xpr pdcm sse4_1 sse4_2 x2apic movbe popcnt tsc_deadline_timer aes xsave avx f16c rdrand lahf_lm abm 3dnowprefetch cpuid_fault epb cat_l2 cdp_l2 ssbd ibrs ibpb stibp ibrs_enhance tpr_shadow flexpriority ept vpid ept_ad fsgsbase tsc_adjust bmi1 avx2 smep bmi2 erms invpcid rdt_a rdseed adx smap clflushopt clwb intel_pt sha_ni xsaveopt xsavec xgetbv1 xsavs split_lock_detect user_shstk avx_vnni dtherm ida arat pln pts hwp hwp_notify hwp_act_window hwp_epp hwp_pkg_req hfi vnmi umip pku ospke waitpkg gfni vaes vpclmulqdq rdpid moviri movdir64b fsrm md_clear serialize arch_lbr ibt flush_l1d arch_capabilities",
//           "vmx flags\t: vnmi preemption_timer posted_intr invvpid ept_x_only ept_ad ept_1gb flexpriority apicv tsc_offset vtpr mtf vapic ept vpid unrestricted_guest vapic_regvid ple shadow_vmcs ept_mode_based_exec tsc_scaling usr_wait_pause",
//           "bugs\t\t: spectre_v1 spectre_v2 spec_store_bypass swapgs eibrs_pbrsb rfds bhi",
//           "bogomips\t: 5222.40",
//           "clflush size\t: 64",
//           "cache_alignment\t: 64",
//           "address sizes\t: 39 bits physical, 48 bits virtual",
//           "power management:",
//           "",
//           "processor\t: 11",
//           "vendor_id\t: GenuineIntel",
//           "cpu family\t: 6",
//           "model\t\t: 154",
//           "model name\t: 12th Gen Intel(R) Core(TM) i7-1255U",
//           "stepping\t: 4",
//           "microcode\t: 0x433",
//           "cpu MHz\t\t: 3500.179",
//           "cache size\t: 12288 KB",
//           "physical id\t: 0",
//           "siblings\t: 12",
//           "core id\t\t: 15",
//           "cpu cores\t: 10",
//           "apicid\t\t: 30",
//           "initial apicid\t: 30",
//           "fpu\t\t: yes",
//           "fpu_exception\t: yes",
//           "cpuid level\t: 32",
//           "wp\t\t: yes",
//           "flags\t\t: fpu vme de pse tsc msr pae mce cx8 apic sep mtrr pge mca cmov pat pse36 clflush dts acpi mmx fxsr sse sse2 ss ht tm pbe syscall nx pdpe1gb rdtscp lm contant_tsc art arch_perfmon pebs bts rep_good nopl xtopology nonstop_tsc cpuid aperfmperf tsc_known_freq pni pclmulqdq dtes64 monitor ds_cpl vmx smx est tm2 ssse3 sdbg fma cx16 xpr pdcm sse4_1 sse4_2 x2apic movbe popcnt tsc_deadline_timer aes xsave avx f16c rdrand lahf_lm abm 3dnowprefetch cpuid_fault epb cat_l2 cdp_l2 ssbd ibrs ibpb stibp ibrs_enhance tpr_shadow flexpriority ept vpid ept_ad fsgsbase tsc_adjust bmi1 avx2 smep bmi2 erms invpcid rdt_a rdseed adx smap clflushopt clwb intel_pt sha_ni xsaveopt xsavec xgetbv1 xsavs split_lock_detect user_shstk avx_vnni dtherm ida arat pln pts hwp hwp_notify hwp_act_window hwp_epp hwp_pkg_req hfi vnmi umip pku ospke waitpkg gfni vaes vpclmulqdq rdpid moviri movdir64b fsrm md_clear serialize arch_lbr ibt flush_l1d arch_capabilities",
//           "vmx flags\t: vnmi preemption_timer posted_intr invvpid ept_x_only ept_ad ept_1gb flexpriority apicv tsc_offset vtpr mtf vapic ept vpid unrestricted_guest vapic_regvid ple shadow_vmcs ept_mode_based_exec tsc_scaling usr_wait_pause",
//           "bugs\t\t: spectre_v1 spectre_v2 spec_store_bypass swapgs eibrs_pbrsb rfds bhi",
//           "bogomips\t: 5222.40",
//           "clflush size\t: 64",
//           "cache_alignment\t: 64",
//           "address sizes\t: 39 bits physical, 48 bits virtual",
//           "power management:"];
//         myType = "Cloud";
//         myGroups =  ["cloud-nodes"];
//         myEpoch = (Number(Number(currentEpoch)).toFixed(3));
//         myIcon = "pi pi-cloud";
//         myLastUpdate = "2024-10-10:21:50:22";
//         myUptime = (Number(Number("3279890.20")/3600)).toFixed(3);
        
//         myServer = this.setTestServer(myCPU, myEpoch, myGroups, myhostname, myIcon, myLastUpdate, myStatus, myType, myUptime);

        
//         // console.log("--------- myServer 2 ---------");
//         postsArray.push(myServer);

//         this.hosts.push(myhostname);
        
//         myhostname = "ubuntu-node03";
//         myCPU = [
//           "processor\t: 0",
//           "vendor_id\t: GenuineIntel",
//           "cpu family\t: 6",
//           "model\t\t: 154",
//           "model name\t: 12th Gen Intel(R) Core(TM) i7-1255U",
//           "stepping\t: 4",
//           "microcode\t: 0x433",
//           "cpu MHz\t\t: 4491.204",
//           "cache size\t: 12288 KB",
//           "physical id\t: 0",
//           "siblings\t: 12",
//           "core id\t\t: 0",
//           "cpu cores\t: 10",
//           "apicid\t\t: 0",
//           "initial apicid\t: 0",
//           "fpu\t\t: yes",
//           "fpu_exception\t: yes",
//           "cpuid level\t: 32",
//           "wp\t\t: yes",
//           "flags\t\t: fpu vme de pse tsc msr pae mce cx8 apic sep mtrr pge mca cmov pat pse36 clflush dts acpi mmx fxsr sse sse2 ss ht tm pbe syscall nx pdpe1gb rdtscp lm contant_tsc art arch_perfmon pebs bts rep_good nopl xtopology nonstop_tsc cpuid aperfmperf tsc_known_freq pni pclmulqdq dtes64 monitor ds_cpl vmx smx est tm2 ssse3 sdbg fma cx16 xpr pdcm sse4_1 sse4_2 x2apic movbe popcnt tsc_deadline_timer aes xsave avx f16c rdrand lahf_lm abm 3dnowprefetch cpuid_fault epb cat_l2 cdp_l2 ssbd ibrs ibpb stibp ibrs_enhance tpr_shadow flexpriority ept vpid ept_ad fsgsbase tsc_adjust bmi1 avx2 smep bmi2 erms invpcid rdt_a rdseed adx smap clflushopt clwb intel_pt sha_ni xsaveopt xsavec xgetbv1 xsavs split_lock_detect user_shstk avx_vnni dtherm ida arat pln pts hwp hwp_notify hwp_act_window hwp_epp hwp_pkg_req hfi vnmi umip pku ospke waitpkg gfni vaes vpclmulqdq rdpid moviri movdir64b fsrm md_clear serialize arch_lbr ibt flush_l1d arch_capabilities",
//           "vmx flags\t: vnmi preemption_timer posted_intr invvpid ept_x_only ept_ad ept_1gb flexpriority apicv tsc_offset vtpr mtf vapic ept vpid unrestricted_guest vapic_regvid ple shadow_vmcs ept_mode_based_exec tsc_scaling usr_wait_pause",
//           "bugs\t\t: spectre_v1 spectre_v2 spec_store_bypass swapgs eibrs_pbrsb rfds bhi",
//           "bogomips\t: 5222.40",
//           "clflush size\t: 64",
//           "cache_alignment\t: 64",
//           "address sizes\t: 39 bits physical, 48 bits virtual",
//           "power management:",
//           "",
//           "processor\t: 1",
//           "vendor_id\t: GenuineIntel",
//           "cpu family\t: 6",
//           "model\t\t: 154",
//           "model name\t: 12th Gen Intel(R) Core(TM) i7-1255U",
//           "stepping\t: 4",
//           "microcode\t: 0x433",
//           "cpu MHz\t\t: 4094.289",
//           "cache size\t: 12288 KB",
//           "physical id\t: 0",
//           "siblings\t: 12",
//           "core id\t\t: 0",
//           "cpu cores\t: 10",
//           "apicid\t\t: 1",
//           "initial apicid\t: 1",
//           "fpu\t\t: yes",
//           "fpu_exception\t: yes",
//           "cpuid level\t: 32",
//           "wp\t\t: yes",
//           "flags\t\t: fpu vme de pse tsc msr pae mce cx8 apic sep mtrr pge mca cmov pat pse36 clflush dts acpi mmx fxsr sse sse2 ss ht tm pbe syscall nx pdpe1gb rdtscp lm contant_tsc art arch_perfmon pebs bts rep_good nopl xtopology nonstop_tsc cpuid aperfmperf tsc_known_freq pni pclmulqdq dtes64 monitor ds_cpl vmx smx est tm2 ssse3 sdbg fma cx16 xpr pdcm sse4_1 sse4_2 x2apic movbe popcnt tsc_deadline_timer aes xsave avx f16c rdrand lahf_lm abm 3dnowprefetch cpuid_fault epb cat_l2 cdp_l2 ssbd ibrs ibpb stibp ibrs_enhance tpr_shadow flexpriority ept vpid ept_ad fsgsbase tsc_adjust bmi1 avx2 smep bmi2 erms invpcid rdt_a rdseed adx smap clflushopt clwb intel_pt sha_ni xsaveopt xsavec xgetbv1 xsavs split_lock_detect user_shstk avx_vnni dtherm ida arat pln pts hwp hwp_notify hwp_act_window hwp_epp hwp_pkg_req hfi vnmi umip pku ospke waitpkg gfni vaes vpclmulqdq rdpid moviri movdir64b fsrm md_clear serialize arch_lbr ibt flush_l1d arch_capabilities",
//           "vmx flags\t: vnmi preemption_timer posted_intr invvpid ept_x_only ept_ad ept_1gb flexpriority apicv tsc_offset vtpr mtf vapic ept vpid unrestricted_guest vapic_regvid ple shadow_vmcs ept_mode_based_exec tsc_scaling usr_wait_pause",
//           "bugs\t\t: spectre_v1 spectre_v2 spec_store_bypass swapgs eibrs_pbrsb rfds bhi",
//           "bogomips\t: 5222.40",
//           "clflush size\t: 64",
//           "cache_alignment\t: 64",
//           "address sizes\t: 39 bits physical, 48 bits virtual",
//           "power management:",
//           "",
//           "processor\t: 2",
//           "vendor_id\t: GenuineIntel",
//           "cpu family\t: 6",
//           "model\t\t: 154",
//           "model name\t: 12th Gen Intel(R) Core(TM) i7-1255U",
//           "stepping\t: 4",
//           "microcode\t: 0x433",
//           "cpu MHz\t\t: 3838.802",
//           "cache size\t: 12288 KB",
//           "physical id\t: 0",
//           "siblings\t: 12",
//           "core id\t\t: 4",
//           "cpu cores\t: 10",
//           "apicid\t\t: 8",
//           "initial apicid\t: 8",
//           "fpu\t\t: yes",
//           "fpu_exception\t: yes",
//           "cpuid level\t: 32",
//           "wp\t\t: yes",
//           "flags\t\t: fpu vme de pse tsc msr pae mce cx8 apic sep mtrr pge mca cmov pat pse36 clflush dts acpi mmx fxsr sse sse2 ss ht tm pbe syscall nx pdpe1gb rdtscp lm contant_tsc art arch_perfmon pebs bts rep_good nopl xtopology nonstop_tsc cpuid aperfmperf tsc_known_freq pni pclmulqdq dtes64 monitor ds_cpl vmx smx est tm2 ssse3 sdbg fma cx16 xpr pdcm sse4_1 sse4_2 x2apic movbe popcnt tsc_deadline_timer aes xsave avx f16c rdrand lahf_lm abm 3dnowprefetch cpuid_fault epb cat_l2 cdp_l2 ssbd ibrs ibpb stibp ibrs_enhance tpr_shadow flexpriority ept vpid ept_ad fsgsbase tsc_adjust bmi1 avx2 smep bmi2 erms invpcid rdt_a rdseed adx smap clflushopt clwb intel_pt sha_ni xsaveopt xsavec xgetbv1 xsavs split_lock_detect user_shstk avx_vnni dtherm ida arat pln pts hwp hwp_notify hwp_act_window hwp_epp hwp_pkg_req hfi vnmi umip pku ospke waitpkg gfni vaes vpclmulqdq rdpid moviri movdir64b fsrm md_clear serialize arch_lbr ibt flush_l1d arch_capabilities",
//           "vmx flags\t: vnmi preemption_timer posted_intr invvpid ept_x_only ept_ad ept_1gb flexpriority apicv tsc_offset vtpr mtf vapic ept vpid unrestricted_guest vapic_regvid ple shadow_vmcs ept_mode_based_exec tsc_scaling usr_wait_pause",
//           "bugs\t\t: spectre_v1 spectre_v2 spec_store_bypass swapgs eibrs_pbrsb rfds bhi",
//           "bogomips\t: 5222.40",
//           "clflush size\t: 64",
//           "cache_alignment\t: 64",
//           "address sizes\t: 39 bits physical, 48 bits virtual",
//           "power management:",
//           "",
//           "processor\t: 3",
//           "vendor_id\t: GenuineIntel",
//           "cpu family\t: 6",
//           "model\t\t: 154",
//           "model name\t: 12th Gen Intel(R) Core(TM) i7-1255U",
//           "stepping\t: 4",
//           "microcode\t: 0x433",
//           "cpu MHz\t\t: 400.000",
//           "cache size\t: 12288 KB",
//           "physical id\t: 0",
//           "siblings\t: 12",
//           "core id\t\t: 4",
//           "cpu cores\t: 10",
//           "apicid\t\t: 9",
//           "initial apicid\t: 9",
//           "fpu\t\t: yes",
//           "fpu_exception\t: yes",
//           "cpuid level\t: 32",
//           "wp\t\t: yes",
//           "flags\t\t: fpu vme de pse tsc msr pae mce cx8 apic sep mtrr pge mca cmov pat pse36 clflush dts acpi mmx fxsr sse sse2 ss ht tm pbe syscall nx pdpe1gb rdtscp lm contant_tsc art arch_perfmon pebs bts rep_good nopl xtopology nonstop_tsc cpuid aperfmperf tsc_known_freq pni pclmulqdq dtes64 monitor ds_cpl vmx smx est tm2 ssse3 sdbg fma cx16 xpr pdcm sse4_1 sse4_2 x2apic movbe popcnt tsc_deadline_timer aes xsave avx f16c rdrand lahf_lm abm 3dnowprefetch cpuid_fault epb cat_l2 cdp_l2 ssbd ibrs ibpb stibp ibrs_enhance tpr_shadow flexpriority ept vpid ept_ad fsgsbase tsc_adjust bmi1 avx2 smep bmi2 erms invpcid rdt_a rdseed adx smap clflushopt clwb intel_pt sha_ni xsaveopt xsavec xgetbv1 xsavs split_lock_detect user_shstk avx_vnni dtherm ida arat pln pts hwp hwp_notify hwp_act_window hwp_epp hwp_pkg_req hfi vnmi umip pku ospke waitpkg gfni vaes vpclmulqdq rdpid moviri movdir64b fsrm md_clear serialize arch_lbr ibt flush_l1d arch_capabilities",
//           "vmx flags\t: vnmi preemption_timer posted_intr invvpid ept_x_only ept_ad ept_1gb flexpriority apicv tsc_offset vtpr mtf vapic ept vpid unrestricted_guest vapic_regvid ple shadow_vmcs ept_mode_based_exec tsc_scaling usr_wait_pause",
//           "bugs\t\t: spectre_v1 spectre_v2 spec_store_bypass swapgs eibrs_pbrsb rfds bhi",
//           "bogomips\t: 5222.40",
//           "clflush size\t: 64",
//           "cache_alignment\t: 64",
//           "address sizes\t: 39 bits physical, 48 bits virtual",
//           "power management:",
//           "",
//           "processor\t: 4",
//           "vendor_id\t: GenuineIntel",
//           "cpu family\t: 6",
//           "model\t\t: 154",
//           "model name\t: 12th Gen Intel(R) Core(TM) i7-1255U",
//           "stepping\t: 4",
//           "microcode\t: 0x433",
//           "cpu MHz\t\t: 3500.003",
//           "cache size\t: 12288 KB",
//           "physical id\t: 0",
//           "siblings\t: 12",
//           "core id\t\t: 8",
//           "cpu cores\t: 10",
//           "apicid\t\t: 16",
//           "initial apicid\t: 16",
//           "fpu\t\t: yes",
//           "fpu_exception\t: yes",
//           "cpuid level\t: 32",
//           "wp\t\t: yes",
//           "flags\t\t: fpu vme de pse tsc msr pae mce cx8 apic sep mtrr pge mca cmov pat pse36 clflush dts acpi mmx fxsr sse sse2 ss ht tm pbe syscall nx pdpe1gb rdtscp lm contant_tsc art arch_perfmon pebs bts rep_good nopl xtopology nonstop_tsc cpuid aperfmperf tsc_known_freq pni pclmulqdq dtes64 monitor ds_cpl vmx smx est tm2 ssse3 sdbg fma cx16 xpr pdcm sse4_1 sse4_2 x2apic movbe popcnt tsc_deadline_timer aes xsave avx f16c rdrand lahf_lm abm 3dnowprefetch cpuid_fault epb cat_l2 cdp_l2 ssbd ibrs ibpb stibp ibrs_enhance tpr_shadow flexpriority ept vpid ept_ad fsgsbase tsc_adjust bmi1 avx2 smep bmi2 erms invpcid rdt_a rdseed adx smap clflushopt clwb intel_pt sha_ni xsaveopt xsavec xgetbv1 xsavs split_lock_detect user_shstk avx_vnni dtherm ida arat pln pts hwp hwp_notify hwp_act_window hwp_epp hwp_pkg_req hfi vnmi umip pku ospke waitpkg gfni vaes vpclmulqdq rdpid moviri movdir64b fsrm md_clear serialize arch_lbr ibt flush_l1d arch_capabilities",
//           "vmx flags\t: vnmi preemption_timer posted_intr invvpid ept_x_only ept_ad ept_1gb flexpriority apicv tsc_offset vtpr mtf vapic ept vpid unrestricted_guest vapic_regvid ple shadow_vmcs ept_mode_based_exec tsc_scaling usr_wait_pause",
//           "bugs\t\t: spectre_v1 spectre_v2 spec_store_bypass swapgs eibrs_pbrsb rfds bhi",
//           "bogomips\t: 5222.40",
//           "clflush size\t: 64",
//           "cache_alignment\t: 64",
//           "address sizes\t: 39 bits physical, 48 bits virtual",
//           "power management:",
//           "",
//           "processor\t: 5",
//           "vendor_id\t: GenuineIntel",
//           "cpu family\t: 6",
//           "model\t\t: 154",
//           "model name\t: 12th Gen Intel(R) Core(TM) i7-1255U",
//           "stepping\t: 4",
//           "microcode\t: 0x433",
//           "cpu MHz\t\t: 3498.771",
//           "cache size\t: 12288 KB",
//           "physical id\t: 0",
//           "siblings\t: 12",
//           "core id\t\t: 9",
//           "cpu cores\t: 10",
//           "apicid\t\t: 18",
//           "initial apicid\t: 18",
//           "fpu\t\t: yes",
//           "fpu_exception\t: yes",
//           "cpuid level\t: 32",
//           "wp\t\t: yes",
//           "flags\t\t: fpu vme de pse tsc msr pae mce cx8 apic sep mtrr pge mca cmov pat pse36 clflush dts acpi mmx fxsr sse sse2 ss ht tm pbe syscall nx pdpe1gb rdtscp lm contant_tsc art arch_perfmon pebs bts rep_good nopl xtopology nonstop_tsc cpuid aperfmperf tsc_known_freq pni pclmulqdq dtes64 monitor ds_cpl vmx smx est tm2 ssse3 sdbg fma cx16 xpr pdcm sse4_1 sse4_2 x2apic movbe popcnt tsc_deadline_timer aes xsave avx f16c rdrand lahf_lm abm 3dnowprefetch cpuid_fault epb cat_l2 cdp_l2 ssbd ibrs ibpb stibp ibrs_enhance tpr_shadow flexpriority ept vpid ept_ad fsgsbase tsc_adjust bmi1 avx2 smep bmi2 erms invpcid rdt_a rdseed adx smap clflushopt clwb intel_pt sha_ni xsaveopt xsavec xgetbv1 xsavs split_lock_detect user_shstk avx_vnni dtherm ida arat pln pts hwp hwp_notify hwp_act_window hwp_epp hwp_pkg_req hfi vnmi umip pku ospke waitpkg gfni vaes vpclmulqdq rdpid moviri movdir64b fsrm md_clear serialize arch_lbr ibt flush_l1d arch_capabilities",
//           "vmx flags\t: vnmi preemption_timer posted_intr invvpid ept_x_only ept_ad ept_1gb flexpriority apicv tsc_offset vtpr mtf vapic ept vpid unrestricted_guest vapic_regvid ple shadow_vmcs ept_mode_based_exec tsc_scaling usr_wait_pause",
//           "bugs\t\t: spectre_v1 spectre_v2 spec_store_bypass swapgs eibrs_pbrsb rfds bhi",
//           "bogomips\t: 5222.40",
//           "clflush size\t: 64",
//           "cache_alignment\t: 64",
//           "address sizes\t: 39 bits physical, 48 bits virtual",
//           "power management:",
//           "",
//           "processor\t: 6",
//           "vendor_id\t: GenuineIntel",
//           "cpu family\t: 6",
//           "model\t\t: 154",
//           "model name\t: 12th Gen Intel(R) Core(TM) i7-1255U",
//           "stepping\t: 4",
//           "microcode\t: 0x433",
//           "cpu MHz\t\t: 3501.847",
//           "cache size\t: 12288 KB",
//           "physical id\t: 0",
//           "siblings\t: 12",
//           "core id\t\t: 10",
//           "cpu cores\t: 10",
//           "apicid\t\t: 20",
//           "initial apicid\t: 20",
//           "fpu\t\t: yes",
//           "fpu_exception\t: yes",
//           "cpuid level\t: 32",
//           "wp\t\t: yes",
//           "flags\t\t: fpu vme de pse tsc msr pae mce cx8 apic sep mtrr pge mca cmov pat pse36 clflush dts acpi mmx fxsr sse sse2 ss ht tm pbe syscall nx pdpe1gb rdtscp lm contant_tsc art arch_perfmon pebs bts rep_good nopl xtopology nonstop_tsc cpuid aperfmperf tsc_known_freq pni pclmulqdq dtes64 monitor ds_cpl vmx smx est tm2 ssse3 sdbg fma cx16 xpr pdcm sse4_1 sse4_2 x2apic movbe popcnt tsc_deadline_timer aes xsave avx f16c rdrand lahf_lm abm 3dnowprefetch cpuid_fault epb cat_l2 cdp_l2 ssbd ibrs ibpb stibp ibrs_enhance tpr_shadow flexpriority ept vpid ept_ad fsgsbase tsc_adjust bmi1 avx2 smep bmi2 erms invpcid rdt_a rdseed adx smap clflushopt clwb intel_pt sha_ni xsaveopt xsavec xgetbv1 xsavs split_lock_detect user_shstk avx_vnni dtherm ida arat pln pts hwp hwp_notify hwp_act_window hwp_epp hwp_pkg_req hfi vnmi umip pku ospke waitpkg gfni vaes vpclmulqdq rdpid moviri movdir64b fsrm md_clear serialize arch_lbr ibt flush_l1d arch_capabilities",
//           "vmx flags\t: vnmi preemption_timer posted_intr invvpid ept_x_only ept_ad ept_1gb flexpriority apicv tsc_offset vtpr mtf vapic ept vpid unrestricted_guest vapic_regvid ple shadow_vmcs ept_mode_based_exec tsc_scaling usr_wait_pause",
//           "bugs\t\t: spectre_v1 spectre_v2 spec_store_bypass swapgs eibrs_pbrsb rfds bhi",
//           "bogomips\t: 5222.40",
//           "clflush size\t: 64",
//           "cache_alignment\t: 64",
//           "address sizes\t: 39 bits physical, 48 bits virtual",
//           "power management:",
//           "",
//           "processor\t: 7",
//           "vendor_id\t: GenuineIntel",
//           "cpu family\t: 6",
//           "model\t\t: 154",
//           "model name\t: 12th Gen Intel(R) Core(TM) i7-1255U",
//           "stepping\t: 4",
//           "microcode\t: 0x433",
//           "cpu MHz\t\t: 3500.041",
//           "cache size\t: 12288 KB",
//           "physical id\t: 0",
//           "siblings\t: 12",
//           "core id\t\t: 11",
//           "cpu cores\t: 10",
//           "apicid\t\t: 22",
//           "initial apicid\t: 22",
//           "fpu\t\t: yes",
//           "fpu_exception\t: yes",
//           "cpuid level\t: 32",
//           "wp\t\t: yes",
//           "flags\t\t: fpu vme de pse tsc msr pae mce cx8 apic sep mtrr pge mca cmov pat pse36 clflush dts acpi mmx fxsr sse sse2 ss ht tm pbe syscall nx pdpe1gb rdtscp lm contant_tsc art arch_perfmon pebs bts rep_good nopl xtopology nonstop_tsc cpuid aperfmperf tsc_known_freq pni pclmulqdq dtes64 monitor ds_cpl vmx smx est tm2 ssse3 sdbg fma cx16 xpr pdcm sse4_1 sse4_2 x2apic movbe popcnt tsc_deadline_timer aes xsave avx f16c rdrand lahf_lm abm 3dnowprefetch cpuid_fault epb cat_l2 cdp_l2 ssbd ibrs ibpb stibp ibrs_enhance tpr_shadow flexpriority ept vpid ept_ad fsgsbase tsc_adjust bmi1 avx2 smep bmi2 erms invpcid rdt_a rdseed adx smap clflushopt clwb intel_pt sha_ni xsaveopt xsavec xgetbv1 xsavs split_lock_detect user_shstk avx_vnni dtherm ida arat pln pts hwp hwp_notify hwp_act_window hwp_epp hwp_pkg_req hfi vnmi umip pku ospke waitpkg gfni vaes vpclmulqdq rdpid moviri movdir64b fsrm md_clear serialize arch_lbr ibt flush_l1d arch_capabilities",
//           "vmx flags\t: vnmi preemption_timer posted_intr invvpid ept_x_only ept_ad ept_1gb flexpriority apicv tsc_offset vtpr mtf vapic ept vpid unrestricted_guest vapic_regvid ple shadow_vmcs ept_mode_based_exec tsc_scaling usr_wait_pause",
//           "bugs\t\t: spectre_v1 spectre_v2 spec_store_bypass swapgs eibrs_pbrsb rfds bhi",
//           "bogomips\t: 5222.40",
//           "clflush size\t: 64",
//           "cache_alignment\t: 64",
//           "address sizes\t: 39 bits physical, 48 bits virtual",
//           "power management:",
//           "",
//           "processor\t: 8",
//           "vendor_id\t: GenuineIntel",
//           "cpu family\t: 6",
//           "model\t\t: 154",
//           "model name\t: 12th Gen Intel(R) Core(TM) i7-1255U",
//           "stepping\t: 4",
//           "microcode\t: 0x433",
//           "cpu MHz\t\t: 3500.111",
//           "cache size\t: 12288 KB",
//           "physical id\t: 0",
//           "siblings\t: 12",
//           "core id\t\t: 12",
//           "cpu cores\t: 10",
//           "apicid\t\t: 24",
//           "initial apicid\t: 24",
//           "fpu\t\t: yes",
//           "fpu_exception\t: yes",
//           "cpuid level\t: 32",
//           "wp\t\t: yes",
//           "flags\t\t: fpu vme de pse tsc msr pae mce cx8 apic sep mtrr pge mca cmov pat pse36 clflush dts acpi mmx fxsr sse sse2 ss ht tm pbe syscall nx pdpe1gb rdtscp lm contant_tsc art arch_perfmon pebs bts rep_good nopl xtopology nonstop_tsc cpuid aperfmperf tsc_known_freq pni pclmulqdq dtes64 monitor ds_cpl vmx smx est tm2 ssse3 sdbg fma cx16 xpr pdcm sse4_1 sse4_2 x2apic movbe popcnt tsc_deadline_timer aes xsave avx f16c rdrand lahf_lm abm 3dnowprefetch cpuid_fault epb cat_l2 cdp_l2 ssbd ibrs ibpb stibp ibrs_enhance tpr_shadow flexpriority ept vpid ept_ad fsgsbase tsc_adjust bmi1 avx2 smep bmi2 erms invpcid rdt_a rdseed adx smap clflushopt clwb intel_pt sha_ni xsaveopt xsavec xgetbv1 xsavs split_lock_detect user_shstk avx_vnni dtherm ida arat pln pts hwp hwp_notify hwp_act_window hwp_epp hwp_pkg_req hfi vnmi umip pku ospke waitpkg gfni vaes vpclmulqdq rdpid moviri movdir64b fsrm md_clear serialize arch_lbr ibt flush_l1d arch_capabilities",
//           "vmx flags\t: vnmi preemption_timer posted_intr invvpid ept_x_only ept_ad ept_1gb flexpriority apicv tsc_offset vtpr mtf vapic ept vpid unrestricted_guest vapic_regvid ple shadow_vmcs ept_mode_based_exec tsc_scaling usr_wait_pause",
//           "bugs\t\t: spectre_v1 spectre_v2 spec_store_bypass swapgs eibrs_pbrsb rfds bhi",
//           "bogomips\t: 5222.40",
//           "clflush size\t: 64",
//           "cache_alignment\t: 64",
//           "address sizes\t: 39 bits physical, 48 bits virtual",
//           "power management:",
//           "",
//           "processor\t: 9",
//           "vendor_id\t: GenuineIntel",
//           "cpu family\t: 6",
//           "model\t\t: 154",
//           "model name\t: 12th Gen Intel(R) Core(TM) i7-1255U",
//           "stepping\t: 4",
//           "microcode\t: 0x433",
//           "cpu MHz\t\t: 3500.011",
//           "cache size\t: 12288 KB",
//           "physical id\t: 0",
//           "siblings\t: 12",
//           "core id\t\t: 13",
//           "cpu cores\t: 10",
//           "apicid\t\t: 26",
//           "initial apicid\t: 26",
//           "fpu\t\t: yes",
//           "fpu_exception\t: yes",
//           "cpuid level\t: 32",
//           "wp\t\t: yes",
//           "flags\t\t: fpu vme de pse tsc msr pae mce cx8 apic sep mtrr pge mca cmov pat pse36 clflush dts acpi mmx fxsr sse sse2 ss ht tm pbe syscall nx pdpe1gb rdtscp lm contant_tsc art arch_perfmon pebs bts rep_good nopl xtopology nonstop_tsc cpuid aperfmperf tsc_known_freq pni pclmulqdq dtes64 monitor ds_cpl vmx smx est tm2 ssse3 sdbg fma cx16 xpr pdcm sse4_1 sse4_2 x2apic movbe popcnt tsc_deadline_timer aes xsave avx f16c rdrand lahf_lm abm 3dnowprefetch cpuid_fault epb cat_l2 cdp_l2 ssbd ibrs ibpb stibp ibrs_enhance tpr_shadow flexpriority ept vpid ept_ad fsgsbase tsc_adjust bmi1 avx2 smep bmi2 erms invpcid rdt_a rdseed adx smap clflushopt clwb intel_pt sha_ni xsaveopt xsavec xgetbv1 xsavs split_lock_detect user_shstk avx_vnni dtherm ida arat pln pts hwp hwp_notify hwp_act_window hwp_epp hwp_pkg_req hfi vnmi umip pku ospke waitpkg gfni vaes vpclmulqdq rdpid moviri movdir64b fsrm md_clear serialize arch_lbr ibt flush_l1d arch_capabilities",
//           "vmx flags\t: vnmi preemption_timer posted_intr invvpid ept_x_only ept_ad ept_1gb flexpriority apicv tsc_offset vtpr mtf vapic ept vpid unrestricted_guest vapic_regvid ple shadow_vmcs ept_mode_based_exec tsc_scaling usr_wait_pause",
//           "bugs\t\t: spectre_v1 spectre_v2 spec_store_bypass swapgs eibrs_pbrsb rfds bhi",
//           "bogomips\t: 5222.40",
//           "clflush size\t: 64",
//           "cache_alignment\t: 64",
//           "address sizes\t: 39 bits physical, 48 bits virtual",
//           "power management:",
//           "",
//           "processor\t: 10",
//           "vendor_id\t: GenuineIntel",
//           "cpu family\t: 6",
//           "model\t\t: 154",
//           "model name\t: 12th Gen Intel(R) Core(TM) i7-1255U",
//           "stepping\t: 4",
//           "microcode\t: 0x433",
//           "cpu MHz\t\t: 3499.934",
//           "cache size\t: 12288 KB",
//           "physical id\t: 0",
//           "siblings\t: 12",
//           "core id\t\t: 14",
//           "cpu cores\t: 10",
//           "apicid\t\t: 28",
//           "initial apicid\t: 28",
//           "fpu\t\t: yes",
//           "fpu_exception\t: yes",
//           "cpuid level\t: 32",
//           "wp\t\t: yes",
//           "flags\t\t: fpu vme de pse tsc msr pae mce cx8 apic sep mtrr pge mca cmov pat pse36 clflush dts acpi mmx fxsr sse sse2 ss ht tm pbe syscall nx pdpe1gb rdtscp lm contant_tsc art arch_perfmon pebs bts rep_good nopl xtopology nonstop_tsc cpuid aperfmperf tsc_known_freq pni pclmulqdq dtes64 monitor ds_cpl vmx smx est tm2 ssse3 sdbg fma cx16 xpr pdcm sse4_1 sse4_2 x2apic movbe popcnt tsc_deadline_timer aes xsave avx f16c rdrand lahf_lm abm 3dnowprefetch cpuid_fault epb cat_l2 cdp_l2 ssbd ibrs ibpb stibp ibrs_enhance tpr_shadow flexpriority ept vpid ept_ad fsgsbase tsc_adjust bmi1 avx2 smep bmi2 erms invpcid rdt_a rdseed adx smap clflushopt clwb intel_pt sha_ni xsaveopt xsavec xgetbv1 xsavs split_lock_detect user_shstk avx_vnni dtherm ida arat pln pts hwp hwp_notify hwp_act_window hwp_epp hwp_pkg_req hfi vnmi umip pku ospke waitpkg gfni vaes vpclmulqdq rdpid moviri movdir64b fsrm md_clear serialize arch_lbr ibt flush_l1d arch_capabilities",
//           "vmx flags\t: vnmi preemption_timer posted_intr invvpid ept_x_only ept_ad ept_1gb flexpriority apicv tsc_offset vtpr mtf vapic ept vpid unrestricted_guest vapic_regvid ple shadow_vmcs ept_mode_based_exec tsc_scaling usr_wait_pause",
//           "bugs\t\t: spectre_v1 spectre_v2 spec_store_bypass swapgs eibrs_pbrsb rfds bhi",
//           "bogomips\t: 5222.40",
//           "clflush size\t: 64",
//           "cache_alignment\t: 64",
//           "address sizes\t: 39 bits physical, 48 bits virtual",
//           "power management:",
//           "",
//           "processor\t: 11",
//           "vendor_id\t: GenuineIntel",
//           "cpu family\t: 6",
//           "model\t\t: 154",
//           "model name\t: 12th Gen Intel(R) Core(TM) i7-1255U",
//           "stepping\t: 4",
//           "microcode\t: 0x433",
//           "cpu MHz\t\t: 3500.179",
//           "cache size\t: 12288 KB",
//           "physical id\t: 0",
//           "siblings\t: 12",
//           "core id\t\t: 15",
//           "cpu cores\t: 10",
//           "apicid\t\t: 30",
//           "initial apicid\t: 30",
//           "fpu\t\t: yes",
//           "fpu_exception\t: yes",
//           "cpuid level\t: 32",
//           "wp\t\t: yes",
//           "flags\t\t: fpu vme de pse tsc msr pae mce cx8 apic sep mtrr pge mca cmov pat pse36 clflush dts acpi mmx fxsr sse sse2 ss ht tm pbe syscall nx pdpe1gb rdtscp lm contant_tsc art arch_perfmon pebs bts rep_good nopl xtopology nonstop_tsc cpuid aperfmperf tsc_known_freq pni pclmulqdq dtes64 monitor ds_cpl vmx smx est tm2 ssse3 sdbg fma cx16 xpr pdcm sse4_1 sse4_2 x2apic movbe popcnt tsc_deadline_timer aes xsave avx f16c rdrand lahf_lm abm 3dnowprefetch cpuid_fault epb cat_l2 cdp_l2 ssbd ibrs ibpb stibp ibrs_enhance tpr_shadow flexpriority ept vpid ept_ad fsgsbase tsc_adjust bmi1 avx2 smep bmi2 erms invpcid rdt_a rdseed adx smap clflushopt clwb intel_pt sha_ni xsaveopt xsavec xgetbv1 xsavs split_lock_detect user_shstk avx_vnni dtherm ida arat pln pts hwp hwp_notify hwp_act_window hwp_epp hwp_pkg_req hfi vnmi umip pku ospke waitpkg gfni vaes vpclmulqdq rdpid moviri movdir64b fsrm md_clear serialize arch_lbr ibt flush_l1d arch_capabilities",
//           "vmx flags\t: vnmi preemption_timer posted_intr invvpid ept_x_only ept_ad ept_1gb flexpriority apicv tsc_offset vtpr mtf vapic ept vpid unrestricted_guest vapic_regvid ple shadow_vmcs ept_mode_based_exec tsc_scaling usr_wait_pause",
//           "bugs\t\t: spectre_v1 spectre_v2 spec_store_bypass swapgs eibrs_pbrsb rfds bhi",
//           "bogomips\t: 5222.40",
//           "clflush size\t: 64",
//           "cache_alignment\t: 64",
//           "address sizes\t: 39 bits physical, 48 bits virtual",
//           "power management:"];
//         myType = "Cloud";
//         myGroups =  ["cloud-nodes"];
//         myEpoch = (Number(Number(currentEpoch)).toFixed(3));
//         myIcon = "pi pi-cloud";
//         myLastUpdate = "2024-10-10:21:50:22";
//         myUptime = (Number(Number("3279890.20")/3600)).toFixed(3);
        
//         myServer = this.setTestServer(myCPU, myEpoch, myGroups, myhostname, myIcon, myLastUpdate, myStatus, myType, myUptime);

//         // console.log("--------- myServer 3 ---------");
//         // console.log(myServer3);
        
//         postsArray.push(myServer);

//         this.hosts.push(myhostname);
        
//         myhostname = "ubuntu-node04";
//         myCPU = [
//           "processor\t: 0",
//           "vendor_id\t: GenuineIntel",
//           "cpu family\t: 6",
//           "model\t\t: 154",
//           "model name\t: 12th Gen Intel(R) Core(TM) i7-1255U",
//           "stepping\t: 4",
//           "microcode\t: 0x433",
//           "cpu MHz\t\t: 4491.204",
//           "cache size\t: 12288 KB",
//           "physical id\t: 0",
//           "siblings\t: 12",
//           "core id\t\t: 0",
//           "cpu cores\t: 10",
//           "apicid\t\t: 0",
//           "initial apicid\t: 0",
//           "fpu\t\t: yes",
//           "fpu_exception\t: yes",
//           "cpuid level\t: 32",
//           "wp\t\t: yes",
//           "flags\t\t: fpu vme de pse tsc msr pae mce cx8 apic sep mtrr pge mca cmov pat pse36 clflush dts acpi mmx fxsr sse sse2 ss ht tm pbe syscall nx pdpe1gb rdtscp lm contant_tsc art arch_perfmon pebs bts rep_good nopl xtopology nonstop_tsc cpuid aperfmperf tsc_known_freq pni pclmulqdq dtes64 monitor ds_cpl vmx smx est tm2 ssse3 sdbg fma cx16 xpr pdcm sse4_1 sse4_2 x2apic movbe popcnt tsc_deadline_timer aes xsave avx f16c rdrand lahf_lm abm 3dnowprefetch cpuid_fault epb cat_l2 cdp_l2 ssbd ibrs ibpb stibp ibrs_enhance tpr_shadow flexpriority ept vpid ept_ad fsgsbase tsc_adjust bmi1 avx2 smep bmi2 erms invpcid rdt_a rdseed adx smap clflushopt clwb intel_pt sha_ni xsaveopt xsavec xgetbv1 xsavs split_lock_detect user_shstk avx_vnni dtherm ida arat pln pts hwp hwp_notify hwp_act_window hwp_epp hwp_pkg_req hfi vnmi umip pku ospke waitpkg gfni vaes vpclmulqdq rdpid moviri movdir64b fsrm md_clear serialize arch_lbr ibt flush_l1d arch_capabilities",
//           "vmx flags\t: vnmi preemption_timer posted_intr invvpid ept_x_only ept_ad ept_1gb flexpriority apicv tsc_offset vtpr mtf vapic ept vpid unrestricted_guest vapic_regvid ple shadow_vmcs ept_mode_based_exec tsc_scaling usr_wait_pause",
//           "bugs\t\t: spectre_v1 spectre_v2 spec_store_bypass swapgs eibrs_pbrsb rfds bhi",
//           "bogomips\t: 5222.40",
//           "clflush size\t: 64",
//           "cache_alignment\t: 64",
//           "address sizes\t: 39 bits physical, 48 bits virtual",
//           "power management:",
//           "",
//           "processor\t: 1",
//           "vendor_id\t: GenuineIntel",
//           "cpu family\t: 6",
//           "model\t\t: 154",
//           "model name\t: 12th Gen Intel(R) Core(TM) i7-1255U",
//           "stepping\t: 4",
//           "microcode\t: 0x433",
//           "cpu MHz\t\t: 4094.289",
//           "cache size\t: 12288 KB",
//           "physical id\t: 0",
//           "siblings\t: 12",
//           "core id\t\t: 0",
//           "cpu cores\t: 10",
//           "apicid\t\t: 1",
//           "initial apicid\t: 1",
//           "fpu\t\t: yes",
//           "fpu_exception\t: yes",
//           "cpuid level\t: 32",
//           "wp\t\t: yes",
//           "flags\t\t: fpu vme de pse tsc msr pae mce cx8 apic sep mtrr pge mca cmov pat pse36 clflush dts acpi mmx fxsr sse sse2 ss ht tm pbe syscall nx pdpe1gb rdtscp lm contant_tsc art arch_perfmon pebs bts rep_good nopl xtopology nonstop_tsc cpuid aperfmperf tsc_known_freq pni pclmulqdq dtes64 monitor ds_cpl vmx smx est tm2 ssse3 sdbg fma cx16 xpr pdcm sse4_1 sse4_2 x2apic movbe popcnt tsc_deadline_timer aes xsave avx f16c rdrand lahf_lm abm 3dnowprefetch cpuid_fault epb cat_l2 cdp_l2 ssbd ibrs ibpb stibp ibrs_enhance tpr_shadow flexpriority ept vpid ept_ad fsgsbase tsc_adjust bmi1 avx2 smep bmi2 erms invpcid rdt_a rdseed adx smap clflushopt clwb intel_pt sha_ni xsaveopt xsavec xgetbv1 xsavs split_lock_detect user_shstk avx_vnni dtherm ida arat pln pts hwp hwp_notify hwp_act_window hwp_epp hwp_pkg_req hfi vnmi umip pku ospke waitpkg gfni vaes vpclmulqdq rdpid moviri movdir64b fsrm md_clear serialize arch_lbr ibt flush_l1d arch_capabilities",
//           "vmx flags\t: vnmi preemption_timer posted_intr invvpid ept_x_only ept_ad ept_1gb flexpriority apicv tsc_offset vtpr mtf vapic ept vpid unrestricted_guest vapic_regvid ple shadow_vmcs ept_mode_based_exec tsc_scaling usr_wait_pause",
//           "bugs\t\t: spectre_v1 spectre_v2 spec_store_bypass swapgs eibrs_pbrsb rfds bhi",
//           "bogomips\t: 5222.40",
//           "clflush size\t: 64",
//           "cache_alignment\t: 64",
//           "address sizes\t: 39 bits physical, 48 bits virtual",
//           "power management:",
//           "",
//           "processor\t: 2",
//           "vendor_id\t: GenuineIntel",
//           "cpu family\t: 6",
//           "model\t\t: 154",
//           "model name\t: 12th Gen Intel(R) Core(TM) i7-1255U",
//           "stepping\t: 4",
//           "microcode\t: 0x433",
//           "cpu MHz\t\t: 3838.802",
//           "cache size\t: 12288 KB",
//           "physical id\t: 0",
//           "siblings\t: 12",
//           "core id\t\t: 4",
//           "cpu cores\t: 10",
//           "apicid\t\t: 8",
//           "initial apicid\t: 8",
//           "fpu\t\t: yes",
//           "fpu_exception\t: yes",
//           "cpuid level\t: 32",
//           "wp\t\t: yes",
//           "flags\t\t: fpu vme de pse tsc msr pae mce cx8 apic sep mtrr pge mca cmov pat pse36 clflush dts acpi mmx fxsr sse sse2 ss ht tm pbe syscall nx pdpe1gb rdtscp lm contant_tsc art arch_perfmon pebs bts rep_good nopl xtopology nonstop_tsc cpuid aperfmperf tsc_known_freq pni pclmulqdq dtes64 monitor ds_cpl vmx smx est tm2 ssse3 sdbg fma cx16 xpr pdcm sse4_1 sse4_2 x2apic movbe popcnt tsc_deadline_timer aes xsave avx f16c rdrand lahf_lm abm 3dnowprefetch cpuid_fault epb cat_l2 cdp_l2 ssbd ibrs ibpb stibp ibrs_enhance tpr_shadow flexpriority ept vpid ept_ad fsgsbase tsc_adjust bmi1 avx2 smep bmi2 erms invpcid rdt_a rdseed adx smap clflushopt clwb intel_pt sha_ni xsaveopt xsavec xgetbv1 xsavs split_lock_detect user_shstk avx_vnni dtherm ida arat pln pts hwp hwp_notify hwp_act_window hwp_epp hwp_pkg_req hfi vnmi umip pku ospke waitpkg gfni vaes vpclmulqdq rdpid moviri movdir64b fsrm md_clear serialize arch_lbr ibt flush_l1d arch_capabilities",
//           "vmx flags\t: vnmi preemption_timer posted_intr invvpid ept_x_only ept_ad ept_1gb flexpriority apicv tsc_offset vtpr mtf vapic ept vpid unrestricted_guest vapic_regvid ple shadow_vmcs ept_mode_based_exec tsc_scaling usr_wait_pause",
//           "bugs\t\t: spectre_v1 spectre_v2 spec_store_bypass swapgs eibrs_pbrsb rfds bhi",
//           "bogomips\t: 5222.40",
//           "clflush size\t: 64",
//           "cache_alignment\t: 64",
//           "address sizes\t: 39 bits physical, 48 bits virtual",
//           "power management:",
//           "",
//           "processor\t: 3",
//           "vendor_id\t: GenuineIntel",
//           "cpu family\t: 6",
//           "model\t\t: 154",
//           "model name\t: 12th Gen Intel(R) Core(TM) i7-1255U",
//           "stepping\t: 4",
//           "microcode\t: 0x433",
//           "cpu MHz\t\t: 400.000",
//           "cache size\t: 12288 KB",
//           "physical id\t: 0",
//           "siblings\t: 12",
//           "core id\t\t: 4",
//           "cpu cores\t: 10",
//           "apicid\t\t: 9",
//           "initial apicid\t: 9",
//           "fpu\t\t: yes",
//           "fpu_exception\t: yes",
//           "cpuid level\t: 32",
//           "wp\t\t: yes",
//           "flags\t\t: fpu vme de pse tsc msr pae mce cx8 apic sep mtrr pge mca cmov pat pse36 clflush dts acpi mmx fxsr sse sse2 ss ht tm pbe syscall nx pdpe1gb rdtscp lm contant_tsc art arch_perfmon pebs bts rep_good nopl xtopology nonstop_tsc cpuid aperfmperf tsc_known_freq pni pclmulqdq dtes64 monitor ds_cpl vmx smx est tm2 ssse3 sdbg fma cx16 xpr pdcm sse4_1 sse4_2 x2apic movbe popcnt tsc_deadline_timer aes xsave avx f16c rdrand lahf_lm abm 3dnowprefetch cpuid_fault epb cat_l2 cdp_l2 ssbd ibrs ibpb stibp ibrs_enhance tpr_shadow flexpriority ept vpid ept_ad fsgsbase tsc_adjust bmi1 avx2 smep bmi2 erms invpcid rdt_a rdseed adx smap clflushopt clwb intel_pt sha_ni xsaveopt xsavec xgetbv1 xsavs split_lock_detect user_shstk avx_vnni dtherm ida arat pln pts hwp hwp_notify hwp_act_window hwp_epp hwp_pkg_req hfi vnmi umip pku ospke waitpkg gfni vaes vpclmulqdq rdpid moviri movdir64b fsrm md_clear serialize arch_lbr ibt flush_l1d arch_capabilities",
//           "vmx flags\t: vnmi preemption_timer posted_intr invvpid ept_x_only ept_ad ept_1gb flexpriority apicv tsc_offset vtpr mtf vapic ept vpid unrestricted_guest vapic_regvid ple shadow_vmcs ept_mode_based_exec tsc_scaling usr_wait_pause",
//           "bugs\t\t: spectre_v1 spectre_v2 spec_store_bypass swapgs eibrs_pbrsb rfds bhi",
//           "bogomips\t: 5222.40",
//           "clflush size\t: 64",
//           "cache_alignment\t: 64",
//           "address sizes\t: 39 bits physical, 48 bits virtual",
//           "power management:",
//           "",
//           "processor\t: 4",
//           "vendor_id\t: GenuineIntel",
//           "cpu family\t: 6",
//           "model\t\t: 154",
//           "model name\t: 12th Gen Intel(R) Core(TM) i7-1255U",
//           "stepping\t: 4",
//           "microcode\t: 0x433",
//           "cpu MHz\t\t: 3500.003",
//           "cache size\t: 12288 KB",
//           "physical id\t: 0",
//           "siblings\t: 12",
//           "core id\t\t: 8",
//           "cpu cores\t: 10",
//           "apicid\t\t: 16",
//           "initial apicid\t: 16",
//           "fpu\t\t: yes",
//           "fpu_exception\t: yes",
//           "cpuid level\t: 32",
//           "wp\t\t: yes",
//           "flags\t\t: fpu vme de pse tsc msr pae mce cx8 apic sep mtrr pge mca cmov pat pse36 clflush dts acpi mmx fxsr sse sse2 ss ht tm pbe syscall nx pdpe1gb rdtscp lm contant_tsc art arch_perfmon pebs bts rep_good nopl xtopology nonstop_tsc cpuid aperfmperf tsc_known_freq pni pclmulqdq dtes64 monitor ds_cpl vmx smx est tm2 ssse3 sdbg fma cx16 xpr pdcm sse4_1 sse4_2 x2apic movbe popcnt tsc_deadline_timer aes xsave avx f16c rdrand lahf_lm abm 3dnowprefetch cpuid_fault epb cat_l2 cdp_l2 ssbd ibrs ibpb stibp ibrs_enhance tpr_shadow flexpriority ept vpid ept_ad fsgsbase tsc_adjust bmi1 avx2 smep bmi2 erms invpcid rdt_a rdseed adx smap clflushopt clwb intel_pt sha_ni xsaveopt xsavec xgetbv1 xsavs split_lock_detect user_shstk avx_vnni dtherm ida arat pln pts hwp hwp_notify hwp_act_window hwp_epp hwp_pkg_req hfi vnmi umip pku ospke waitpkg gfni vaes vpclmulqdq rdpid moviri movdir64b fsrm md_clear serialize arch_lbr ibt flush_l1d arch_capabilities",
//           "vmx flags\t: vnmi preemption_timer posted_intr invvpid ept_x_only ept_ad ept_1gb flexpriority apicv tsc_offset vtpr mtf vapic ept vpid unrestricted_guest vapic_regvid ple shadow_vmcs ept_mode_based_exec tsc_scaling usr_wait_pause",
//           "bugs\t\t: spectre_v1 spectre_v2 spec_store_bypass swapgs eibrs_pbrsb rfds bhi",
//           "bogomips\t: 5222.40",
//           "clflush size\t: 64",
//           "cache_alignment\t: 64",
//           "address sizes\t: 39 bits physical, 48 bits virtual",
//           "power management:",
//           "",
//           "processor\t: 5",
//           "vendor_id\t: GenuineIntel",
//           "cpu family\t: 6",
//           "model\t\t: 154",
//           "model name\t: 12th Gen Intel(R) Core(TM) i7-1255U",
//           "stepping\t: 4",
//           "microcode\t: 0x433",
//           "cpu MHz\t\t: 3498.771",
//           "cache size\t: 12288 KB",
//           "physical id\t: 0",
//           "siblings\t: 12",
//           "core id\t\t: 9",
//           "cpu cores\t: 10",
//           "apicid\t\t: 18",
//           "initial apicid\t: 18",
//           "fpu\t\t: yes",
//           "fpu_exception\t: yes",
//           "cpuid level\t: 32",
//           "wp\t\t: yes",
//           "flags\t\t: fpu vme de pse tsc msr pae mce cx8 apic sep mtrr pge mca cmov pat pse36 clflush dts acpi mmx fxsr sse sse2 ss ht tm pbe syscall nx pdpe1gb rdtscp lm contant_tsc art arch_perfmon pebs bts rep_good nopl xtopology nonstop_tsc cpuid aperfmperf tsc_known_freq pni pclmulqdq dtes64 monitor ds_cpl vmx smx est tm2 ssse3 sdbg fma cx16 xpr pdcm sse4_1 sse4_2 x2apic movbe popcnt tsc_deadline_timer aes xsave avx f16c rdrand lahf_lm abm 3dnowprefetch cpuid_fault epb cat_l2 cdp_l2 ssbd ibrs ibpb stibp ibrs_enhance tpr_shadow flexpriority ept vpid ept_ad fsgsbase tsc_adjust bmi1 avx2 smep bmi2 erms invpcid rdt_a rdseed adx smap clflushopt clwb intel_pt sha_ni xsaveopt xsavec xgetbv1 xsavs split_lock_detect user_shstk avx_vnni dtherm ida arat pln pts hwp hwp_notify hwp_act_window hwp_epp hwp_pkg_req hfi vnmi umip pku ospke waitpkg gfni vaes vpclmulqdq rdpid moviri movdir64b fsrm md_clear serialize arch_lbr ibt flush_l1d arch_capabilities",
//           "vmx flags\t: vnmi preemption_timer posted_intr invvpid ept_x_only ept_ad ept_1gb flexpriority apicv tsc_offset vtpr mtf vapic ept vpid unrestricted_guest vapic_regvid ple shadow_vmcs ept_mode_based_exec tsc_scaling usr_wait_pause",
//           "bugs\t\t: spectre_v1 spectre_v2 spec_store_bypass swapgs eibrs_pbrsb rfds bhi",
//           "bogomips\t: 5222.40",
//           "clflush size\t: 64",
//           "cache_alignment\t: 64",
//           "address sizes\t: 39 bits physical, 48 bits virtual",
//           "power management:",
//           "",
//           "processor\t: 6",
//           "vendor_id\t: GenuineIntel",
//           "cpu family\t: 6",
//           "model\t\t: 154",
//           "model name\t: 12th Gen Intel(R) Core(TM) i7-1255U",
//           "stepping\t: 4",
//           "microcode\t: 0x433",
//           "cpu MHz\t\t: 3501.847",
//           "cache size\t: 12288 KB",
//           "physical id\t: 0",
//           "siblings\t: 12",
//           "core id\t\t: 10",
//           "cpu cores\t: 10",
//           "apicid\t\t: 20",
//           "initial apicid\t: 20",
//           "fpu\t\t: yes",
//           "fpu_exception\t: yes",
//           "cpuid level\t: 32",
//           "wp\t\t: yes",
//           "flags\t\t: fpu vme de pse tsc msr pae mce cx8 apic sep mtrr pge mca cmov pat pse36 clflush dts acpi mmx fxsr sse sse2 ss ht tm pbe syscall nx pdpe1gb rdtscp lm contant_tsc art arch_perfmon pebs bts rep_good nopl xtopology nonstop_tsc cpuid aperfmperf tsc_known_freq pni pclmulqdq dtes64 monitor ds_cpl vmx smx est tm2 ssse3 sdbg fma cx16 xpr pdcm sse4_1 sse4_2 x2apic movbe popcnt tsc_deadline_timer aes xsave avx f16c rdrand lahf_lm abm 3dnowprefetch cpuid_fault epb cat_l2 cdp_l2 ssbd ibrs ibpb stibp ibrs_enhance tpr_shadow flexpriority ept vpid ept_ad fsgsbase tsc_adjust bmi1 avx2 smep bmi2 erms invpcid rdt_a rdseed adx smap clflushopt clwb intel_pt sha_ni xsaveopt xsavec xgetbv1 xsavs split_lock_detect user_shstk avx_vnni dtherm ida arat pln pts hwp hwp_notify hwp_act_window hwp_epp hwp_pkg_req hfi vnmi umip pku ospke waitpkg gfni vaes vpclmulqdq rdpid moviri movdir64b fsrm md_clear serialize arch_lbr ibt flush_l1d arch_capabilities",
//           "vmx flags\t: vnmi preemption_timer posted_intr invvpid ept_x_only ept_ad ept_1gb flexpriority apicv tsc_offset vtpr mtf vapic ept vpid unrestricted_guest vapic_regvid ple shadow_vmcs ept_mode_based_exec tsc_scaling usr_wait_pause",
//           "bugs\t\t: spectre_v1 spectre_v2 spec_store_bypass swapgs eibrs_pbrsb rfds bhi",
//           "bogomips\t: 5222.40",
//           "clflush size\t: 64",
//           "cache_alignment\t: 64",
//           "address sizes\t: 39 bits physical, 48 bits virtual",
//           "power management:",
//           "",
//           "processor\t: 7",
//           "vendor_id\t: GenuineIntel",
//           "cpu family\t: 6",
//           "model\t\t: 154",
//           "model name\t: 12th Gen Intel(R) Core(TM) i7-1255U",
//           "stepping\t: 4",
//           "microcode\t: 0x433",
//           "cpu MHz\t\t: 3500.041",
//           "cache size\t: 12288 KB",
//           "physical id\t: 0",
//           "siblings\t: 12",
//           "core id\t\t: 11",
//           "cpu cores\t: 10",
//           "apicid\t\t: 22",
//           "initial apicid\t: 22",
//           "fpu\t\t: yes",
//           "fpu_exception\t: yes",
//           "cpuid level\t: 32",
//           "wp\t\t: yes",
//           "flags\t\t: fpu vme de pse tsc msr pae mce cx8 apic sep mtrr pge mca cmov pat pse36 clflush dts acpi mmx fxsr sse sse2 ss ht tm pbe syscall nx pdpe1gb rdtscp lm contant_tsc art arch_perfmon pebs bts rep_good nopl xtopology nonstop_tsc cpuid aperfmperf tsc_known_freq pni pclmulqdq dtes64 monitor ds_cpl vmx smx est tm2 ssse3 sdbg fma cx16 xpr pdcm sse4_1 sse4_2 x2apic movbe popcnt tsc_deadline_timer aes xsave avx f16c rdrand lahf_lm abm 3dnowprefetch cpuid_fault epb cat_l2 cdp_l2 ssbd ibrs ibpb stibp ibrs_enhance tpr_shadow flexpriority ept vpid ept_ad fsgsbase tsc_adjust bmi1 avx2 smep bmi2 erms invpcid rdt_a rdseed adx smap clflushopt clwb intel_pt sha_ni xsaveopt xsavec xgetbv1 xsavs split_lock_detect user_shstk avx_vnni dtherm ida arat pln pts hwp hwp_notify hwp_act_window hwp_epp hwp_pkg_req hfi vnmi umip pku ospke waitpkg gfni vaes vpclmulqdq rdpid moviri movdir64b fsrm md_clear serialize arch_lbr ibt flush_l1d arch_capabilities",
//           "vmx flags\t: vnmi preemption_timer posted_intr invvpid ept_x_only ept_ad ept_1gb flexpriority apicv tsc_offset vtpr mtf vapic ept vpid unrestricted_guest vapic_regvid ple shadow_vmcs ept_mode_based_exec tsc_scaling usr_wait_pause",
//           "bugs\t\t: spectre_v1 spectre_v2 spec_store_bypass swapgs eibrs_pbrsb rfds bhi",
//           "bogomips\t: 5222.40",
//           "clflush size\t: 64",
//           "cache_alignment\t: 64",
//           "address sizes\t: 39 bits physical, 48 bits virtual",
//           "power management:",
//           "",
//           "processor\t: 8",
//           "vendor_id\t: GenuineIntel",
//           "cpu family\t: 6",
//           "model\t\t: 154",
//           "model name\t: 12th Gen Intel(R) Core(TM) i7-1255U",
//           "stepping\t: 4",
//           "microcode\t: 0x433",
//           "cpu MHz\t\t: 3500.111",
//           "cache size\t: 12288 KB",
//           "physical id\t: 0",
//           "siblings\t: 12",
//           "core id\t\t: 12",
//           "cpu cores\t: 10",
//           "apicid\t\t: 24",
//           "initial apicid\t: 24",
//           "fpu\t\t: yes",
//           "fpu_exception\t: yes",
//           "cpuid level\t: 32",
//           "wp\t\t: yes",
//           "flags\t\t: fpu vme de pse tsc msr pae mce cx8 apic sep mtrr pge mca cmov pat pse36 clflush dts acpi mmx fxsr sse sse2 ss ht tm pbe syscall nx pdpe1gb rdtscp lm contant_tsc art arch_perfmon pebs bts rep_good nopl xtopology nonstop_tsc cpuid aperfmperf tsc_known_freq pni pclmulqdq dtes64 monitor ds_cpl vmx smx est tm2 ssse3 sdbg fma cx16 xpr pdcm sse4_1 sse4_2 x2apic movbe popcnt tsc_deadline_timer aes xsave avx f16c rdrand lahf_lm abm 3dnowprefetch cpuid_fault epb cat_l2 cdp_l2 ssbd ibrs ibpb stibp ibrs_enhance tpr_shadow flexpriority ept vpid ept_ad fsgsbase tsc_adjust bmi1 avx2 smep bmi2 erms invpcid rdt_a rdseed adx smap clflushopt clwb intel_pt sha_ni xsaveopt xsavec xgetbv1 xsavs split_lock_detect user_shstk avx_vnni dtherm ida arat pln pts hwp hwp_notify hwp_act_window hwp_epp hwp_pkg_req hfi vnmi umip pku ospke waitpkg gfni vaes vpclmulqdq rdpid moviri movdir64b fsrm md_clear serialize arch_lbr ibt flush_l1d arch_capabilities",
//           "vmx flags\t: vnmi preemption_timer posted_intr invvpid ept_x_only ept_ad ept_1gb flexpriority apicv tsc_offset vtpr mtf vapic ept vpid unrestricted_guest vapic_regvid ple shadow_vmcs ept_mode_based_exec tsc_scaling usr_wait_pause",
//           "bugs\t\t: spectre_v1 spectre_v2 spec_store_bypass swapgs eibrs_pbrsb rfds bhi",
//           "bogomips\t: 5222.40",
//           "clflush size\t: 64",
//           "cache_alignment\t: 64",
//           "address sizes\t: 39 bits physical, 48 bits virtual",
//           "power management:",
//           "",
//           "processor\t: 9",
//           "vendor_id\t: GenuineIntel",
//           "cpu family\t: 6",
//           "model\t\t: 154",
//           "model name\t: 12th Gen Intel(R) Core(TM) i7-1255U",
//           "stepping\t: 4",
//           "microcode\t: 0x433",
//           "cpu MHz\t\t: 3500.011",
//           "cache size\t: 12288 KB",
//           "physical id\t: 0",
//           "siblings\t: 12",
//           "core id\t\t: 13",
//           "cpu cores\t: 10",
//           "apicid\t\t: 26",
//           "initial apicid\t: 26",
//           "fpu\t\t: yes",
//           "fpu_exception\t: yes",
//           "cpuid level\t: 32",
//           "wp\t\t: yes",
//           "flags\t\t: fpu vme de pse tsc msr pae mce cx8 apic sep mtrr pge mca cmov pat pse36 clflush dts acpi mmx fxsr sse sse2 ss ht tm pbe syscall nx pdpe1gb rdtscp lm contant_tsc art arch_perfmon pebs bts rep_good nopl xtopology nonstop_tsc cpuid aperfmperf tsc_known_freq pni pclmulqdq dtes64 monitor ds_cpl vmx smx est tm2 ssse3 sdbg fma cx16 xpr pdcm sse4_1 sse4_2 x2apic movbe popcnt tsc_deadline_timer aes xsave avx f16c rdrand lahf_lm abm 3dnowprefetch cpuid_fault epb cat_l2 cdp_l2 ssbd ibrs ibpb stibp ibrs_enhance tpr_shadow flexpriority ept vpid ept_ad fsgsbase tsc_adjust bmi1 avx2 smep bmi2 erms invpcid rdt_a rdseed adx smap clflushopt clwb intel_pt sha_ni xsaveopt xsavec xgetbv1 xsavs split_lock_detect user_shstk avx_vnni dtherm ida arat pln pts hwp hwp_notify hwp_act_window hwp_epp hwp_pkg_req hfi vnmi umip pku ospke waitpkg gfni vaes vpclmulqdq rdpid moviri movdir64b fsrm md_clear serialize arch_lbr ibt flush_l1d arch_capabilities",
//           "vmx flags\t: vnmi preemption_timer posted_intr invvpid ept_x_only ept_ad ept_1gb flexpriority apicv tsc_offset vtpr mtf vapic ept vpid unrestricted_guest vapic_regvid ple shadow_vmcs ept_mode_based_exec tsc_scaling usr_wait_pause",
//           "bugs\t\t: spectre_v1 spectre_v2 spec_store_bypass swapgs eibrs_pbrsb rfds bhi",
//           "bogomips\t: 5222.40",
//           "clflush size\t: 64",
//           "cache_alignment\t: 64",
//           "address sizes\t: 39 bits physical, 48 bits virtual",
//           "power management:",
//           "",
//           "processor\t: 10",
//           "vendor_id\t: GenuineIntel",
//           "cpu family\t: 6",
//           "model\t\t: 154",
//           "model name\t: 12th Gen Intel(R) Core(TM) i7-1255U",
//           "stepping\t: 4",
//           "microcode\t: 0x433",
//           "cpu MHz\t\t: 3499.934",
//           "cache size\t: 12288 KB",
//           "physical id\t: 0",
//           "siblings\t: 12",
//           "core id\t\t: 14",
//           "cpu cores\t: 10",
//           "apicid\t\t: 28",
//           "initial apicid\t: 28",
//           "fpu\t\t: yes",
//           "fpu_exception\t: yes",
//           "cpuid level\t: 32",
//           "wp\t\t: yes",
//           "flags\t\t: fpu vme de pse tsc msr pae mce cx8 apic sep mtrr pge mca cmov pat pse36 clflush dts acpi mmx fxsr sse sse2 ss ht tm pbe syscall nx pdpe1gb rdtscp lm contant_tsc art arch_perfmon pebs bts rep_good nopl xtopology nonstop_tsc cpuid aperfmperf tsc_known_freq pni pclmulqdq dtes64 monitor ds_cpl vmx smx est tm2 ssse3 sdbg fma cx16 xpr pdcm sse4_1 sse4_2 x2apic movbe popcnt tsc_deadline_timer aes xsave avx f16c rdrand lahf_lm abm 3dnowprefetch cpuid_fault epb cat_l2 cdp_l2 ssbd ibrs ibpb stibp ibrs_enhance tpr_shadow flexpriority ept vpid ept_ad fsgsbase tsc_adjust bmi1 avx2 smep bmi2 erms invpcid rdt_a rdseed adx smap clflushopt clwb intel_pt sha_ni xsaveopt xsavec xgetbv1 xsavs split_lock_detect user_shstk avx_vnni dtherm ida arat pln pts hwp hwp_notify hwp_act_window hwp_epp hwp_pkg_req hfi vnmi umip pku ospke waitpkg gfni vaes vpclmulqdq rdpid moviri movdir64b fsrm md_clear serialize arch_lbr ibt flush_l1d arch_capabilities",
//           "vmx flags\t: vnmi preemption_timer posted_intr invvpid ept_x_only ept_ad ept_1gb flexpriority apicv tsc_offset vtpr mtf vapic ept vpid unrestricted_guest vapic_regvid ple shadow_vmcs ept_mode_based_exec tsc_scaling usr_wait_pause",
//           "bugs\t\t: spectre_v1 spectre_v2 spec_store_bypass swapgs eibrs_pbrsb rfds bhi",
//           "bogomips\t: 5222.40",
//           "clflush size\t: 64",
//           "cache_alignment\t: 64",
//           "address sizes\t: 39 bits physical, 48 bits virtual",
//           "power management:",
//           "",
//           "processor\t: 11",
//           "vendor_id\t: GenuineIntel",
//           "cpu family\t: 6",
//           "model\t\t: 154",
//           "model name\t: 12th Gen Intel(R) Core(TM) i7-1255U",
//           "stepping\t: 4",
//           "microcode\t: 0x433",
//           "cpu MHz\t\t: 3500.179",
//           "cache size\t: 12288 KB",
//           "physical id\t: 0",
//           "siblings\t: 12",
//           "core id\t\t: 15",
//           "cpu cores\t: 10",
//           "apicid\t\t: 30",
//           "initial apicid\t: 30",
//           "fpu\t\t: yes",
//           "fpu_exception\t: yes",
//           "cpuid level\t: 32",
//           "wp\t\t: yes",
//           "flags\t\t: fpu vme de pse tsc msr pae mce cx8 apic sep mtrr pge mca cmov pat pse36 clflush dts acpi mmx fxsr sse sse2 ss ht tm pbe syscall nx pdpe1gb rdtscp lm contant_tsc art arch_perfmon pebs bts rep_good nopl xtopology nonstop_tsc cpuid aperfmperf tsc_known_freq pni pclmulqdq dtes64 monitor ds_cpl vmx smx est tm2 ssse3 sdbg fma cx16 xpr pdcm sse4_1 sse4_2 x2apic movbe popcnt tsc_deadline_timer aes xsave avx f16c rdrand lahf_lm abm 3dnowprefetch cpuid_fault epb cat_l2 cdp_l2 ssbd ibrs ibpb stibp ibrs_enhance tpr_shadow flexpriority ept vpid ept_ad fsgsbase tsc_adjust bmi1 avx2 smep bmi2 erms invpcid rdt_a rdseed adx smap clflushopt clwb intel_pt sha_ni xsaveopt xsavec xgetbv1 xsavs split_lock_detect user_shstk avx_vnni dtherm ida arat pln pts hwp hwp_notify hwp_act_window hwp_epp hwp_pkg_req hfi vnmi umip pku ospke waitpkg gfni vaes vpclmulqdq rdpid moviri movdir64b fsrm md_clear serialize arch_lbr ibt flush_l1d arch_capabilities",
//           "vmx flags\t: vnmi preemption_timer posted_intr invvpid ept_x_only ept_ad ept_1gb flexpriority apicv tsc_offset vtpr mtf vapic ept vpid unrestricted_guest vapic_regvid ple shadow_vmcs ept_mode_based_exec tsc_scaling usr_wait_pause",
//           "bugs\t\t: spectre_v1 spectre_v2 spec_store_bypass swapgs eibrs_pbrsb rfds bhi",
//           "bogomips\t: 5222.40",
//           "clflush size\t: 64",
//           "cache_alignment\t: 64",
//           "address sizes\t: 39 bits physical, 48 bits virtual",
//           "power management:"];
//         myType = "Cloud";
//         myGroups =  ["cloud-nodes"];
//         myEpoch = (Number(Number(currentEpoch)).toFixed(3));
//         myIcon = "pi pi-cloud";
//         myLastUpdate = "2024-10-10:21:50:22";
//         myUptime = (Number(Number("3279890.20")/3600)).toFixed(3);
        
//         myServer = this.setTestServer(myCPU, myEpoch, myGroups, myhostname, myIcon, myLastUpdate, myStatus, myType, myUptime);

//         // console.log("--------- myServer 4 ---------");
//         // console.log(myServer4);
        
//         postsArray.push(myServer);

//         this.hosts.push(myhostname);
        
//         myhostname = "ubuntu-node05";
//         myCPU = [
//           "processor\t: 0",
//           "vendor_id\t: GenuineIntel",
//           "cpu family\t: 6",
//           "model\t\t: 154",
//           "model name\t: 12th Gen Intel(R) Core(TM) i7-1255U",
//           "stepping\t: 4",
//           "microcode\t: 0x433",
//           "cpu MHz\t\t: 4491.204",
//           "cache size\t: 12288 KB",
//           "physical id\t: 0",
//           "siblings\t: 12",
//           "core id\t\t: 0",
//           "cpu cores\t: 10",
//           "apicid\t\t: 0",
//           "initial apicid\t: 0",
//           "fpu\t\t: yes",
//           "fpu_exception\t: yes",
//           "cpuid level\t: 32",
//           "wp\t\t: yes",
//           "flags\t\t: fpu vme de pse tsc msr pae mce cx8 apic sep mtrr pge mca cmov pat pse36 clflush dts acpi mmx fxsr sse sse2 ss ht tm pbe syscall nx pdpe1gb rdtscp lm contant_tsc art arch_perfmon pebs bts rep_good nopl xtopology nonstop_tsc cpuid aperfmperf tsc_known_freq pni pclmulqdq dtes64 monitor ds_cpl vmx smx est tm2 ssse3 sdbg fma cx16 xpr pdcm sse4_1 sse4_2 x2apic movbe popcnt tsc_deadline_timer aes xsave avx f16c rdrand lahf_lm abm 3dnowprefetch cpuid_fault epb cat_l2 cdp_l2 ssbd ibrs ibpb stibp ibrs_enhance tpr_shadow flexpriority ept vpid ept_ad fsgsbase tsc_adjust bmi1 avx2 smep bmi2 erms invpcid rdt_a rdseed adx smap clflushopt clwb intel_pt sha_ni xsaveopt xsavec xgetbv1 xsavs split_lock_detect user_shstk avx_vnni dtherm ida arat pln pts hwp hwp_notify hwp_act_window hwp_epp hwp_pkg_req hfi vnmi umip pku ospke waitpkg gfni vaes vpclmulqdq rdpid moviri movdir64b fsrm md_clear serialize arch_lbr ibt flush_l1d arch_capabilities",
//           "vmx flags\t: vnmi preemption_timer posted_intr invvpid ept_x_only ept_ad ept_1gb flexpriority apicv tsc_offset vtpr mtf vapic ept vpid unrestricted_guest vapic_regvid ple shadow_vmcs ept_mode_based_exec tsc_scaling usr_wait_pause",
//           "bugs\t\t: spectre_v1 spectre_v2 spec_store_bypass swapgs eibrs_pbrsb rfds bhi",
//           "bogomips\t: 5222.40",
//           "clflush size\t: 64",
//           "cache_alignment\t: 64",
//           "address sizes\t: 39 bits physical, 48 bits virtual",
//           "power management:",
//           "",
//           "processor\t: 1",
//           "vendor_id\t: GenuineIntel",
//           "cpu family\t: 6",
//           "model\t\t: 154",
//           "model name\t: 12th Gen Intel(R) Core(TM) i7-1255U",
//           "stepping\t: 4",
//           "microcode\t: 0x433",
//           "cpu MHz\t\t: 4094.289",
//           "cache size\t: 12288 KB",
//           "physical id\t: 0",
//           "siblings\t: 12",
//           "core id\t\t: 0",
//           "cpu cores\t: 10",
//           "apicid\t\t: 1",
//           "initial apicid\t: 1",
//           "fpu\t\t: yes",
//           "fpu_exception\t: yes",
//           "cpuid level\t: 32",
//           "wp\t\t: yes",
//           "flags\t\t: fpu vme de pse tsc msr pae mce cx8 apic sep mtrr pge mca cmov pat pse36 clflush dts acpi mmx fxsr sse sse2 ss ht tm pbe syscall nx pdpe1gb rdtscp lm contant_tsc art arch_perfmon pebs bts rep_good nopl xtopology nonstop_tsc cpuid aperfmperf tsc_known_freq pni pclmulqdq dtes64 monitor ds_cpl vmx smx est tm2 ssse3 sdbg fma cx16 xpr pdcm sse4_1 sse4_2 x2apic movbe popcnt tsc_deadline_timer aes xsave avx f16c rdrand lahf_lm abm 3dnowprefetch cpuid_fault epb cat_l2 cdp_l2 ssbd ibrs ibpb stibp ibrs_enhance tpr_shadow flexpriority ept vpid ept_ad fsgsbase tsc_adjust bmi1 avx2 smep bmi2 erms invpcid rdt_a rdseed adx smap clflushopt clwb intel_pt sha_ni xsaveopt xsavec xgetbv1 xsavs split_lock_detect user_shstk avx_vnni dtherm ida arat pln pts hwp hwp_notify hwp_act_window hwp_epp hwp_pkg_req hfi vnmi umip pku ospke waitpkg gfni vaes vpclmulqdq rdpid moviri movdir64b fsrm md_clear serialize arch_lbr ibt flush_l1d arch_capabilities",
//           "vmx flags\t: vnmi preemption_timer posted_intr invvpid ept_x_only ept_ad ept_1gb flexpriority apicv tsc_offset vtpr mtf vapic ept vpid unrestricted_guest vapic_regvid ple shadow_vmcs ept_mode_based_exec tsc_scaling usr_wait_pause",
//           "bugs\t\t: spectre_v1 spectre_v2 spec_store_bypass swapgs eibrs_pbrsb rfds bhi",
//           "bogomips\t: 5222.40",
//           "clflush size\t: 64",
//           "cache_alignment\t: 64",
//           "address sizes\t: 39 bits physical, 48 bits virtual",
//           "power management:",
//           "",
//           "processor\t: 2",
//           "vendor_id\t: GenuineIntel",
//           "cpu family\t: 6",
//           "model\t\t: 154",
//           "model name\t: 12th Gen Intel(R) Core(TM) i7-1255U",
//           "stepping\t: 4",
//           "microcode\t: 0x433",
//           "cpu MHz\t\t: 3838.802",
//           "cache size\t: 12288 KB",
//           "physical id\t: 0",
//           "siblings\t: 12",
//           "core id\t\t: 4",
//           "cpu cores\t: 10",
//           "apicid\t\t: 8",
//           "initial apicid\t: 8",
//           "fpu\t\t: yes",
//           "fpu_exception\t: yes",
//           "cpuid level\t: 32",
//           "wp\t\t: yes",
//           "flags\t\t: fpu vme de pse tsc msr pae mce cx8 apic sep mtrr pge mca cmov pat pse36 clflush dts acpi mmx fxsr sse sse2 ss ht tm pbe syscall nx pdpe1gb rdtscp lm contant_tsc art arch_perfmon pebs bts rep_good nopl xtopology nonstop_tsc cpuid aperfmperf tsc_known_freq pni pclmulqdq dtes64 monitor ds_cpl vmx smx est tm2 ssse3 sdbg fma cx16 xpr pdcm sse4_1 sse4_2 x2apic movbe popcnt tsc_deadline_timer aes xsave avx f16c rdrand lahf_lm abm 3dnowprefetch cpuid_fault epb cat_l2 cdp_l2 ssbd ibrs ibpb stibp ibrs_enhance tpr_shadow flexpriority ept vpid ept_ad fsgsbase tsc_adjust bmi1 avx2 smep bmi2 erms invpcid rdt_a rdseed adx smap clflushopt clwb intel_pt sha_ni xsaveopt xsavec xgetbv1 xsavs split_lock_detect user_shstk avx_vnni dtherm ida arat pln pts hwp hwp_notify hwp_act_window hwp_epp hwp_pkg_req hfi vnmi umip pku ospke waitpkg gfni vaes vpclmulqdq rdpid moviri movdir64b fsrm md_clear serialize arch_lbr ibt flush_l1d arch_capabilities",
//           "vmx flags\t: vnmi preemption_timer posted_intr invvpid ept_x_only ept_ad ept_1gb flexpriority apicv tsc_offset vtpr mtf vapic ept vpid unrestricted_guest vapic_regvid ple shadow_vmcs ept_mode_based_exec tsc_scaling usr_wait_pause",
//           "bugs\t\t: spectre_v1 spectre_v2 spec_store_bypass swapgs eibrs_pbrsb rfds bhi",
//           "bogomips\t: 5222.40",
//           "clflush size\t: 64",
//           "cache_alignment\t: 64",
//           "address sizes\t: 39 bits physical, 48 bits virtual",
//           "power management:",
//           "",
//           "processor\t: 3",
//           "vendor_id\t: GenuineIntel",
//           "cpu family\t: 6",
//           "model\t\t: 154",
//           "model name\t: 12th Gen Intel(R) Core(TM) i7-1255U",
//           "stepping\t: 4",
//           "microcode\t: 0x433",
//           "cpu MHz\t\t: 400.000",
//           "cache size\t: 12288 KB",
//           "physical id\t: 0",
//           "siblings\t: 12",
//           "core id\t\t: 4",
//           "cpu cores\t: 10",
//           "apicid\t\t: 9",
//           "initial apicid\t: 9",
//           "fpu\t\t: yes",
//           "fpu_exception\t: yes",
//           "cpuid level\t: 32",
//           "wp\t\t: yes",
//           "flags\t\t: fpu vme de pse tsc msr pae mce cx8 apic sep mtrr pge mca cmov pat pse36 clflush dts acpi mmx fxsr sse sse2 ss ht tm pbe syscall nx pdpe1gb rdtscp lm contant_tsc art arch_perfmon pebs bts rep_good nopl xtopology nonstop_tsc cpuid aperfmperf tsc_known_freq pni pclmulqdq dtes64 monitor ds_cpl vmx smx est tm2 ssse3 sdbg fma cx16 xpr pdcm sse4_1 sse4_2 x2apic movbe popcnt tsc_deadline_timer aes xsave avx f16c rdrand lahf_lm abm 3dnowprefetch cpuid_fault epb cat_l2 cdp_l2 ssbd ibrs ibpb stibp ibrs_enhance tpr_shadow flexpriority ept vpid ept_ad fsgsbase tsc_adjust bmi1 avx2 smep bmi2 erms invpcid rdt_a rdseed adx smap clflushopt clwb intel_pt sha_ni xsaveopt xsavec xgetbv1 xsavs split_lock_detect user_shstk avx_vnni dtherm ida arat pln pts hwp hwp_notify hwp_act_window hwp_epp hwp_pkg_req hfi vnmi umip pku ospke waitpkg gfni vaes vpclmulqdq rdpid moviri movdir64b fsrm md_clear serialize arch_lbr ibt flush_l1d arch_capabilities",
//           "vmx flags\t: vnmi preemption_timer posted_intr invvpid ept_x_only ept_ad ept_1gb flexpriority apicv tsc_offset vtpr mtf vapic ept vpid unrestricted_guest vapic_regvid ple shadow_vmcs ept_mode_based_exec tsc_scaling usr_wait_pause",
//           "bugs\t\t: spectre_v1 spectre_v2 spec_store_bypass swapgs eibrs_pbrsb rfds bhi",
//           "bogomips\t: 5222.40",
//           "clflush size\t: 64",
//           "cache_alignment\t: 64",
//           "address sizes\t: 39 bits physical, 48 bits virtual",
//           "power management:",
//           "",
//           "processor\t: 4",
//           "vendor_id\t: GenuineIntel",
//           "cpu family\t: 6",
//           "model\t\t: 154",
//           "model name\t: 12th Gen Intel(R) Core(TM) i7-1255U",
//           "stepping\t: 4",
//           "microcode\t: 0x433",
//           "cpu MHz\t\t: 3500.003",
//           "cache size\t: 12288 KB",
//           "physical id\t: 0",
//           "siblings\t: 12",
//           "core id\t\t: 8",
//           "cpu cores\t: 10",
//           "apicid\t\t: 16",
//           "initial apicid\t: 16",
//           "fpu\t\t: yes",
//           "fpu_exception\t: yes",
//           "cpuid level\t: 32",
//           "wp\t\t: yes",
//           "flags\t\t: fpu vme de pse tsc msr pae mce cx8 apic sep mtrr pge mca cmov pat pse36 clflush dts acpi mmx fxsr sse sse2 ss ht tm pbe syscall nx pdpe1gb rdtscp lm contant_tsc art arch_perfmon pebs bts rep_good nopl xtopology nonstop_tsc cpuid aperfmperf tsc_known_freq pni pclmulqdq dtes64 monitor ds_cpl vmx smx est tm2 ssse3 sdbg fma cx16 xpr pdcm sse4_1 sse4_2 x2apic movbe popcnt tsc_deadline_timer aes xsave avx f16c rdrand lahf_lm abm 3dnowprefetch cpuid_fault epb cat_l2 cdp_l2 ssbd ibrs ibpb stibp ibrs_enhance tpr_shadow flexpriority ept vpid ept_ad fsgsbase tsc_adjust bmi1 avx2 smep bmi2 erms invpcid rdt_a rdseed adx smap clflushopt clwb intel_pt sha_ni xsaveopt xsavec xgetbv1 xsavs split_lock_detect user_shstk avx_vnni dtherm ida arat pln pts hwp hwp_notify hwp_act_window hwp_epp hwp_pkg_req hfi vnmi umip pku ospke waitpkg gfni vaes vpclmulqdq rdpid moviri movdir64b fsrm md_clear serialize arch_lbr ibt flush_l1d arch_capabilities",
//           "vmx flags\t: vnmi preemption_timer posted_intr invvpid ept_x_only ept_ad ept_1gb flexpriority apicv tsc_offset vtpr mtf vapic ept vpid unrestricted_guest vapic_regvid ple shadow_vmcs ept_mode_based_exec tsc_scaling usr_wait_pause",
//           "bugs\t\t: spectre_v1 spectre_v2 spec_store_bypass swapgs eibrs_pbrsb rfds bhi",
//           "bogomips\t: 5222.40",
//           "clflush size\t: 64",
//           "cache_alignment\t: 64",
//           "address sizes\t: 39 bits physical, 48 bits virtual",
//           "power management:",
//           "",
//           "processor\t: 5",
//           "vendor_id\t: GenuineIntel",
//           "cpu family\t: 6",
//           "model\t\t: 154",
//           "model name\t: 12th Gen Intel(R) Core(TM) i7-1255U",
//           "stepping\t: 4",
//           "microcode\t: 0x433",
//           "cpu MHz\t\t: 3498.771",
//           "cache size\t: 12288 KB",
//           "physical id\t: 0",
//           "siblings\t: 12",
//           "core id\t\t: 9",
//           "cpu cores\t: 10",
//           "apicid\t\t: 18",
//           "initial apicid\t: 18",
//           "fpu\t\t: yes",
//           "fpu_exception\t: yes",
//           "cpuid level\t: 32",
//           "wp\t\t: yes",
//           "flags\t\t: fpu vme de pse tsc msr pae mce cx8 apic sep mtrr pge mca cmov pat pse36 clflush dts acpi mmx fxsr sse sse2 ss ht tm pbe syscall nx pdpe1gb rdtscp lm contant_tsc art arch_perfmon pebs bts rep_good nopl xtopology nonstop_tsc cpuid aperfmperf tsc_known_freq pni pclmulqdq dtes64 monitor ds_cpl vmx smx est tm2 ssse3 sdbg fma cx16 xpr pdcm sse4_1 sse4_2 x2apic movbe popcnt tsc_deadline_timer aes xsave avx f16c rdrand lahf_lm abm 3dnowprefetch cpuid_fault epb cat_l2 cdp_l2 ssbd ibrs ibpb stibp ibrs_enhance tpr_shadow flexpriority ept vpid ept_ad fsgsbase tsc_adjust bmi1 avx2 smep bmi2 erms invpcid rdt_a rdseed adx smap clflushopt clwb intel_pt sha_ni xsaveopt xsavec xgetbv1 xsavs split_lock_detect user_shstk avx_vnni dtherm ida arat pln pts hwp hwp_notify hwp_act_window hwp_epp hwp_pkg_req hfi vnmi umip pku ospke waitpkg gfni vaes vpclmulqdq rdpid moviri movdir64b fsrm md_clear serialize arch_lbr ibt flush_l1d arch_capabilities",
//           "vmx flags\t: vnmi preemption_timer posted_intr invvpid ept_x_only ept_ad ept_1gb flexpriority apicv tsc_offset vtpr mtf vapic ept vpid unrestricted_guest vapic_regvid ple shadow_vmcs ept_mode_based_exec tsc_scaling usr_wait_pause",
//           "bugs\t\t: spectre_v1 spectre_v2 spec_store_bypass swapgs eibrs_pbrsb rfds bhi",
//           "bogomips\t: 5222.40",
//           "clflush size\t: 64",
//           "cache_alignment\t: 64",
//           "address sizes\t: 39 bits physical, 48 bits virtual",
//           "power management:",
//           "",
//           "processor\t: 6",
//           "vendor_id\t: GenuineIntel",
//           "cpu family\t: 6",
//           "model\t\t: 154",
//           "model name\t: 12th Gen Intel(R) Core(TM) i7-1255U",
//           "stepping\t: 4",
//           "microcode\t: 0x433",
//           "cpu MHz\t\t: 3501.847",
//           "cache size\t: 12288 KB",
//           "physical id\t: 0",
//           "siblings\t: 12",
//           "core id\t\t: 10",
//           "cpu cores\t: 10",
//           "apicid\t\t: 20",
//           "initial apicid\t: 20",
//           "fpu\t\t: yes",
//           "fpu_exception\t: yes",
//           "cpuid level\t: 32",
//           "wp\t\t: yes",
//           "flags\t\t: fpu vme de pse tsc msr pae mce cx8 apic sep mtrr pge mca cmov pat pse36 clflush dts acpi mmx fxsr sse sse2 ss ht tm pbe syscall nx pdpe1gb rdtscp lm contant_tsc art arch_perfmon pebs bts rep_good nopl xtopology nonstop_tsc cpuid aperfmperf tsc_known_freq pni pclmulqdq dtes64 monitor ds_cpl vmx smx est tm2 ssse3 sdbg fma cx16 xpr pdcm sse4_1 sse4_2 x2apic movbe popcnt tsc_deadline_timer aes xsave avx f16c rdrand lahf_lm abm 3dnowprefetch cpuid_fault epb cat_l2 cdp_l2 ssbd ibrs ibpb stibp ibrs_enhance tpr_shadow flexpriority ept vpid ept_ad fsgsbase tsc_adjust bmi1 avx2 smep bmi2 erms invpcid rdt_a rdseed adx smap clflushopt clwb intel_pt sha_ni xsaveopt xsavec xgetbv1 xsavs split_lock_detect user_shstk avx_vnni dtherm ida arat pln pts hwp hwp_notify hwp_act_window hwp_epp hwp_pkg_req hfi vnmi umip pku ospke waitpkg gfni vaes vpclmulqdq rdpid moviri movdir64b fsrm md_clear serialize arch_lbr ibt flush_l1d arch_capabilities",
//           "vmx flags\t: vnmi preemption_timer posted_intr invvpid ept_x_only ept_ad ept_1gb flexpriority apicv tsc_offset vtpr mtf vapic ept vpid unrestricted_guest vapic_regvid ple shadow_vmcs ept_mode_based_exec tsc_scaling usr_wait_pause",
//           "bugs\t\t: spectre_v1 spectre_v2 spec_store_bypass swapgs eibrs_pbrsb rfds bhi",
//           "bogomips\t: 5222.40",
//           "clflush size\t: 64",
//           "cache_alignment\t: 64",
//           "address sizes\t: 39 bits physical, 48 bits virtual",
//           "power management:",
//           "",
//           "processor\t: 7",
//           "vendor_id\t: GenuineIntel",
//           "cpu family\t: 6",
//           "model\t\t: 154",
//           "model name\t: 12th Gen Intel(R) Core(TM) i7-1255U",
//           "stepping\t: 4",
//           "microcode\t: 0x433",
//           "cpu MHz\t\t: 3500.041",
//           "cache size\t: 12288 KB",
//           "physical id\t: 0",
//           "siblings\t: 12",
//           "core id\t\t: 11",
//           "cpu cores\t: 10",
//           "apicid\t\t: 22",
//           "initial apicid\t: 22",
//           "fpu\t\t: yes",
//           "fpu_exception\t: yes",
//           "cpuid level\t: 32",
//           "wp\t\t: yes",
//           "flags\t\t: fpu vme de pse tsc msr pae mce cx8 apic sep mtrr pge mca cmov pat pse36 clflush dts acpi mmx fxsr sse sse2 ss ht tm pbe syscall nx pdpe1gb rdtscp lm contant_tsc art arch_perfmon pebs bts rep_good nopl xtopology nonstop_tsc cpuid aperfmperf tsc_known_freq pni pclmulqdq dtes64 monitor ds_cpl vmx smx est tm2 ssse3 sdbg fma cx16 xpr pdcm sse4_1 sse4_2 x2apic movbe popcnt tsc_deadline_timer aes xsave avx f16c rdrand lahf_lm abm 3dnowprefetch cpuid_fault epb cat_l2 cdp_l2 ssbd ibrs ibpb stibp ibrs_enhance tpr_shadow flexpriority ept vpid ept_ad fsgsbase tsc_adjust bmi1 avx2 smep bmi2 erms invpcid rdt_a rdseed adx smap clflushopt clwb intel_pt sha_ni xsaveopt xsavec xgetbv1 xsavs split_lock_detect user_shstk avx_vnni dtherm ida arat pln pts hwp hwp_notify hwp_act_window hwp_epp hwp_pkg_req hfi vnmi umip pku ospke waitpkg gfni vaes vpclmulqdq rdpid moviri movdir64b fsrm md_clear serialize arch_lbr ibt flush_l1d arch_capabilities",
//           "vmx flags\t: vnmi preemption_timer posted_intr invvpid ept_x_only ept_ad ept_1gb flexpriority apicv tsc_offset vtpr mtf vapic ept vpid unrestricted_guest vapic_regvid ple shadow_vmcs ept_mode_based_exec tsc_scaling usr_wait_pause",
//           "bugs\t\t: spectre_v1 spectre_v2 spec_store_bypass swapgs eibrs_pbrsb rfds bhi",
//           "bogomips\t: 5222.40",
//           "clflush size\t: 64",
//           "cache_alignment\t: 64",
//           "address sizes\t: 39 bits physical, 48 bits virtual",
//           "power management:",
//           "",
//           "processor\t: 8",
//           "vendor_id\t: GenuineIntel",
//           "cpu family\t: 6",
//           "model\t\t: 154",
//           "model name\t: 12th Gen Intel(R) Core(TM) i7-1255U",
//           "stepping\t: 4",
//           "microcode\t: 0x433",
//           "cpu MHz\t\t: 3500.111",
//           "cache size\t: 12288 KB",
//           "physical id\t: 0",
//           "siblings\t: 12",
//           "core id\t\t: 12",
//           "cpu cores\t: 10",
//           "apicid\t\t: 24",
//           "initial apicid\t: 24",
//           "fpu\t\t: yes",
//           "fpu_exception\t: yes",
//           "cpuid level\t: 32",
//           "wp\t\t: yes",
//           "flags\t\t: fpu vme de pse tsc msr pae mce cx8 apic sep mtrr pge mca cmov pat pse36 clflush dts acpi mmx fxsr sse sse2 ss ht tm pbe syscall nx pdpe1gb rdtscp lm contant_tsc art arch_perfmon pebs bts rep_good nopl xtopology nonstop_tsc cpuid aperfmperf tsc_known_freq pni pclmulqdq dtes64 monitor ds_cpl vmx smx est tm2 ssse3 sdbg fma cx16 xpr pdcm sse4_1 sse4_2 x2apic movbe popcnt tsc_deadline_timer aes xsave avx f16c rdrand lahf_lm abm 3dnowprefetch cpuid_fault epb cat_l2 cdp_l2 ssbd ibrs ibpb stibp ibrs_enhance tpr_shadow flexpriority ept vpid ept_ad fsgsbase tsc_adjust bmi1 avx2 smep bmi2 erms invpcid rdt_a rdseed adx smap clflushopt clwb intel_pt sha_ni xsaveopt xsavec xgetbv1 xsavs split_lock_detect user_shstk avx_vnni dtherm ida arat pln pts hwp hwp_notify hwp_act_window hwp_epp hwp_pkg_req hfi vnmi umip pku ospke waitpkg gfni vaes vpclmulqdq rdpid moviri movdir64b fsrm md_clear serialize arch_lbr ibt flush_l1d arch_capabilities",
//           "vmx flags\t: vnmi preemption_timer posted_intr invvpid ept_x_only ept_ad ept_1gb flexpriority apicv tsc_offset vtpr mtf vapic ept vpid unrestricted_guest vapic_regvid ple shadow_vmcs ept_mode_based_exec tsc_scaling usr_wait_pause",
//           "bugs\t\t: spectre_v1 spectre_v2 spec_store_bypass swapgs eibrs_pbrsb rfds bhi",
//           "bogomips\t: 5222.40",
//           "clflush size\t: 64",
//           "cache_alignment\t: 64",
//           "address sizes\t: 39 bits physical, 48 bits virtual",
//           "power management:",
//           "",
//           "processor\t: 9",
//           "vendor_id\t: GenuineIntel",
//           "cpu family\t: 6",
//           "model\t\t: 154",
//           "model name\t: 12th Gen Intel(R) Core(TM) i7-1255U",
//           "stepping\t: 4",
//           "microcode\t: 0x433",
//           "cpu MHz\t\t: 3500.011",
//           "cache size\t: 12288 KB",
//           "physical id\t: 0",
//           "siblings\t: 12",
//           "core id\t\t: 13",
//           "cpu cores\t: 10",
//           "apicid\t\t: 26",
//           "initial apicid\t: 26",
//           "fpu\t\t: yes",
//           "fpu_exception\t: yes",
//           "cpuid level\t: 32",
//           "wp\t\t: yes",
//           "flags\t\t: fpu vme de pse tsc msr pae mce cx8 apic sep mtrr pge mca cmov pat pse36 clflush dts acpi mmx fxsr sse sse2 ss ht tm pbe syscall nx pdpe1gb rdtscp lm contant_tsc art arch_perfmon pebs bts rep_good nopl xtopology nonstop_tsc cpuid aperfmperf tsc_known_freq pni pclmulqdq dtes64 monitor ds_cpl vmx smx est tm2 ssse3 sdbg fma cx16 xpr pdcm sse4_1 sse4_2 x2apic movbe popcnt tsc_deadline_timer aes xsave avx f16c rdrand lahf_lm abm 3dnowprefetch cpuid_fault epb cat_l2 cdp_l2 ssbd ibrs ibpb stibp ibrs_enhance tpr_shadow flexpriority ept vpid ept_ad fsgsbase tsc_adjust bmi1 avx2 smep bmi2 erms invpcid rdt_a rdseed adx smap clflushopt clwb intel_pt sha_ni xsaveopt xsavec xgetbv1 xsavs split_lock_detect user_shstk avx_vnni dtherm ida arat pln pts hwp hwp_notify hwp_act_window hwp_epp hwp_pkg_req hfi vnmi umip pku ospke waitpkg gfni vaes vpclmulqdq rdpid moviri movdir64b fsrm md_clear serialize arch_lbr ibt flush_l1d arch_capabilities",
//           "vmx flags\t: vnmi preemption_timer posted_intr invvpid ept_x_only ept_ad ept_1gb flexpriority apicv tsc_offset vtpr mtf vapic ept vpid unrestricted_guest vapic_regvid ple shadow_vmcs ept_mode_based_exec tsc_scaling usr_wait_pause",
//           "bugs\t\t: spectre_v1 spectre_v2 spec_store_bypass swapgs eibrs_pbrsb rfds bhi",
//           "bogomips\t: 5222.40",
//           "clflush size\t: 64",
//           "cache_alignment\t: 64",
//           "address sizes\t: 39 bits physical, 48 bits virtual",
//           "power management:",
//           "",
//           "processor\t: 10",
//           "vendor_id\t: GenuineIntel",
//           "cpu family\t: 6",
//           "model\t\t: 154",
//           "model name\t: 12th Gen Intel(R) Core(TM) i7-1255U",
//           "stepping\t: 4",
//           "microcode\t: 0x433",
//           "cpu MHz\t\t: 3499.934",
//           "cache size\t: 12288 KB",
//           "physical id\t: 0",
//           "siblings\t: 12",
//           "core id\t\t: 14",
//           "cpu cores\t: 10",
//           "apicid\t\t: 28",
//           "initial apicid\t: 28",
//           "fpu\t\t: yes",
//           "fpu_exception\t: yes",
//           "cpuid level\t: 32",
//           "wp\t\t: yes",
//           "flags\t\t: fpu vme de pse tsc msr pae mce cx8 apic sep mtrr pge mca cmov pat pse36 clflush dts acpi mmx fxsr sse sse2 ss ht tm pbe syscall nx pdpe1gb rdtscp lm contant_tsc art arch_perfmon pebs bts rep_good nopl xtopology nonstop_tsc cpuid aperfmperf tsc_known_freq pni pclmulqdq dtes64 monitor ds_cpl vmx smx est tm2 ssse3 sdbg fma cx16 xpr pdcm sse4_1 sse4_2 x2apic movbe popcnt tsc_deadline_timer aes xsave avx f16c rdrand lahf_lm abm 3dnowprefetch cpuid_fault epb cat_l2 cdp_l2 ssbd ibrs ibpb stibp ibrs_enhance tpr_shadow flexpriority ept vpid ept_ad fsgsbase tsc_adjust bmi1 avx2 smep bmi2 erms invpcid rdt_a rdseed adx smap clflushopt clwb intel_pt sha_ni xsaveopt xsavec xgetbv1 xsavs split_lock_detect user_shstk avx_vnni dtherm ida arat pln pts hwp hwp_notify hwp_act_window hwp_epp hwp_pkg_req hfi vnmi umip pku ospke waitpkg gfni vaes vpclmulqdq rdpid moviri movdir64b fsrm md_clear serialize arch_lbr ibt flush_l1d arch_capabilities",
//           "vmx flags\t: vnmi preemption_timer posted_intr invvpid ept_x_only ept_ad ept_1gb flexpriority apicv tsc_offset vtpr mtf vapic ept vpid unrestricted_guest vapic_regvid ple shadow_vmcs ept_mode_based_exec tsc_scaling usr_wait_pause",
//           "bugs\t\t: spectre_v1 spectre_v2 spec_store_bypass swapgs eibrs_pbrsb rfds bhi",
//           "bogomips\t: 5222.40",
//           "clflush size\t: 64",
//           "cache_alignment\t: 64",
//           "address sizes\t: 39 bits physical, 48 bits virtual",
//           "power management:",
//           "",
//           "processor\t: 11",
//           "vendor_id\t: GenuineIntel",
//           "cpu family\t: 6",
//           "model\t\t: 154",
//           "model name\t: 12th Gen Intel(R) Core(TM) i7-1255U",
//           "stepping\t: 4",
//           "microcode\t: 0x433",
//           "cpu MHz\t\t: 3500.179",
//           "cache size\t: 12288 KB",
//           "physical id\t: 0",
//           "siblings\t: 12",
//           "core id\t\t: 15",
//           "cpu cores\t: 10",
//           "apicid\t\t: 30",
//           "initial apicid\t: 30",
//           "fpu\t\t: yes",
//           "fpu_exception\t: yes",
//           "cpuid level\t: 32",
//           "wp\t\t: yes",
//           "flags\t\t: fpu vme de pse tsc msr pae mce cx8 apic sep mtrr pge mca cmov pat pse36 clflush dts acpi mmx fxsr sse sse2 ss ht tm pbe syscall nx pdpe1gb rdtscp lm contant_tsc art arch_perfmon pebs bts rep_good nopl xtopology nonstop_tsc cpuid aperfmperf tsc_known_freq pni pclmulqdq dtes64 monitor ds_cpl vmx smx est tm2 ssse3 sdbg fma cx16 xpr pdcm sse4_1 sse4_2 x2apic movbe popcnt tsc_deadline_timer aes xsave avx f16c rdrand lahf_lm abm 3dnowprefetch cpuid_fault epb cat_l2 cdp_l2 ssbd ibrs ibpb stibp ibrs_enhance tpr_shadow flexpriority ept vpid ept_ad fsgsbase tsc_adjust bmi1 avx2 smep bmi2 erms invpcid rdt_a rdseed adx smap clflushopt clwb intel_pt sha_ni xsaveopt xsavec xgetbv1 xsavs split_lock_detect user_shstk avx_vnni dtherm ida arat pln pts hwp hwp_notify hwp_act_window hwp_epp hwp_pkg_req hfi vnmi umip pku ospke waitpkg gfni vaes vpclmulqdq rdpid moviri movdir64b fsrm md_clear serialize arch_lbr ibt flush_l1d arch_capabilities",
//           "vmx flags\t: vnmi preemption_timer posted_intr invvpid ept_x_only ept_ad ept_1gb flexpriority apicv tsc_offset vtpr mtf vapic ept vpid unrestricted_guest vapic_regvid ple shadow_vmcs ept_mode_based_exec tsc_scaling usr_wait_pause",
//           "bugs\t\t: spectre_v1 spectre_v2 spec_store_bypass swapgs eibrs_pbrsb rfds bhi",
//           "bogomips\t: 5222.40",
//           "clflush size\t: 64",
//           "cache_alignment\t: 64",
//           "address sizes\t: 39 bits physical, 48 bits virtual",
//           "power management:"];
//         myType = "Cloud";
//         myGroups =  ["cloud-nodes"];
//         myEpoch = (Number(Number(currentEpoch)).toFixed(3));
//         myIcon = "pi pi-cloud";
//         myLastUpdate = "2024-10-10:21:50:22";
//         myUptime = (Number(Number("3279890.20")/3600)).toFixed(3);
        
//         myServer = this.setTestServer(myCPU, myEpoch, myGroups, myhostname, myIcon, myLastUpdate, myStatus, myType, myUptime);

//         // console.log("--------- myServer 5 ---------");
//         // console.log(myServer5);
        
//         postsArray.push(myServer);

//         this.hosts.push(myhostname);
        
//         myhostname = "creede";
//         myCPU = [
//           "processor\t: 0",
//           "vendor_id\t: GenuineIntel",
//           "cpu family\t: 6",
//           "model\t\t: 158",
//           "model name\t: Intel(R) Xeon(R) E-2136 CPU @ 3.30GHz",
//           "stepping\t: 10",
//           "microcode\t: 0xf8",
//           "cpu MHz\t\t: 4295.378",
//           "cache size\t: 12288 KB",
//           "physical id\t: 0",
//           "siblings\t: 12",
//           "core id\t\t: 0",
//           "cpu cores\t: 6",
//           "apicid\t\t: 0",
//           "initial apicid\t: 0",
//           "fpu\t\t: yes",
//           "fpu_exception\t: yes",
//           "cpuid level\t: 22",
//           "wp\t\t: yes",
//           "flags\t\t: fpu vme de pse tsc msr pae mce cx8 apic sep mtrr pge mca cmov pat pse36 clflush dts acpi mmx fxsr sse sse2 ss ht tm pbe syscall nx pdpe1gb rdtscp lm contant_tsc art arch_perfmon pebs bts rep_good nopl xtopology nonstop_tsc cpuid aperfmperf pni pclmulqdq dtes64 monitor ds_cpl vmx smx est tm2 ssse3 sdbg fma cx16 xtpr pdcm pcid se4_1 sse4_2 x2apic movbe popcnt tsc_deadline_timer aes xsave avx f16c rdrand lahf_lm abm 3dnowprefetch cpuid_fault epb invpcid_single pti ssbd ibrs ibpb stibp tpr_shadow vnmi fexpriority ept vpid ept_ad fsgsbase tsc_adjust bmi1 avx2 smep bmi2 erms invpcid mpx rdseed adx smap clflushopt intel_pt xsaveopt xsavec xgetbv1 xsaves dtherm ida arat pln pts hp hwp_notify hwp_act_window hwp_epp md_clear flush_l1d arch_capabilities",
//           "vmx flags\t: vnmi preemption_timer invvpid ept_x_only ept_ad ept_1gb flexpriority tsc_offset vtpr mtf vapic ept vpid unrestricted_guest ple shadow_vmcs pml ept_mod_based_exec",
//           "bugs\t\t: cpu_meltdown spectre_v1 spectre_v2 spec_store_bypass l1tf mds swapgs taa itlb_multihit srbds mmio_stale_data retbleed gds",
//           "bogomips\t: 6599.98",
//           "clflush size\t: 64",
//           "cache_alignment\t: 64",
//           "address sizes\t: 39 bits physical, 48 bits virtual",
//           "power management:",
//           "",
//           "processor\t: 1",
//           "vendor_id\t: GenuineIntel",
//           "cpu family\t: 6",
//           "model\t\t: 158",
//           "model name\t: Intel(R) Xeon(R) E-2136 CPU @ 3.30GHz",
//           "stepping\t: 10",
//           "microcode\t: 0xf8",
//           "cpu MHz\t\t: 3300.000",
//           "cache size\t: 12288 KB",
//           "physical id\t: 0",
//           "siblings\t: 12",
//           "core id\t\t: 1",
//           "cpu cores\t: 6",
//           "apicid\t\t: 2",
//           "initial apicid\t: 2",
//           "fpu\t\t: yes",
//           "fpu_exception\t: yes",
//           "cpuid level\t: 22",
//           "wp\t\t: yes",
//           "flags\t\t: fpu vme de pse tsc msr pae mce cx8 apic sep mtrr pge mca cmov pat pse36 clflush dts acpi mmx fxsr sse sse2 ss ht tm pbe syscall nx pdpe1gb rdtscp lm contant_tsc art arch_perfmon pebs bts rep_good nopl xtopology nonstop_tsc cpuid aperfmperf pni pclmulqdq dtes64 monitor ds_cpl vmx smx est tm2 ssse3 sdbg fma cx16 xtpr pdcm pcid se4_1 sse4_2 x2apic movbe popcnt tsc_deadline_timer aes xsave avx f16c rdrand lahf_lm abm 3dnowprefetch cpuid_fault epb invpcid_single pti ssbd ibrs ibpb stibp tpr_shadow vnmi fexpriority ept vpid ept_ad fsgsbase tsc_adjust bmi1 avx2 smep bmi2 erms invpcid mpx rdseed adx smap clflushopt intel_pt xsaveopt xsavec xgetbv1 xsaves dtherm ida arat pln pts hp hwp_notify hwp_act_window hwp_epp md_clear flush_l1d arch_capabilities",
//           "vmx flags\t: vnmi preemption_timer invvpid ept_x_only ept_ad ept_1gb flexpriority tsc_offset vtpr mtf vapic ept vpid unrestricted_guest ple shadow_vmcs pml ept_mod_based_exec",
//           "bugs\t\t: cpu_meltdown spectre_v1 spectre_v2 spec_store_bypass l1tf mds swapgs taa itlb_multihit srbds mmio_stale_data retbleed gds",
//           "bogomips\t: 6599.98",
//           "clflush size\t: 64",
//           "cache_alignment\t: 64",
//           "address sizes\t: 39 bits physical, 48 bits virtual",
//           "power management:",
//           "",
//           "processor\t: 2",
//           "vendor_id\t: GenuineIntel",
//           "cpu family\t: 6",
//           "model\t\t: 158",
//           "model name\t: Intel(R) Xeon(R) E-2136 CPU @ 3.30GHz",
//           "stepping\t: 10",
//           "microcode\t: 0xf8",
//           "cpu MHz\t\t: 3300.000",
//           "cache size\t: 12288 KB",
//           "physical id\t: 0",
//           "siblings\t: 12",
//           "core id\t\t: 2",
//           "cpu cores\t: 6",
//           "apicid\t\t: 4",
//           "initial apicid\t: 4",
//           "fpu\t\t: yes",
//           "fpu_exception\t: yes",
//           "cpuid level\t: 22",
//           "wp\t\t: yes",
//           "flags\t\t: fpu vme de pse tsc msr pae mce cx8 apic sep mtrr pge mca cmov pat pse36 clflush dts acpi mmx fxsr sse sse2 ss ht tm pbe syscall nx pdpe1gb rdtscp lm contant_tsc art arch_perfmon pebs bts rep_good nopl xtopology nonstop_tsc cpuid aperfmperf pni pclmulqdq dtes64 monitor ds_cpl vmx smx est tm2 ssse3 sdbg fma cx16 xtpr pdcm pcid se4_1 sse4_2 x2apic movbe popcnt tsc_deadline_timer aes xsave avx f16c rdrand lahf_lm abm 3dnowprefetch cpuid_fault epb invpcid_single pti ssbd ibrs ibpb stibp tpr_shadow vnmi fexpriority ept vpid ept_ad fsgsbase tsc_adjust bmi1 avx2 smep bmi2 erms invpcid mpx rdseed adx smap clflushopt intel_pt xsaveopt xsavec xgetbv1 xsaves dtherm ida arat pln pts hp hwp_notify hwp_act_window hwp_epp md_clear flush_l1d arch_capabilities",
//           "vmx flags\t: vnmi preemption_timer invvpid ept_x_only ept_ad ept_1gb flexpriority tsc_offset vtpr mtf vapic ept vpid unrestricted_guest ple shadow_vmcs pml ept_mod_based_exec",
//           "bugs\t\t: cpu_meltdown spectre_v1 spectre_v2 spec_store_bypass l1tf mds swapgs taa itlb_multihit srbds mmio_stale_data retbleed gds",
//           "bogomips\t: 6599.98",
//           "clflush size\t: 64",
//           "cache_alignment\t: 64",
//           "address sizes\t: 39 bits physical, 48 bits virtual",
//           "power management:",
//           "",
//           "processor\t: 3",
//           "vendor_id\t: GenuineIntel",
//           "cpu family\t: 6",
//           "model\t\t: 158",
//           "model name\t: Intel(R) Xeon(R) E-2136 CPU @ 3.30GHz",
//           "stepping\t: 10",
//           "microcode\t: 0xf8",
//           "cpu MHz\t\t: 3300.000",
//           "cache size\t: 12288 KB",
//           "physical id\t: 0",
//           "siblings\t: 12",
//           "core id\t\t: 3",
//           "cpu cores\t: 6",
//           "apicid\t\t: 6",
//           "initial apicid\t: 6",
//           "fpu\t\t: yes",
//           "fpu_exception\t: yes",
//           "cpuid level\t: 22",
//           "wp\t\t: yes",
//           "flags\t\t: fpu vme de pse tsc msr pae mce cx8 apic sep mtrr pge mca cmov pat pse36 clflush dts acpi mmx fxsr sse sse2 ss ht tm pbe syscall nx pdpe1gb rdtscp lm contant_tsc art arch_perfmon pebs bts rep_good nopl xtopology nonstop_tsc cpuid aperfmperf pni pclmulqdq dtes64 monitor ds_cpl vmx smx est tm2 ssse3 sdbg fma cx16 xtpr pdcm pcid se4_1 sse4_2 x2apic movbe popcnt tsc_deadline_timer aes xsave avx f16c rdrand lahf_lm abm 3dnowprefetch cpuid_fault epb invpcid_single pti ssbd ibrs ibpb stibp tpr_shadow vnmi fexpriority ept vpid ept_ad fsgsbase tsc_adjust bmi1 avx2 smep bmi2 erms invpcid mpx rdseed adx smap clflushopt intel_pt xsaveopt xsavec xgetbv1 xsaves dtherm ida arat pln pts hp hwp_notify hwp_act_window hwp_epp md_clear flush_l1d arch_capabilities",
//           "vmx flags\t: vnmi preemption_timer invvpid ept_x_only ept_ad ept_1gb flexpriority tsc_offset vtpr mtf vapic ept vpid unrestricted_guest ple shadow_vmcs pml ept_mod_based_exec",
//           "bugs\t\t: cpu_meltdown spectre_v1 spectre_v2 spec_store_bypass l1tf mds swapgs taa itlb_multihit srbds mmio_stale_data retbleed gds",
//           "bogomips\t: 6599.98",
//           "clflush size\t: 64",
//           "cache_alignment\t: 64",
//           "address sizes\t: 39 bits physical, 48 bits virtual",
//           "power management:",
//           "",
//           "processor\t: 4",
//           "vendor_id\t: GenuineIntel",
//           "cpu family\t: 6",
//           "model\t\t: 158",
//           "model name\t: Intel(R) Xeon(R) E-2136 CPU @ 3.30GHz",
//           "stepping\t: 10",
//           "microcode\t: 0xf8",
//           "cpu MHz\t\t: 3300.000",
//           "cache size\t: 12288 KB",
//           "physical id\t: 0",
//           "siblings\t: 12",
//           "core id\t\t: 4",
//           "cpu cores\t: 6",
//           "apicid\t\t: 8",
//           "initial apicid\t: 8",
//           "fpu\t\t: yes",
//           "fpu_exception\t: yes",
//           "cpuid level\t: 22",
//           "wp\t\t: yes",
//           "flags\t\t: fpu vme de pse tsc msr pae mce cx8 apic sep mtrr pge mca cmov pat pse36 clflush dts acpi mmx fxsr sse sse2 ss ht tm pbe syscall nx pdpe1gb rdtscp lm contant_tsc art arch_perfmon pebs bts rep_good nopl xtopology nonstop_tsc cpuid aperfmperf pni pclmulqdq dtes64 monitor ds_cpl vmx smx est tm2 ssse3 sdbg fma cx16 xtpr pdcm pcid se4_1 sse4_2 x2apic movbe popcnt tsc_deadline_timer aes xsave avx f16c rdrand lahf_lm abm 3dnowprefetch cpuid_fault epb invpcid_single pti ssbd ibrs ibpb stibp tpr_shadow vnmi fexpriority ept vpid ept_ad fsgsbase tsc_adjust bmi1 avx2 smep bmi2 erms invpcid mpx rdseed adx smap clflushopt intel_pt xsaveopt xsavec xgetbv1 xsaves dtherm ida arat pln pts hp hwp_notify hwp_act_window hwp_epp md_clear flush_l1d arch_capabilities",
//           "vmx flags\t: vnmi preemption_timer invvpid ept_x_only ept_ad ept_1gb flexpriority tsc_offset vtpr mtf vapic ept vpid unrestricted_guest ple shadow_vmcs pml ept_mod_based_exec",
//           "bugs\t\t: cpu_meltdown spectre_v1 spectre_v2 spec_store_bypass l1tf mds swapgs taa itlb_multihit srbds mmio_stale_data retbleed gds",
//           "bogomips\t: 6599.98",
//           "clflush size\t: 64",
//           "cache_alignment\t: 64",
//           "address sizes\t: 39 bits physical, 48 bits virtual",
//           "power management:",
//           "",
//           "processor\t: 5",
//           "vendor_id\t: GenuineIntel",
//           "cpu family\t: 6",
//           "model\t\t: 158",
//           "model name\t: Intel(R) Xeon(R) E-2136 CPU @ 3.30GHz",
//           "stepping\t: 10",
//           "microcode\t: 0xf8",
//           "cpu MHz\t\t: 3300.000",
//           "cache size\t: 12288 KB",
//           "physical id\t: 0",
//           "siblings\t: 12",
//           "core id\t\t: 5",
//           "cpu cores\t: 6",
//           "apicid\t\t: 10",
//           "initial apicid\t: 10",
//           "fpu\t\t: yes",
//           "fpu_exception\t: yes",
//           "cpuid level\t: 22",
//           "wp\t\t: yes",
//           "flags\t\t: fpu vme de pse tsc msr pae mce cx8 apic sep mtrr pge mca cmov pat pse36 clflush dts acpi mmx fxsr sse sse2 ss ht tm pbe syscall nx pdpe1gb rdtscp lm contant_tsc art arch_perfmon pebs bts rep_good nopl xtopology nonstop_tsc cpuid aperfmperf pni pclmulqdq dtes64 monitor ds_cpl vmx smx est tm2 ssse3 sdbg fma cx16 xtpr pdcm pcid se4_1 sse4_2 x2apic movbe popcnt tsc_deadline_timer aes xsave avx f16c rdrand lahf_lm abm 3dnowprefetch cpuid_fault epb invpcid_single pti ssbd ibrs ibpb stibp tpr_shadow vnmi fexpriority ept vpid ept_ad fsgsbase tsc_adjust bmi1 avx2 smep bmi2 erms invpcid mpx rdseed adx smap clflushopt intel_pt xsaveopt xsavec xgetbv1 xsaves dtherm ida arat pln pts hp hwp_notify hwp_act_window hwp_epp md_clear flush_l1d arch_capabilities",
//           "vmx flags\t: vnmi preemption_timer invvpid ept_x_only ept_ad ept_1gb flexpriority tsc_offset vtpr mtf vapic ept vpid unrestricted_guest ple shadow_vmcs pml ept_mod_based_exec",
//           "bugs\t\t: cpu_meltdown spectre_v1 spectre_v2 spec_store_bypass l1tf mds swapgs taa itlb_multihit srbds mmio_stale_data retbleed gds",
//           "bogomips\t: 6599.98",
//           "clflush size\t: 64",
//           "cache_alignment\t: 64",
//           "address sizes\t: 39 bits physical, 48 bits virtual",
//           "power management:",
//           "",
//           "processor\t: 6",
//           "vendor_id\t: GenuineIntel",
//           "cpu family\t: 6",
//           "model\t\t: 158",
//           "model name\t: Intel(R) Xeon(R) E-2136 CPU @ 3.30GHz",
//           "stepping\t: 10",
//           "microcode\t: 0xf8",
//           "cpu MHz\t\t: 3300.000",
//           "cache size\t: 12288 KB",
//           "physical id\t: 0",
//           "siblings\t: 12",
//           "core id\t\t: 0",
//           "cpu cores\t: 6",
//           "apicid\t\t: 1",
//           "initial apicid\t: 1",
//           "fpu\t\t: yes",
//           "fpu_exception\t: yes",
//           "cpuid level\t: 22",
//           "wp\t\t: yes",
//           "flags\t\t: fpu vme de pse tsc msr pae mce cx8 apic sep mtrr pge mca cmov pat pse36 clflush dts acpi mmx fxsr sse sse2 ss ht tm pbe syscall nx pdpe1gb rdtscp lm contant_tsc art arch_perfmon pebs bts rep_good nopl xtopology nonstop_tsc cpuid aperfmperf pni pclmulqdq dtes64 monitor ds_cpl vmx smx est tm2 ssse3 sdbg fma cx16 xtpr pdcm pcid se4_1 sse4_2 x2apic movbe popcnt tsc_deadline_timer aes xsave avx f16c rdrand lahf_lm abm 3dnowprefetch cpuid_fault epb invpcid_single pti ssbd ibrs ibpb stibp tpr_shadow vnmi fexpriority ept vpid ept_ad fsgsbase tsc_adjust bmi1 avx2 smep bmi2 erms invpcid mpx rdseed adx smap clflushopt intel_pt xsaveopt xsavec xgetbv1 xsaves dtherm ida arat pln pts hp hwp_notify hwp_act_window hwp_epp md_clear flush_l1d arch_capabilities",
//           "vmx flags\t: vnmi preemption_timer invvpid ept_x_only ept_ad ept_1gb flexpriority tsc_offset vtpr mtf vapic ept vpid unrestricted_guest ple shadow_vmcs pml ept_mod_based_exec",
//           "bugs\t\t: cpu_meltdown spectre_v1 spectre_v2 spec_store_bypass l1tf mds swapgs taa itlb_multihit srbds mmio_stale_data retbleed gds",
//           "bogomips\t: 6599.98",
//           "clflush size\t: 64",
//           "cache_alignment\t: 64",
//           "address sizes\t: 39 bits physical, 48 bits virtual",
//           "power management:",
//           "",
//           "processor\t: 7",
//           "vendor_id\t: GenuineIntel",
//           "cpu family\t: 6",
//           "model\t\t: 158",
//           "model name\t: Intel(R) Xeon(R) E-2136 CPU @ 3.30GHz",
//           "stepping\t: 10",
//           "microcode\t: 0xf8",
//           "cpu MHz\t\t: 3300.000",
//           "cache size\t: 12288 KB",
//           "physical id\t: 0",
//           "siblings\t: 12",
//           "core id\t\t: 1",
//           "cpu cores\t: 6",
//           "apicid\t\t: 3",
//           "initial apicid\t: 3",
//           "fpu\t\t: yes",
//           "fpu_exception\t: yes",
//           "cpuid level\t: 22",
//           "wp\t\t: yes",
//           "flags\t\t: fpu vme de pse tsc msr pae mce cx8 apic sep mtrr pge mca cmov pat pse36 clflush dts acpi mmx fxsr sse sse2 ss ht tm pbe syscall nx pdpe1gb rdtscp lm contant_tsc art arch_perfmon pebs bts rep_good nopl xtopology nonstop_tsc cpuid aperfmperf pni pclmulqdq dtes64 monitor ds_cpl vmx smx est tm2 ssse3 sdbg fma cx16 xtpr pdcm pcid se4_1 sse4_2 x2apic movbe popcnt tsc_deadline_timer aes xsave avx f16c rdrand lahf_lm abm 3dnowprefetch cpuid_fault epb invpcid_single pti ssbd ibrs ibpb stibp tpr_shadow vnmi fexpriority ept vpid ept_ad fsgsbase tsc_adjust bmi1 avx2 smep bmi2 erms invpcid mpx rdseed adx smap clflushopt intel_pt xsaveopt xsavec xgetbv1 xsaves dtherm ida arat pln pts hp hwp_notify hwp_act_window hwp_epp md_clear flush_l1d arch_capabilities",
//           "vmx flags\t: vnmi preemption_timer invvpid ept_x_only ept_ad ept_1gb flexpriority tsc_offset vtpr mtf vapic ept vpid unrestricted_guest ple shadow_vmcs pml ept_mod_based_exec",
//           "bugs\t\t: cpu_meltdown spectre_v1 spectre_v2 spec_store_bypass l1tf mds swapgs taa itlb_multihit srbds mmio_stale_data retbleed gds",
//           "bogomips\t: 6599.98",
//           "clflush size\t: 64",
//           "cache_alignment\t: 64",
//           "address sizes\t: 39 bits physical, 48 bits virtual",
//           "power management:",
//           "",
//           "processor\t: 8",
//           "vendor_id\t: GenuineIntel",
//           "cpu family\t: 6",
//           "model\t\t: 158",
//           "model name\t: Intel(R) Xeon(R) E-2136 CPU @ 3.30GHz",
//           "stepping\t: 10",
//           "microcode\t: 0xf8",
//           "cpu MHz\t\t: 3300.000",
//           "cache size\t: 12288 KB",
//           "physical id\t: 0",
//           "siblings\t: 12",
//           "core id\t\t: 2",
//           "cpu cores\t: 6",
//           "apicid\t\t: 5",
//           "initial apicid\t: 5",
//           "fpu\t\t: yes",
//           "fpu_exception\t: yes",
//           "cpuid level\t: 22",
//           "wp\t\t: yes",
//           "flags\t\t: fpu vme de pse tsc msr pae mce cx8 apic sep mtrr pge mca cmov pat pse36 clflush dts acpi mmx fxsr sse sse2 ss ht tm pbe syscall nx pdpe1gb rdtscp lm contant_tsc art arch_perfmon pebs bts rep_good nopl xtopology nonstop_tsc cpuid aperfmperf pni pclmulqdq dtes64 monitor ds_cpl vmx smx est tm2 ssse3 sdbg fma cx16 xtpr pdcm pcid se4_1 sse4_2 x2apic movbe popcnt tsc_deadline_timer aes xsave avx f16c rdrand lahf_lm abm 3dnowprefetch cpuid_fault epb invpcid_single pti ssbd ibrs ibpb stibp tpr_shadow vnmi fexpriority ept vpid ept_ad fsgsbase tsc_adjust bmi1 avx2 smep bmi2 erms invpcid mpx rdseed adx smap clflushopt intel_pt xsaveopt xsavec xgetbv1 xsaves dtherm ida arat pln pts hp hwp_notify hwp_act_window hwp_epp md_clear flush_l1d arch_capabilities",
//           "vmx flags\t: vnmi preemption_timer invvpid ept_x_only ept_ad ept_1gb flexpriority tsc_offset vtpr mtf vapic ept vpid unrestricted_guest ple shadow_vmcs pml ept_mod_based_exec",
//           "bugs\t\t: cpu_meltdown spectre_v1 spectre_v2 spec_store_bypass l1tf mds swapgs taa itlb_multihit srbds mmio_stale_data retbleed gds",
//           "bogomips\t: 6599.98",
//           "clflush size\t: 64",
//           "cache_alignment\t: 64",
//           "address sizes\t: 39 bits physical, 48 bits virtual",
//           "power management:",
//           "",
//           "processor\t: 9",
//           "vendor_id\t: GenuineIntel",
//           "cpu family\t: 6",
//           "model\t\t: 158",
//           "model name\t: Intel(R) Xeon(R) E-2136 CPU @ 3.30GHz",
//           "stepping\t: 10",
//           "microcode\t: 0xf8",
//           "cpu MHz\t\t: 3300.000",
//           "cache size\t: 12288 KB",
//           "physical id\t: 0",
//           "siblings\t: 12",
//           "core id\t\t: 3",
//           "cpu cores\t: 6",
//           "apicid\t\t: 7",
//           "initial apicid\t: 7",
//           "fpu\t\t: yes",
//           "fpu_exception\t: yes",
//           "cpuid level\t: 22",
//           "wp\t\t: yes",
//           "flags\t\t: fpu vme de pse tsc msr pae mce cx8 apic sep mtrr pge mca cmov pat pse36 clflush dts acpi mmx fxsr sse sse2 ss ht tm pbe syscall nx pdpe1gb rdtscp lm contant_tsc art arch_perfmon pebs bts rep_good nopl xtopology nonstop_tsc cpuid aperfmperf pni pclmulqdq dtes64 monitor ds_cpl vmx smx est tm2 ssse3 sdbg fma cx16 xtpr pdcm pcid se4_1 sse4_2 x2apic movbe popcnt tsc_deadline_timer aes xsave avx f16c rdrand lahf_lm abm 3dnowprefetch cpuid_fault epb invpcid_single pti ssbd ibrs ibpb stibp tpr_shadow vnmi fexpriority ept vpid ept_ad fsgsbase tsc_adjust bmi1 avx2 smep bmi2 erms invpcid mpx rdseed adx smap clflushopt intel_pt xsaveopt xsavec xgetbv1 xsaves dtherm ida arat pln pts hp hwp_notify hwp_act_window hwp_epp md_clear flush_l1d arch_capabilities",
//           "vmx flags\t: vnmi preemption_timer invvpid ept_x_only ept_ad ept_1gb flexpriority tsc_offset vtpr mtf vapic ept vpid unrestricted_guest ple shadow_vmcs pml ept_mod_based_exec",
//           "bugs\t\t: cpu_meltdown spectre_v1 spectre_v2 spec_store_bypass l1tf mds swapgs taa itlb_multihit srbds mmio_stale_data retbleed gds",
//           "bogomips\t: 6599.98",
//           "clflush size\t: 64",
//           "cache_alignment\t: 64",
//           "address sizes\t: 39 bits physical, 48 bits virtual",
//           "power management:",
//           "",
//           "processor\t: 10",
//           "vendor_id\t: GenuineIntel",
//           "cpu family\t: 6",
//           "model\t\t: 158",
//           "model name\t: Intel(R) Xeon(R) E-2136 CPU @ 3.30GHz",
//           "stepping\t: 10",
//           "microcode\t: 0xf8",
//           "cpu MHz\t\t: 1853.858",
//           "cache size\t: 12288 KB",
//           "physical id\t: 0",
//           "siblings\t: 12",
//           "core id\t\t: 4",
//           "cpu cores\t: 6",
//           "apicid\t\t: 9",
//           "initial apicid\t: 9",
//           "fpu\t\t: yes",
//           "fpu_exception\t: yes",
//           "cpuid level\t: 22",
//           "wp\t\t: yes",
//           "flags\t\t: fpu vme de pse tsc msr pae mce cx8 apic sep mtrr pge mca cmov pat pse36 clflush dts acpi mmx fxsr sse sse2 ss ht tm pbe syscall nx pdpe1gb rdtscp lm contant_tsc art arch_perfmon pebs bts rep_good nopl xtopology nonstop_tsc cpuid aperfmperf pni pclmulqdq dtes64 monitor ds_cpl vmx smx est tm2 ssse3 sdbg fma cx16 xtpr pdcm pcid se4_1 sse4_2 x2apic movbe popcnt tsc_deadline_timer aes xsave avx f16c rdrand lahf_lm abm 3dnowprefetch cpuid_fault epb invpcid_single pti ssbd ibrs ibpb stibp tpr_shadow vnmi fexpriority ept vpid ept_ad fsgsbase tsc_adjust bmi1 avx2 smep bmi2 erms invpcid mpx rdseed adx smap clflushopt intel_pt xsaveopt xsavec xgetbv1 xsaves dtherm ida arat pln pts hp hwp_notify hwp_act_window hwp_epp md_clear flush_l1d arch_capabilities",
//           "vmx flags\t: vnmi preemption_timer invvpid ept_x_only ept_ad ept_1gb flexpriority tsc_offset vtpr mtf vapic ept vpid unrestricted_guest ple shadow_vmcs pml ept_mod_based_exec",
//           "bugs\t\t: cpu_meltdown spectre_v1 spectre_v2 spec_store_bypass l1tf mds swapgs taa itlb_multihit srbds mmio_stale_data retbleed gds",
//           "bogomips\t: 6599.98",
//           "clflush size\t: 64",
//           "cache_alignment\t: 64",
//           "address sizes\t: 39 bits physical, 48 bits virtual",
//           "power management:",
//           "",
//           "processor\t: 11",
//           "vendor_id\t: GenuineIntel",
//           "cpu family\t: 6",
//           "model\t\t: 158",
//           "model name\t: Intel(R) Xeon(R) E-2136 CPU @ 3.30GHz",
//           "stepping\t: 10",
//           "microcode\t: 0xf8",
//           "cpu MHz\t\t: 3300.000",
//           "cache size\t: 12288 KB",
//           "physical id\t: 0",
//           "siblings\t: 12",
//           "core id\t\t: 5",
//           "cpu cores\t: 6",
//           "apicid\t\t: 11",
//           "initial apicid\t: 11",
//           "fpu\t\t: yes",
//           "fpu_exception\t: yes",
//           "cpuid level\t: 22",
//           "wp\t\t: yes",
//           "flags\t\t: fpu vme de pse tsc msr pae mce cx8 apic sep mtrr pge mca cmov pat pse36 clflush dts acpi mmx fxsr sse sse2 ss ht tm pbe syscall nx pdpe1gb rdtscp lm contant_tsc art arch_perfmon pebs bts rep_good nopl xtopology nonstop_tsc cpuid aperfmperf pni pclmulqdq dtes64 monitor ds_cpl vmx smx est tm2 ssse3 sdbg fma cx16 xtpr pdcm pcid se4_1 sse4_2 x2apic movbe popcnt tsc_deadline_timer aes xsave avx f16c rdrand lahf_lm abm 3dnowprefetch cpuid_fault epb invpcid_single pti ssbd ibrs ibpb stibp tpr_shadow vnmi fexpriority ept vpid ept_ad fsgsbase tsc_adjust bmi1 avx2 smep bmi2 erms invpcid mpx rdseed adx smap clflushopt intel_pt xsaveopt xsavec xgetbv1 xsaves dtherm ida arat pln pts hp hwp_notify hwp_act_window hwp_epp md_clear flush_l1d arch_capabilities",
//           "vmx flags\t: vnmi preemption_timer invvpid ept_x_only ept_ad ept_1gb flexpriority tsc_offset vtpr mtf vapic ept vpid unrestricted_guest ple shadow_vmcs pml ept_mod_based_exec",
//           "bugs\t\t: cpu_meltdown spectre_v1 spectre_v2 spec_store_bypass l1tf mds swapgs taa itlb_multihit srbds mmio_stale_data retbleed gds",
//           "bogomips\t: 6599.98",
//           "clflush size\t: 64",
//           "cache_alignment\t: 64",
//           "address sizes\t: 39 bits physical, 48 bits virtual",
//           "power management:"];
//         myType = "Server";
//         myGroups = ["servers", "test"];
//         myEpoch = (Number(Number(currentEpoch)).toFixed(3));
//         myIcon = "pi pi-server";
//         myLastUpdate = "2024-10-10:21:50:22";
//         myUptime = (Number(Number("3279890.20")/3600)).toFixed(3);
        
//         myServer = this.setTestServer(myCPU, myEpoch, myGroups, myhostname, myIcon, myLastUpdate, myStatus, myType, myUptime);
        
//         // console.log("--------- myServer 6 ---------");
//         // console.log(myServer6);
        
//         postsArray.push(myServer);

//         this.hosts.push(myhostname);
        
//         myhostname = "creede02";
//         myCPU = [
//           "processor\t: 0",
//           "vendor_id\t: GenuineIntel",
//           "cpu family\t: 6",
//           "model\t\t: 158",
//           "model name\t: Intel(R) Xeon(R) E-2136 CPU @ 3.30GHz",
//           "stepping\t: 10",
//           "microcode\t: 0xf8",
//           "cpu MHz\t\t: 4295.378",
//           "cache size\t: 12288 KB",
//           "physical id\t: 0",
//           "siblings\t: 12",
//           "core id\t\t: 0",
//           "cpu cores\t: 6",
//           "apicid\t\t: 0",
//           "initial apicid\t: 0",
//           "fpu\t\t: yes",
//           "fpu_exception\t: yes",
//           "cpuid level\t: 22",
//           "wp\t\t: yes",
//           "flags\t\t: fpu vme de pse tsc msr pae mce cx8 apic sep mtrr pge mca cmov pat pse36 clflush dts acpi mmx fxsr sse sse2 ss ht tm pbe syscall nx pdpe1gb rdtscp lm contant_tsc art arch_perfmon pebs bts rep_good nopl xtopology nonstop_tsc cpuid aperfmperf pni pclmulqdq dtes64 monitor ds_cpl vmx smx est tm2 ssse3 sdbg fma cx16 xtpr pdcm pcid se4_1 sse4_2 x2apic movbe popcnt tsc_deadline_timer aes xsave avx f16c rdrand lahf_lm abm 3dnowprefetch cpuid_fault epb invpcid_single pti ssbd ibrs ibpb stibp tpr_shadow vnmi fexpriority ept vpid ept_ad fsgsbase tsc_adjust bmi1 avx2 smep bmi2 erms invpcid mpx rdseed adx smap clflushopt intel_pt xsaveopt xsavec xgetbv1 xsaves dtherm ida arat pln pts hp hwp_notify hwp_act_window hwp_epp md_clear flush_l1d arch_capabilities",
//           "vmx flags\t: vnmi preemption_timer invvpid ept_x_only ept_ad ept_1gb flexpriority tsc_offset vtpr mtf vapic ept vpid unrestricted_guest ple shadow_vmcs pml ept_mod_based_exec",
//           "bugs\t\t: cpu_meltdown spectre_v1 spectre_v2 spec_store_bypass l1tf mds swapgs taa itlb_multihit srbds mmio_stale_data retbleed gds",
//           "bogomips\t: 6599.98",
//           "clflush size\t: 64",
//           "cache_alignment\t: 64",
//           "address sizes\t: 39 bits physical, 48 bits virtual",
//           "power management:",
//           "",
//           "processor\t: 1",
//           "vendor_id\t: GenuineIntel",
//           "cpu family\t: 6",
//           "model\t\t: 158",
//           "model name\t: Intel(R) Xeon(R) E-2136 CPU @ 3.30GHz",
//           "stepping\t: 10",
//           "microcode\t: 0xf8",
//           "cpu MHz\t\t: 3300.000",
//           "cache size\t: 12288 KB",
//           "physical id\t: 0",
//           "siblings\t: 12",
//           "core id\t\t: 1",
//           "cpu cores\t: 6",
//           "apicid\t\t: 2",
//           "initial apicid\t: 2",
//           "fpu\t\t: yes",
//           "fpu_exception\t: yes",
//           "cpuid level\t: 22",
//           "wp\t\t: yes",
//           "flags\t\t: fpu vme de pse tsc msr pae mce cx8 apic sep mtrr pge mca cmov pat pse36 clflush dts acpi mmx fxsr sse sse2 ss ht tm pbe syscall nx pdpe1gb rdtscp lm contant_tsc art arch_perfmon pebs bts rep_good nopl xtopology nonstop_tsc cpuid aperfmperf pni pclmulqdq dtes64 monitor ds_cpl vmx smx est tm2 ssse3 sdbg fma cx16 xtpr pdcm pcid se4_1 sse4_2 x2apic movbe popcnt tsc_deadline_timer aes xsave avx f16c rdrand lahf_lm abm 3dnowprefetch cpuid_fault epb invpcid_single pti ssbd ibrs ibpb stibp tpr_shadow vnmi fexpriority ept vpid ept_ad fsgsbase tsc_adjust bmi1 avx2 smep bmi2 erms invpcid mpx rdseed adx smap clflushopt intel_pt xsaveopt xsavec xgetbv1 xsaves dtherm ida arat pln pts hp hwp_notify hwp_act_window hwp_epp md_clear flush_l1d arch_capabilities",
//           "vmx flags\t: vnmi preemption_timer invvpid ept_x_only ept_ad ept_1gb flexpriority tsc_offset vtpr mtf vapic ept vpid unrestricted_guest ple shadow_vmcs pml ept_mod_based_exec",
//           "bugs\t\t: cpu_meltdown spectre_v1 spectre_v2 spec_store_bypass l1tf mds swapgs taa itlb_multihit srbds mmio_stale_data retbleed gds",
//           "bogomips\t: 6599.98",
//           "clflush size\t: 64",
//           "cache_alignment\t: 64",
//           "address sizes\t: 39 bits physical, 48 bits virtual",
//           "power management:",
//           "",
//           "processor\t: 2",
//           "vendor_id\t: GenuineIntel",
//           "cpu family\t: 6",
//           "model\t\t: 158",
//           "model name\t: Intel(R) Xeon(R) E-2136 CPU @ 3.30GHz",
//           "stepping\t: 10",
//           "microcode\t: 0xf8",
//           "cpu MHz\t\t: 3300.000",
//           "cache size\t: 12288 KB",
//           "physical id\t: 0",
//           "siblings\t: 12",
//           "core id\t\t: 2",
//           "cpu cores\t: 6",
//           "apicid\t\t: 4",
//           "initial apicid\t: 4",
//           "fpu\t\t: yes",
//           "fpu_exception\t: yes",
//           "cpuid level\t: 22",
//           "wp\t\t: yes",
//           "flags\t\t: fpu vme de pse tsc msr pae mce cx8 apic sep mtrr pge mca cmov pat pse36 clflush dts acpi mmx fxsr sse sse2 ss ht tm pbe syscall nx pdpe1gb rdtscp lm contant_tsc art arch_perfmon pebs bts rep_good nopl xtopology nonstop_tsc cpuid aperfmperf pni pclmulqdq dtes64 monitor ds_cpl vmx smx est tm2 ssse3 sdbg fma cx16 xtpr pdcm pcid se4_1 sse4_2 x2apic movbe popcnt tsc_deadline_timer aes xsave avx f16c rdrand lahf_lm abm 3dnowprefetch cpuid_fault epb invpcid_single pti ssbd ibrs ibpb stibp tpr_shadow vnmi fexpriority ept vpid ept_ad fsgsbase tsc_adjust bmi1 avx2 smep bmi2 erms invpcid mpx rdseed adx smap clflushopt intel_pt xsaveopt xsavec xgetbv1 xsaves dtherm ida arat pln pts hp hwp_notify hwp_act_window hwp_epp md_clear flush_l1d arch_capabilities",
//           "vmx flags\t: vnmi preemption_timer invvpid ept_x_only ept_ad ept_1gb flexpriority tsc_offset vtpr mtf vapic ept vpid unrestricted_guest ple shadow_vmcs pml ept_mod_based_exec",
//           "bugs\t\t: cpu_meltdown spectre_v1 spectre_v2 spec_store_bypass l1tf mds swapgs taa itlb_multihit srbds mmio_stale_data retbleed gds",
//           "bogomips\t: 6599.98",
//           "clflush size\t: 64",
//           "cache_alignment\t: 64",
//           "address sizes\t: 39 bits physical, 48 bits virtual",
//           "power management:",
//           "",
//           "processor\t: 3",
//           "vendor_id\t: GenuineIntel",
//           "cpu family\t: 6",
//           "model\t\t: 158",
//           "model name\t: Intel(R) Xeon(R) E-2136 CPU @ 3.30GHz",
//           "stepping\t: 10",
//           "microcode\t: 0xf8",
//           "cpu MHz\t\t: 3300.000",
//           "cache size\t: 12288 KB",
//           "physical id\t: 0",
//           "siblings\t: 12",
//           "core id\t\t: 3",
//           "cpu cores\t: 6",
//           "apicid\t\t: 6",
//           "initial apicid\t: 6",
//           "fpu\t\t: yes",
//           "fpu_exception\t: yes",
//           "cpuid level\t: 22",
//           "wp\t\t: yes",
//           "flags\t\t: fpu vme de pse tsc msr pae mce cx8 apic sep mtrr pge mca cmov pat pse36 clflush dts acpi mmx fxsr sse sse2 ss ht tm pbe syscall nx pdpe1gb rdtscp lm contant_tsc art arch_perfmon pebs bts rep_good nopl xtopology nonstop_tsc cpuid aperfmperf pni pclmulqdq dtes64 monitor ds_cpl vmx smx est tm2 ssse3 sdbg fma cx16 xtpr pdcm pcid se4_1 sse4_2 x2apic movbe popcnt tsc_deadline_timer aes xsave avx f16c rdrand lahf_lm abm 3dnowprefetch cpuid_fault epb invpcid_single pti ssbd ibrs ibpb stibp tpr_shadow vnmi fexpriority ept vpid ept_ad fsgsbase tsc_adjust bmi1 avx2 smep bmi2 erms invpcid mpx rdseed adx smap clflushopt intel_pt xsaveopt xsavec xgetbv1 xsaves dtherm ida arat pln pts hp hwp_notify hwp_act_window hwp_epp md_clear flush_l1d arch_capabilities",
//           "vmx flags\t: vnmi preemption_timer invvpid ept_x_only ept_ad ept_1gb flexpriority tsc_offset vtpr mtf vapic ept vpid unrestricted_guest ple shadow_vmcs pml ept_mod_based_exec",
//           "bugs\t\t: cpu_meltdown spectre_v1 spectre_v2 spec_store_bypass l1tf mds swapgs taa itlb_multihit srbds mmio_stale_data retbleed gds",
//           "bogomips\t: 6599.98",
//           "clflush size\t: 64",
//           "cache_alignment\t: 64",
//           "address sizes\t: 39 bits physical, 48 bits virtual",
//           "power management:",
//           "",
//           "processor\t: 4",
//           "vendor_id\t: GenuineIntel",
//           "cpu family\t: 6",
//           "model\t\t: 158",
//           "model name\t: Intel(R) Xeon(R) E-2136 CPU @ 3.30GHz",
//           "stepping\t: 10",
//           "microcode\t: 0xf8",
//           "cpu MHz\t\t: 3300.000",
//           "cache size\t: 12288 KB",
//           "physical id\t: 0",
//           "siblings\t: 12",
//           "core id\t\t: 4",
//           "cpu cores\t: 6",
//           "apicid\t\t: 8",
//           "initial apicid\t: 8",
//           "fpu\t\t: yes",
//           "fpu_exception\t: yes",
//           "cpuid level\t: 22",
//           "wp\t\t: yes",
//           "flags\t\t: fpu vme de pse tsc msr pae mce cx8 apic sep mtrr pge mca cmov pat pse36 clflush dts acpi mmx fxsr sse sse2 ss ht tm pbe syscall nx pdpe1gb rdtscp lm contant_tsc art arch_perfmon pebs bts rep_good nopl xtopology nonstop_tsc cpuid aperfmperf pni pclmulqdq dtes64 monitor ds_cpl vmx smx est tm2 ssse3 sdbg fma cx16 xtpr pdcm pcid se4_1 sse4_2 x2apic movbe popcnt tsc_deadline_timer aes xsave avx f16c rdrand lahf_lm abm 3dnowprefetch cpuid_fault epb invpcid_single pti ssbd ibrs ibpb stibp tpr_shadow vnmi fexpriority ept vpid ept_ad fsgsbase tsc_adjust bmi1 avx2 smep bmi2 erms invpcid mpx rdseed adx smap clflushopt intel_pt xsaveopt xsavec xgetbv1 xsaves dtherm ida arat pln pts hp hwp_notify hwp_act_window hwp_epp md_clear flush_l1d arch_capabilities",
//           "vmx flags\t: vnmi preemption_timer invvpid ept_x_only ept_ad ept_1gb flexpriority tsc_offset vtpr mtf vapic ept vpid unrestricted_guest ple shadow_vmcs pml ept_mod_based_exec",
//           "bugs\t\t: cpu_meltdown spectre_v1 spectre_v2 spec_store_bypass l1tf mds swapgs taa itlb_multihit srbds mmio_stale_data retbleed gds",
//           "bogomips\t: 6599.98",
//           "clflush size\t: 64",
//           "cache_alignment\t: 64",
//           "address sizes\t: 39 bits physical, 48 bits virtual",
//           "power management:",
//           "",
//           "processor\t: 5",
//           "vendor_id\t: GenuineIntel",
//           "cpu family\t: 6",
//           "model\t\t: 158",
//           "model name\t: Intel(R) Xeon(R) E-2136 CPU @ 3.30GHz",
//           "stepping\t: 10",
//           "microcode\t: 0xf8",
//           "cpu MHz\t\t: 3300.000",
//           "cache size\t: 12288 KB",
//           "physical id\t: 0",
//           "siblings\t: 12",
//           "core id\t\t: 5",
//           "cpu cores\t: 6",
//           "apicid\t\t: 10",
//           "initial apicid\t: 10",
//           "fpu\t\t: yes",
//           "fpu_exception\t: yes",
//           "cpuid level\t: 22",
//           "wp\t\t: yes",
//           "flags\t\t: fpu vme de pse tsc msr pae mce cx8 apic sep mtrr pge mca cmov pat pse36 clflush dts acpi mmx fxsr sse sse2 ss ht tm pbe syscall nx pdpe1gb rdtscp lm contant_tsc art arch_perfmon pebs bts rep_good nopl xtopology nonstop_tsc cpuid aperfmperf pni pclmulqdq dtes64 monitor ds_cpl vmx smx est tm2 ssse3 sdbg fma cx16 xtpr pdcm pcid se4_1 sse4_2 x2apic movbe popcnt tsc_deadline_timer aes xsave avx f16c rdrand lahf_lm abm 3dnowprefetch cpuid_fault epb invpcid_single pti ssbd ibrs ibpb stibp tpr_shadow vnmi fexpriority ept vpid ept_ad fsgsbase tsc_adjust bmi1 avx2 smep bmi2 erms invpcid mpx rdseed adx smap clflushopt intel_pt xsaveopt xsavec xgetbv1 xsaves dtherm ida arat pln pts hp hwp_notify hwp_act_window hwp_epp md_clear flush_l1d arch_capabilities",
//           "vmx flags\t: vnmi preemption_timer invvpid ept_x_only ept_ad ept_1gb flexpriority tsc_offset vtpr mtf vapic ept vpid unrestricted_guest ple shadow_vmcs pml ept_mod_based_exec",
//           "bugs\t\t: cpu_meltdown spectre_v1 spectre_v2 spec_store_bypass l1tf mds swapgs taa itlb_multihit srbds mmio_stale_data retbleed gds",
//           "bogomips\t: 6599.98",
//           "clflush size\t: 64",
//           "cache_alignment\t: 64",
//           "address sizes\t: 39 bits physical, 48 bits virtual",
//           "power management:",
//           "",
//           "processor\t: 6",
//           "vendor_id\t: GenuineIntel",
//           "cpu family\t: 6",
//           "model\t\t: 158",
//           "model name\t: Intel(R) Xeon(R) E-2136 CPU @ 3.30GHz",
//           "stepping\t: 10",
//           "microcode\t: 0xf8",
//           "cpu MHz\t\t: 3300.000",
//           "cache size\t: 12288 KB",
//           "physical id\t: 0",
//           "siblings\t: 12",
//           "core id\t\t: 0",
//           "cpu cores\t: 6",
//           "apicid\t\t: 1",
//           "initial apicid\t: 1",
//           "fpu\t\t: yes",
//           "fpu_exception\t: yes",
//           "cpuid level\t: 22",
//           "wp\t\t: yes",
//           "flags\t\t: fpu vme de pse tsc msr pae mce cx8 apic sep mtrr pge mca cmov pat pse36 clflush dts acpi mmx fxsr sse sse2 ss ht tm pbe syscall nx pdpe1gb rdtscp lm contant_tsc art arch_perfmon pebs bts rep_good nopl xtopology nonstop_tsc cpuid aperfmperf pni pclmulqdq dtes64 monitor ds_cpl vmx smx est tm2 ssse3 sdbg fma cx16 xtpr pdcm pcid se4_1 sse4_2 x2apic movbe popcnt tsc_deadline_timer aes xsave avx f16c rdrand lahf_lm abm 3dnowprefetch cpuid_fault epb invpcid_single pti ssbd ibrs ibpb stibp tpr_shadow vnmi fexpriority ept vpid ept_ad fsgsbase tsc_adjust bmi1 avx2 smep bmi2 erms invpcid mpx rdseed adx smap clflushopt intel_pt xsaveopt xsavec xgetbv1 xsaves dtherm ida arat pln pts hp hwp_notify hwp_act_window hwp_epp md_clear flush_l1d arch_capabilities",
//           "vmx flags\t: vnmi preemption_timer invvpid ept_x_only ept_ad ept_1gb flexpriority tsc_offset vtpr mtf vapic ept vpid unrestricted_guest ple shadow_vmcs pml ept_mod_based_exec",
//           "bugs\t\t: cpu_meltdown spectre_v1 spectre_v2 spec_store_bypass l1tf mds swapgs taa itlb_multihit srbds mmio_stale_data retbleed gds",
//           "bogomips\t: 6599.98",
//           "clflush size\t: 64",
//           "cache_alignment\t: 64",
//           "address sizes\t: 39 bits physical, 48 bits virtual",
//           "power management:",
//           "",
//           "processor\t: 7",
//           "vendor_id\t: GenuineIntel",
//           "cpu family\t: 6",
//           "model\t\t: 158",
//           "model name\t: Intel(R) Xeon(R) E-2136 CPU @ 3.30GHz",
//           "stepping\t: 10",
//           "microcode\t: 0xf8",
//           "cpu MHz\t\t: 3300.000",
//           "cache size\t: 12288 KB",
//           "physical id\t: 0",
//           "siblings\t: 12",
//           "core id\t\t: 1",
//           "cpu cores\t: 6",
//           "apicid\t\t: 3",
//           "initial apicid\t: 3",
//           "fpu\t\t: yes",
//           "fpu_exception\t: yes",
//           "cpuid level\t: 22",
//           "wp\t\t: yes",
//           "flags\t\t: fpu vme de pse tsc msr pae mce cx8 apic sep mtrr pge mca cmov pat pse36 clflush dts acpi mmx fxsr sse sse2 ss ht tm pbe syscall nx pdpe1gb rdtscp lm contant_tsc art arch_perfmon pebs bts rep_good nopl xtopology nonstop_tsc cpuid aperfmperf pni pclmulqdq dtes64 monitor ds_cpl vmx smx est tm2 ssse3 sdbg fma cx16 xtpr pdcm pcid se4_1 sse4_2 x2apic movbe popcnt tsc_deadline_timer aes xsave avx f16c rdrand lahf_lm abm 3dnowprefetch cpuid_fault epb invpcid_single pti ssbd ibrs ibpb stibp tpr_shadow vnmi fexpriority ept vpid ept_ad fsgsbase tsc_adjust bmi1 avx2 smep bmi2 erms invpcid mpx rdseed adx smap clflushopt intel_pt xsaveopt xsavec xgetbv1 xsaves dtherm ida arat pln pts hp hwp_notify hwp_act_window hwp_epp md_clear flush_l1d arch_capabilities",
//           "vmx flags\t: vnmi preemption_timer invvpid ept_x_only ept_ad ept_1gb flexpriority tsc_offset vtpr mtf vapic ept vpid unrestricted_guest ple shadow_vmcs pml ept_mod_based_exec",
//           "bugs\t\t: cpu_meltdown spectre_v1 spectre_v2 spec_store_bypass l1tf mds swapgs taa itlb_multihit srbds mmio_stale_data retbleed gds",
//           "bogomips\t: 6599.98",
//           "clflush size\t: 64",
//           "cache_alignment\t: 64",
//           "address sizes\t: 39 bits physical, 48 bits virtual",
//           "power management:",
//           "",
//           "processor\t: 8",
//           "vendor_id\t: GenuineIntel",
//           "cpu family\t: 6",
//           "model\t\t: 158",
//           "model name\t: Intel(R) Xeon(R) E-2136 CPU @ 3.30GHz",
//           "stepping\t: 10",
//           "microcode\t: 0xf8",
//           "cpu MHz\t\t: 3300.000",
//           "cache size\t: 12288 KB",
//           "physical id\t: 0",
//           "siblings\t: 12",
//           "core id\t\t: 2",
//           "cpu cores\t: 6",
//           "apicid\t\t: 5",
//           "initial apicid\t: 5",
//           "fpu\t\t: yes",
//           "fpu_exception\t: yes",
//           "cpuid level\t: 22",
//           "wp\t\t: yes",
//           "flags\t\t: fpu vme de pse tsc msr pae mce cx8 apic sep mtrr pge mca cmov pat pse36 clflush dts acpi mmx fxsr sse sse2 ss ht tm pbe syscall nx pdpe1gb rdtscp lm contant_tsc art arch_perfmon pebs bts rep_good nopl xtopology nonstop_tsc cpuid aperfmperf pni pclmulqdq dtes64 monitor ds_cpl vmx smx est tm2 ssse3 sdbg fma cx16 xtpr pdcm pcid se4_1 sse4_2 x2apic movbe popcnt tsc_deadline_timer aes xsave avx f16c rdrand lahf_lm abm 3dnowprefetch cpuid_fault epb invpcid_single pti ssbd ibrs ibpb stibp tpr_shadow vnmi fexpriority ept vpid ept_ad fsgsbase tsc_adjust bmi1 avx2 smep bmi2 erms invpcid mpx rdseed adx smap clflushopt intel_pt xsaveopt xsavec xgetbv1 xsaves dtherm ida arat pln pts hp hwp_notify hwp_act_window hwp_epp md_clear flush_l1d arch_capabilities",
//           "vmx flags\t: vnmi preemption_timer invvpid ept_x_only ept_ad ept_1gb flexpriority tsc_offset vtpr mtf vapic ept vpid unrestricted_guest ple shadow_vmcs pml ept_mod_based_exec",
//           "bugs\t\t: cpu_meltdown spectre_v1 spectre_v2 spec_store_bypass l1tf mds swapgs taa itlb_multihit srbds mmio_stale_data retbleed gds",
//           "bogomips\t: 6599.98",
//           "clflush size\t: 64",
//           "cache_alignment\t: 64",
//           "address sizes\t: 39 bits physical, 48 bits virtual",
//           "power management:",
//           "",
//           "processor\t: 9",
//           "vendor_id\t: GenuineIntel",
//           "cpu family\t: 6",
//           "model\t\t: 158",
//           "model name\t: Intel(R) Xeon(R) E-2136 CPU @ 3.30GHz",
//           "stepping\t: 10",
//           "microcode\t: 0xf8",
//           "cpu MHz\t\t: 3300.000",
//           "cache size\t: 12288 KB",
//           "physical id\t: 0",
//           "siblings\t: 12",
//           "core id\t\t: 3",
//           "cpu cores\t: 6",
//           "apicid\t\t: 7",
//           "initial apicid\t: 7",
//           "fpu\t\t: yes",
//           "fpu_exception\t: yes",
//           "cpuid level\t: 22",
//           "wp\t\t: yes",
//           "flags\t\t: fpu vme de pse tsc msr pae mce cx8 apic sep mtrr pge mca cmov pat pse36 clflush dts acpi mmx fxsr sse sse2 ss ht tm pbe syscall nx pdpe1gb rdtscp lm contant_tsc art arch_perfmon pebs bts rep_good nopl xtopology nonstop_tsc cpuid aperfmperf pni pclmulqdq dtes64 monitor ds_cpl vmx smx est tm2 ssse3 sdbg fma cx16 xtpr pdcm pcid se4_1 sse4_2 x2apic movbe popcnt tsc_deadline_timer aes xsave avx f16c rdrand lahf_lm abm 3dnowprefetch cpuid_fault epb invpcid_single pti ssbd ibrs ibpb stibp tpr_shadow vnmi fexpriority ept vpid ept_ad fsgsbase tsc_adjust bmi1 avx2 smep bmi2 erms invpcid mpx rdseed adx smap clflushopt intel_pt xsaveopt xsavec xgetbv1 xsaves dtherm ida arat pln pts hp hwp_notify hwp_act_window hwp_epp md_clear flush_l1d arch_capabilities",
//           "vmx flags\t: vnmi preemption_timer invvpid ept_x_only ept_ad ept_1gb flexpriority tsc_offset vtpr mtf vapic ept vpid unrestricted_guest ple shadow_vmcs pml ept_mod_based_exec",
//           "bugs\t\t: cpu_meltdown spectre_v1 spectre_v2 spec_store_bypass l1tf mds swapgs taa itlb_multihit srbds mmio_stale_data retbleed gds",
//           "bogomips\t: 6599.98",
//           "clflush size\t: 64",
//           "cache_alignment\t: 64",
//           "address sizes\t: 39 bits physical, 48 bits virtual",
//           "power management:",
//           "",
//           "processor\t: 10",
//           "vendor_id\t: GenuineIntel",
//           "cpu family\t: 6",
//           "model\t\t: 158",
//           "model name\t: Intel(R) Xeon(R) E-2136 CPU @ 3.30GHz",
//           "stepping\t: 10",
//           "microcode\t: 0xf8",
//           "cpu MHz\t\t: 1853.858",
//           "cache size\t: 12288 KB",
//           "physical id\t: 0",
//           "siblings\t: 12",
//           "core id\t\t: 4",
//           "cpu cores\t: 6",
//           "apicid\t\t: 9",
//           "initial apicid\t: 9",
//           "fpu\t\t: yes",
//           "fpu_exception\t: yes",
//           "cpuid level\t: 22",
//           "wp\t\t: yes",
//           "flags\t\t: fpu vme de pse tsc msr pae mce cx8 apic sep mtrr pge mca cmov pat pse36 clflush dts acpi mmx fxsr sse sse2 ss ht tm pbe syscall nx pdpe1gb rdtscp lm contant_tsc art arch_perfmon pebs bts rep_good nopl xtopology nonstop_tsc cpuid aperfmperf pni pclmulqdq dtes64 monitor ds_cpl vmx smx est tm2 ssse3 sdbg fma cx16 xtpr pdcm pcid se4_1 sse4_2 x2apic movbe popcnt tsc_deadline_timer aes xsave avx f16c rdrand lahf_lm abm 3dnowprefetch cpuid_fault epb invpcid_single pti ssbd ibrs ibpb stibp tpr_shadow vnmi fexpriority ept vpid ept_ad fsgsbase tsc_adjust bmi1 avx2 smep bmi2 erms invpcid mpx rdseed adx smap clflushopt intel_pt xsaveopt xsavec xgetbv1 xsaves dtherm ida arat pln pts hp hwp_notify hwp_act_window hwp_epp md_clear flush_l1d arch_capabilities",
//           "vmx flags\t: vnmi preemption_timer invvpid ept_x_only ept_ad ept_1gb flexpriority tsc_offset vtpr mtf vapic ept vpid unrestricted_guest ple shadow_vmcs pml ept_mod_based_exec",
//           "bugs\t\t: cpu_meltdown spectre_v1 spectre_v2 spec_store_bypass l1tf mds swapgs taa itlb_multihit srbds mmio_stale_data retbleed gds",
//           "bogomips\t: 6599.98",
//           "clflush size\t: 64",
//           "cache_alignment\t: 64",
//           "address sizes\t: 39 bits physical, 48 bits virtual",
//           "power management:",
//           "",
//           "processor\t: 11",
//           "vendor_id\t: GenuineIntel",
//           "cpu family\t: 6",
//           "model\t\t: 158",
//           "model name\t: Intel(R) Xeon(R) E-2136 CPU @ 3.30GHz",
//           "stepping\t: 10",
//           "microcode\t: 0xf8",
//           "cpu MHz\t\t: 3300.000",
//           "cache size\t: 12288 KB",
//           "physical id\t: 0",
//           "siblings\t: 12",
//           "core id\t\t: 5",
//           "cpu cores\t: 6",
//           "apicid\t\t: 11",
//           "initial apicid\t: 11",
//           "fpu\t\t: yes",
//           "fpu_exception\t: yes",
//           "cpuid level\t: 22",
//           "wp\t\t: yes",
//           "flags\t\t: fpu vme de pse tsc msr pae mce cx8 apic sep mtrr pge mca cmov pat pse36 clflush dts acpi mmx fxsr sse sse2 ss ht tm pbe syscall nx pdpe1gb rdtscp lm contant_tsc art arch_perfmon pebs bts rep_good nopl xtopology nonstop_tsc cpuid aperfmperf pni pclmulqdq dtes64 monitor ds_cpl vmx smx est tm2 ssse3 sdbg fma cx16 xtpr pdcm pcid se4_1 sse4_2 x2apic movbe popcnt tsc_deadline_timer aes xsave avx f16c rdrand lahf_lm abm 3dnowprefetch cpuid_fault epb invpcid_single pti ssbd ibrs ibpb stibp tpr_shadow vnmi fexpriority ept vpid ept_ad fsgsbase tsc_adjust bmi1 avx2 smep bmi2 erms invpcid mpx rdseed adx smap clflushopt intel_pt xsaveopt xsavec xgetbv1 xsaves dtherm ida arat pln pts hp hwp_notify hwp_act_window hwp_epp md_clear flush_l1d arch_capabilities",
//           "vmx flags\t: vnmi preemption_timer invvpid ept_x_only ept_ad ept_1gb flexpriority tsc_offset vtpr mtf vapic ept vpid unrestricted_guest ple shadow_vmcs pml ept_mod_based_exec",
//           "bugs\t\t: cpu_meltdown spectre_v1 spectre_v2 spec_store_bypass l1tf mds swapgs taa itlb_multihit srbds mmio_stale_data retbleed gds",
//           "bogomips\t: 6599.98",
//           "clflush size\t: 64",
//           "cache_alignment\t: 64",
//           "address sizes\t: 39 bits physical, 48 bits virtual",
//           "power management:"];
//         myType = "Server";
//         myGroups = ["servers"];
//         myEpoch = (Number(Number(currentEpoch)).toFixed(3));
//         myIcon = "pi pi-server";
//         myLastUpdate = "2024-10-10:21:50:22";
//         myUptime = (Number(Number("3279890.20")/3600)).toFixed(3);
        
//         myServer = this.setTestServer(myCPU, myEpoch, myGroups, myhostname, myIcon, myLastUpdate, myStatus, myType, myUptime);
        
//         // console.log("--------- myServer 7 ---------");
//         // console.log(myServer7);
        
//         postsArray.push(myServer);

//         this.hosts.push(myhostname);
        
//         myhostname = "creede03";
//         myCPU = [
//           "processor\t: 0",
//           "vendor_id\t: GenuineIntel",
//           "cpu family\t: 6",
//           "model\t\t: 158",
//           "model name\t: Intel(R) Xeon(R) E-2136 CPU @ 3.30GHz",
//           "stepping\t: 10",
//           "microcode\t: 0xf8",
//           "cpu MHz\t\t: 4295.378",
//           "cache size\t: 12288 KB",
//           "physical id\t: 0",
//           "siblings\t: 12",
//           "core id\t\t: 0",
//           "cpu cores\t: 6",
//           "apicid\t\t: 0",
//           "initial apicid\t: 0",
//           "fpu\t\t: yes",
//           "fpu_exception\t: yes",
//           "cpuid level\t: 22",
//           "wp\t\t: yes",
//           "flags\t\t: fpu vme de pse tsc msr pae mce cx8 apic sep mtrr pge mca cmov pat pse36 clflush dts acpi mmx fxsr sse sse2 ss ht tm pbe syscall nx pdpe1gb rdtscp lm contant_tsc art arch_perfmon pebs bts rep_good nopl xtopology nonstop_tsc cpuid aperfmperf pni pclmulqdq dtes64 monitor ds_cpl vmx smx est tm2 ssse3 sdbg fma cx16 xtpr pdcm pcid se4_1 sse4_2 x2apic movbe popcnt tsc_deadline_timer aes xsave avx f16c rdrand lahf_lm abm 3dnowprefetch cpuid_fault epb invpcid_single pti ssbd ibrs ibpb stibp tpr_shadow vnmi fexpriority ept vpid ept_ad fsgsbase tsc_adjust bmi1 avx2 smep bmi2 erms invpcid mpx rdseed adx smap clflushopt intel_pt xsaveopt xsavec xgetbv1 xsaves dtherm ida arat pln pts hp hwp_notify hwp_act_window hwp_epp md_clear flush_l1d arch_capabilities",
//           "vmx flags\t: vnmi preemption_timer invvpid ept_x_only ept_ad ept_1gb flexpriority tsc_offset vtpr mtf vapic ept vpid unrestricted_guest ple shadow_vmcs pml ept_mod_based_exec",
//           "bugs\t\t: cpu_meltdown spectre_v1 spectre_v2 spec_store_bypass l1tf mds swapgs taa itlb_multihit srbds mmio_stale_data retbleed gds",
//           "bogomips\t: 6599.98",
//           "clflush size\t: 64",
//           "cache_alignment\t: 64",
//           "address sizes\t: 39 bits physical, 48 bits virtual",
//           "power management:",
//           "",
//           "processor\t: 1",
//           "vendor_id\t: GenuineIntel",
//           "cpu family\t: 6",
//           "model\t\t: 158",
//           "model name\t: Intel(R) Xeon(R) E-2136 CPU @ 3.30GHz",
//           "stepping\t: 10",
//           "microcode\t: 0xf8",
//           "cpu MHz\t\t: 3300.000",
//           "cache size\t: 12288 KB",
//           "physical id\t: 0",
//           "siblings\t: 12",
//           "core id\t\t: 1",
//           "cpu cores\t: 6",
//           "apicid\t\t: 2",
//           "initial apicid\t: 2",
//           "fpu\t\t: yes",
//           "fpu_exception\t: yes",
//           "cpuid level\t: 22",
//           "wp\t\t: yes",
//           "flags\t\t: fpu vme de pse tsc msr pae mce cx8 apic sep mtrr pge mca cmov pat pse36 clflush dts acpi mmx fxsr sse sse2 ss ht tm pbe syscall nx pdpe1gb rdtscp lm contant_tsc art arch_perfmon pebs bts rep_good nopl xtopology nonstop_tsc cpuid aperfmperf pni pclmulqdq dtes64 monitor ds_cpl vmx smx est tm2 ssse3 sdbg fma cx16 xtpr pdcm pcid se4_1 sse4_2 x2apic movbe popcnt tsc_deadline_timer aes xsave avx f16c rdrand lahf_lm abm 3dnowprefetch cpuid_fault epb invpcid_single pti ssbd ibrs ibpb stibp tpr_shadow vnmi fexpriority ept vpid ept_ad fsgsbase tsc_adjust bmi1 avx2 smep bmi2 erms invpcid mpx rdseed adx smap clflushopt intel_pt xsaveopt xsavec xgetbv1 xsaves dtherm ida arat pln pts hp hwp_notify hwp_act_window hwp_epp md_clear flush_l1d arch_capabilities",
//           "vmx flags\t: vnmi preemption_timer invvpid ept_x_only ept_ad ept_1gb flexpriority tsc_offset vtpr mtf vapic ept vpid unrestricted_guest ple shadow_vmcs pml ept_mod_based_exec",
//           "bugs\t\t: cpu_meltdown spectre_v1 spectre_v2 spec_store_bypass l1tf mds swapgs taa itlb_multihit srbds mmio_stale_data retbleed gds",
//           "bogomips\t: 6599.98",
//           "clflush size\t: 64",
//           "cache_alignment\t: 64",
//           "address sizes\t: 39 bits physical, 48 bits virtual",
//           "power management:",
//           "",
//           "processor\t: 2",
//           "vendor_id\t: GenuineIntel",
//           "cpu family\t: 6",
//           "model\t\t: 158",
//           "model name\t: Intel(R) Xeon(R) E-2136 CPU @ 3.30GHz",
//           "stepping\t: 10",
//           "microcode\t: 0xf8",
//           "cpu MHz\t\t: 3300.000",
//           "cache size\t: 12288 KB",
//           "physical id\t: 0",
//           "siblings\t: 12",
//           "core id\t\t: 2",
//           "cpu cores\t: 6",
//           "apicid\t\t: 4",
//           "initial apicid\t: 4",
//           "fpu\t\t: yes",
//           "fpu_exception\t: yes",
//           "cpuid level\t: 22",
//           "wp\t\t: yes",
//           "flags\t\t: fpu vme de pse tsc msr pae mce cx8 apic sep mtrr pge mca cmov pat pse36 clflush dts acpi mmx fxsr sse sse2 ss ht tm pbe syscall nx pdpe1gb rdtscp lm contant_tsc art arch_perfmon pebs bts rep_good nopl xtopology nonstop_tsc cpuid aperfmperf pni pclmulqdq dtes64 monitor ds_cpl vmx smx est tm2 ssse3 sdbg fma cx16 xtpr pdcm pcid se4_1 sse4_2 x2apic movbe popcnt tsc_deadline_timer aes xsave avx f16c rdrand lahf_lm abm 3dnowprefetch cpuid_fault epb invpcid_single pti ssbd ibrs ibpb stibp tpr_shadow vnmi fexpriority ept vpid ept_ad fsgsbase tsc_adjust bmi1 avx2 smep bmi2 erms invpcid mpx rdseed adx smap clflushopt intel_pt xsaveopt xsavec xgetbv1 xsaves dtherm ida arat pln pts hp hwp_notify hwp_act_window hwp_epp md_clear flush_l1d arch_capabilities",
//           "vmx flags\t: vnmi preemption_timer invvpid ept_x_only ept_ad ept_1gb flexpriority tsc_offset vtpr mtf vapic ept vpid unrestricted_guest ple shadow_vmcs pml ept_mod_based_exec",
//           "bugs\t\t: cpu_meltdown spectre_v1 spectre_v2 spec_store_bypass l1tf mds swapgs taa itlb_multihit srbds mmio_stale_data retbleed gds",
//           "bogomips\t: 6599.98",
//           "clflush size\t: 64",
//           "cache_alignment\t: 64",
//           "address sizes\t: 39 bits physical, 48 bits virtual",
//           "power management:",
//           "",
//           "processor\t: 3",
//           "vendor_id\t: GenuineIntel",
//           "cpu family\t: 6",
//           "model\t\t: 158",
//           "model name\t: Intel(R) Xeon(R) E-2136 CPU @ 3.30GHz",
//           "stepping\t: 10",
//           "microcode\t: 0xf8",
//           "cpu MHz\t\t: 3300.000",
//           "cache size\t: 12288 KB",
//           "physical id\t: 0",
//           "siblings\t: 12",
//           "core id\t\t: 3",
//           "cpu cores\t: 6",
//           "apicid\t\t: 6",
//           "initial apicid\t: 6",
//           "fpu\t\t: yes",
//           "fpu_exception\t: yes",
//           "cpuid level\t: 22",
//           "wp\t\t: yes",
//           "flags\t\t: fpu vme de pse tsc msr pae mce cx8 apic sep mtrr pge mca cmov pat pse36 clflush dts acpi mmx fxsr sse sse2 ss ht tm pbe syscall nx pdpe1gb rdtscp lm contant_tsc art arch_perfmon pebs bts rep_good nopl xtopology nonstop_tsc cpuid aperfmperf pni pclmulqdq dtes64 monitor ds_cpl vmx smx est tm2 ssse3 sdbg fma cx16 xtpr pdcm pcid se4_1 sse4_2 x2apic movbe popcnt tsc_deadline_timer aes xsave avx f16c rdrand lahf_lm abm 3dnowprefetch cpuid_fault epb invpcid_single pti ssbd ibrs ibpb stibp tpr_shadow vnmi fexpriority ept vpid ept_ad fsgsbase tsc_adjust bmi1 avx2 smep bmi2 erms invpcid mpx rdseed adx smap clflushopt intel_pt xsaveopt xsavec xgetbv1 xsaves dtherm ida arat pln pts hp hwp_notify hwp_act_window hwp_epp md_clear flush_l1d arch_capabilities",
//           "vmx flags\t: vnmi preemption_timer invvpid ept_x_only ept_ad ept_1gb flexpriority tsc_offset vtpr mtf vapic ept vpid unrestricted_guest ple shadow_vmcs pml ept_mod_based_exec",
//           "bugs\t\t: cpu_meltdown spectre_v1 spectre_v2 spec_store_bypass l1tf mds swapgs taa itlb_multihit srbds mmio_stale_data retbleed gds",
//           "bogomips\t: 6599.98",
//           "clflush size\t: 64",
//           "cache_alignment\t: 64",
//           "address sizes\t: 39 bits physical, 48 bits virtual",
//           "power management:",
//           "",
//           "processor\t: 4",
//           "vendor_id\t: GenuineIntel",
//           "cpu family\t: 6",
//           "model\t\t: 158",
//           "model name\t: Intel(R) Xeon(R) E-2136 CPU @ 3.30GHz",
//           "stepping\t: 10",
//           "microcode\t: 0xf8",
//           "cpu MHz\t\t: 3300.000",
//           "cache size\t: 12288 KB",
//           "physical id\t: 0",
//           "siblings\t: 12",
//           "core id\t\t: 4",
//           "cpu cores\t: 6",
//           "apicid\t\t: 8",
//           "initial apicid\t: 8",
//           "fpu\t\t: yes",
//           "fpu_exception\t: yes",
//           "cpuid level\t: 22",
//           "wp\t\t: yes",
//           "flags\t\t: fpu vme de pse tsc msr pae mce cx8 apic sep mtrr pge mca cmov pat pse36 clflush dts acpi mmx fxsr sse sse2 ss ht tm pbe syscall nx pdpe1gb rdtscp lm contant_tsc art arch_perfmon pebs bts rep_good nopl xtopology nonstop_tsc cpuid aperfmperf pni pclmulqdq dtes64 monitor ds_cpl vmx smx est tm2 ssse3 sdbg fma cx16 xtpr pdcm pcid se4_1 sse4_2 x2apic movbe popcnt tsc_deadline_timer aes xsave avx f16c rdrand lahf_lm abm 3dnowprefetch cpuid_fault epb invpcid_single pti ssbd ibrs ibpb stibp tpr_shadow vnmi fexpriority ept vpid ept_ad fsgsbase tsc_adjust bmi1 avx2 smep bmi2 erms invpcid mpx rdseed adx smap clflushopt intel_pt xsaveopt xsavec xgetbv1 xsaves dtherm ida arat pln pts hp hwp_notify hwp_act_window hwp_epp md_clear flush_l1d arch_capabilities",
//           "vmx flags\t: vnmi preemption_timer invvpid ept_x_only ept_ad ept_1gb flexpriority tsc_offset vtpr mtf vapic ept vpid unrestricted_guest ple shadow_vmcs pml ept_mod_based_exec",
//           "bugs\t\t: cpu_meltdown spectre_v1 spectre_v2 spec_store_bypass l1tf mds swapgs taa itlb_multihit srbds mmio_stale_data retbleed gds",
//           "bogomips\t: 6599.98",
//           "clflush size\t: 64",
//           "cache_alignment\t: 64",
//           "address sizes\t: 39 bits physical, 48 bits virtual",
//           "power management:",
//           "",
//           "processor\t: 5",
//           "vendor_id\t: GenuineIntel",
//           "cpu family\t: 6",
//           "model\t\t: 158",
//           "model name\t: Intel(R) Xeon(R) E-2136 CPU @ 3.30GHz",
//           "stepping\t: 10",
//           "microcode\t: 0xf8",
//           "cpu MHz\t\t: 3300.000",
//           "cache size\t: 12288 KB",
//           "physical id\t: 0",
//           "siblings\t: 12",
//           "core id\t\t: 5",
//           "cpu cores\t: 6",
//           "apicid\t\t: 10",
//           "initial apicid\t: 10",
//           "fpu\t\t: yes",
//           "fpu_exception\t: yes",
//           "cpuid level\t: 22",
//           "wp\t\t: yes",
//           "flags\t\t: fpu vme de pse tsc msr pae mce cx8 apic sep mtrr pge mca cmov pat pse36 clflush dts acpi mmx fxsr sse sse2 ss ht tm pbe syscall nx pdpe1gb rdtscp lm contant_tsc art arch_perfmon pebs bts rep_good nopl xtopology nonstop_tsc cpuid aperfmperf pni pclmulqdq dtes64 monitor ds_cpl vmx smx est tm2 ssse3 sdbg fma cx16 xtpr pdcm pcid se4_1 sse4_2 x2apic movbe popcnt tsc_deadline_timer aes xsave avx f16c rdrand lahf_lm abm 3dnowprefetch cpuid_fault epb invpcid_single pti ssbd ibrs ibpb stibp tpr_shadow vnmi fexpriority ept vpid ept_ad fsgsbase tsc_adjust bmi1 avx2 smep bmi2 erms invpcid mpx rdseed adx smap clflushopt intel_pt xsaveopt xsavec xgetbv1 xsaves dtherm ida arat pln pts hp hwp_notify hwp_act_window hwp_epp md_clear flush_l1d arch_capabilities",
//           "vmx flags\t: vnmi preemption_timer invvpid ept_x_only ept_ad ept_1gb flexpriority tsc_offset vtpr mtf vapic ept vpid unrestricted_guest ple shadow_vmcs pml ept_mod_based_exec",
//           "bugs\t\t: cpu_meltdown spectre_v1 spectre_v2 spec_store_bypass l1tf mds swapgs taa itlb_multihit srbds mmio_stale_data retbleed gds",
//           "bogomips\t: 6599.98",
//           "clflush size\t: 64",
//           "cache_alignment\t: 64",
//           "address sizes\t: 39 bits physical, 48 bits virtual",
//           "power management:",
//           "",
//           "processor\t: 6",
//           "vendor_id\t: GenuineIntel",
//           "cpu family\t: 6",
//           "model\t\t: 158",
//           "model name\t: Intel(R) Xeon(R) E-2136 CPU @ 3.30GHz",
//           "stepping\t: 10",
//           "microcode\t: 0xf8",
//           "cpu MHz\t\t: 3300.000",
//           "cache size\t: 12288 KB",
//           "physical id\t: 0",
//           "siblings\t: 12",
//           "core id\t\t: 0",
//           "cpu cores\t: 6",
//           "apicid\t\t: 1",
//           "initial apicid\t: 1",
//           "fpu\t\t: yes",
//           "fpu_exception\t: yes",
//           "cpuid level\t: 22",
//           "wp\t\t: yes",
//           "flags\t\t: fpu vme de pse tsc msr pae mce cx8 apic sep mtrr pge mca cmov pat pse36 clflush dts acpi mmx fxsr sse sse2 ss ht tm pbe syscall nx pdpe1gb rdtscp lm contant_tsc art arch_perfmon pebs bts rep_good nopl xtopology nonstop_tsc cpuid aperfmperf pni pclmulqdq dtes64 monitor ds_cpl vmx smx est tm2 ssse3 sdbg fma cx16 xtpr pdcm pcid se4_1 sse4_2 x2apic movbe popcnt tsc_deadline_timer aes xsave avx f16c rdrand lahf_lm abm 3dnowprefetch cpuid_fault epb invpcid_single pti ssbd ibrs ibpb stibp tpr_shadow vnmi fexpriority ept vpid ept_ad fsgsbase tsc_adjust bmi1 avx2 smep bmi2 erms invpcid mpx rdseed adx smap clflushopt intel_pt xsaveopt xsavec xgetbv1 xsaves dtherm ida arat pln pts hp hwp_notify hwp_act_window hwp_epp md_clear flush_l1d arch_capabilities",
//           "vmx flags\t: vnmi preemption_timer invvpid ept_x_only ept_ad ept_1gb flexpriority tsc_offset vtpr mtf vapic ept vpid unrestricted_guest ple shadow_vmcs pml ept_mod_based_exec",
//           "bugs\t\t: cpu_meltdown spectre_v1 spectre_v2 spec_store_bypass l1tf mds swapgs taa itlb_multihit srbds mmio_stale_data retbleed gds",
//           "bogomips\t: 6599.98",
//           "clflush size\t: 64",
//           "cache_alignment\t: 64",
//           "address sizes\t: 39 bits physical, 48 bits virtual",
//           "power management:",
//           "",
//           "processor\t: 7",
//           "vendor_id\t: GenuineIntel",
//           "cpu family\t: 6",
//           "model\t\t: 158",
//           "model name\t: Intel(R) Xeon(R) E-2136 CPU @ 3.30GHz",
//           "stepping\t: 10",
//           "microcode\t: 0xf8",
//           "cpu MHz\t\t: 3300.000",
//           "cache size\t: 12288 KB",
//           "physical id\t: 0",
//           "siblings\t: 12",
//           "core id\t\t: 1",
//           "cpu cores\t: 6",
//           "apicid\t\t: 3",
//           "initial apicid\t: 3",
//           "fpu\t\t: yes",
//           "fpu_exception\t: yes",
//           "cpuid level\t: 22",
//           "wp\t\t: yes",
//           "flags\t\t: fpu vme de pse tsc msr pae mce cx8 apic sep mtrr pge mca cmov pat pse36 clflush dts acpi mmx fxsr sse sse2 ss ht tm pbe syscall nx pdpe1gb rdtscp lm contant_tsc art arch_perfmon pebs bts rep_good nopl xtopology nonstop_tsc cpuid aperfmperf pni pclmulqdq dtes64 monitor ds_cpl vmx smx est tm2 ssse3 sdbg fma cx16 xtpr pdcm pcid se4_1 sse4_2 x2apic movbe popcnt tsc_deadline_timer aes xsave avx f16c rdrand lahf_lm abm 3dnowprefetch cpuid_fault epb invpcid_single pti ssbd ibrs ibpb stibp tpr_shadow vnmi fexpriority ept vpid ept_ad fsgsbase tsc_adjust bmi1 avx2 smep bmi2 erms invpcid mpx rdseed adx smap clflushopt intel_pt xsaveopt xsavec xgetbv1 xsaves dtherm ida arat pln pts hp hwp_notify hwp_act_window hwp_epp md_clear flush_l1d arch_capabilities",
//           "vmx flags\t: vnmi preemption_timer invvpid ept_x_only ept_ad ept_1gb flexpriority tsc_offset vtpr mtf vapic ept vpid unrestricted_guest ple shadow_vmcs pml ept_mod_based_exec",
//           "bugs\t\t: cpu_meltdown spectre_v1 spectre_v2 spec_store_bypass l1tf mds swapgs taa itlb_multihit srbds mmio_stale_data retbleed gds",
//           "bogomips\t: 6599.98",
//           "clflush size\t: 64",
//           "cache_alignment\t: 64",
//           "address sizes\t: 39 bits physical, 48 bits virtual",
//           "power management:",
//           "",
//           "processor\t: 8",
//           "vendor_id\t: GenuineIntel",
//           "cpu family\t: 6",
//           "model\t\t: 158",
//           "model name\t: Intel(R) Xeon(R) E-2136 CPU @ 3.30GHz",
//           "stepping\t: 10",
//           "microcode\t: 0xf8",
//           "cpu MHz\t\t: 3300.000",
//           "cache size\t: 12288 KB",
//           "physical id\t: 0",
//           "siblings\t: 12",
//           "core id\t\t: 2",
//           "cpu cores\t: 6",
//           "apicid\t\t: 5",
//           "initial apicid\t: 5",
//           "fpu\t\t: yes",
//           "fpu_exception\t: yes",
//           "cpuid level\t: 22",
//           "wp\t\t: yes",
//           "flags\t\t: fpu vme de pse tsc msr pae mce cx8 apic sep mtrr pge mca cmov pat pse36 clflush dts acpi mmx fxsr sse sse2 ss ht tm pbe syscall nx pdpe1gb rdtscp lm contant_tsc art arch_perfmon pebs bts rep_good nopl xtopology nonstop_tsc cpuid aperfmperf pni pclmulqdq dtes64 monitor ds_cpl vmx smx est tm2 ssse3 sdbg fma cx16 xtpr pdcm pcid se4_1 sse4_2 x2apic movbe popcnt tsc_deadline_timer aes xsave avx f16c rdrand lahf_lm abm 3dnowprefetch cpuid_fault epb invpcid_single pti ssbd ibrs ibpb stibp tpr_shadow vnmi fexpriority ept vpid ept_ad fsgsbase tsc_adjust bmi1 avx2 smep bmi2 erms invpcid mpx rdseed adx smap clflushopt intel_pt xsaveopt xsavec xgetbv1 xsaves dtherm ida arat pln pts hp hwp_notify hwp_act_window hwp_epp md_clear flush_l1d arch_capabilities",
//           "vmx flags\t: vnmi preemption_timer invvpid ept_x_only ept_ad ept_1gb flexpriority tsc_offset vtpr mtf vapic ept vpid unrestricted_guest ple shadow_vmcs pml ept_mod_based_exec",
//           "bugs\t\t: cpu_meltdown spectre_v1 spectre_v2 spec_store_bypass l1tf mds swapgs taa itlb_multihit srbds mmio_stale_data retbleed gds",
//           "bogomips\t: 6599.98",
//           "clflush size\t: 64",
//           "cache_alignment\t: 64",
//           "address sizes\t: 39 bits physical, 48 bits virtual",
//           "power management:",
//           "",
//           "processor\t: 9",
//           "vendor_id\t: GenuineIntel",
//           "cpu family\t: 6",
//           "model\t\t: 158",
//           "model name\t: Intel(R) Xeon(R) E-2136 CPU @ 3.30GHz",
//           "stepping\t: 10",
//           "microcode\t: 0xf8",
//           "cpu MHz\t\t: 3300.000",
//           "cache size\t: 12288 KB",
//           "physical id\t: 0",
//           "siblings\t: 12",
//           "core id\t\t: 3",
//           "cpu cores\t: 6",
//           "apicid\t\t: 7",
//           "initial apicid\t: 7",
//           "fpu\t\t: yes",
//           "fpu_exception\t: yes",
//           "cpuid level\t: 22",
//           "wp\t\t: yes",
//           "flags\t\t: fpu vme de pse tsc msr pae mce cx8 apic sep mtrr pge mca cmov pat pse36 clflush dts acpi mmx fxsr sse sse2 ss ht tm pbe syscall nx pdpe1gb rdtscp lm contant_tsc art arch_perfmon pebs bts rep_good nopl xtopology nonstop_tsc cpuid aperfmperf pni pclmulqdq dtes64 monitor ds_cpl vmx smx est tm2 ssse3 sdbg fma cx16 xtpr pdcm pcid se4_1 sse4_2 x2apic movbe popcnt tsc_deadline_timer aes xsave avx f16c rdrand lahf_lm abm 3dnowprefetch cpuid_fault epb invpcid_single pti ssbd ibrs ibpb stibp tpr_shadow vnmi fexpriority ept vpid ept_ad fsgsbase tsc_adjust bmi1 avx2 smep bmi2 erms invpcid mpx rdseed adx smap clflushopt intel_pt xsaveopt xsavec xgetbv1 xsaves dtherm ida arat pln pts hp hwp_notify hwp_act_window hwp_epp md_clear flush_l1d arch_capabilities",
//           "vmx flags\t: vnmi preemption_timer invvpid ept_x_only ept_ad ept_1gb flexpriority tsc_offset vtpr mtf vapic ept vpid unrestricted_guest ple shadow_vmcs pml ept_mod_based_exec",
//           "bugs\t\t: cpu_meltdown spectre_v1 spectre_v2 spec_store_bypass l1tf mds swapgs taa itlb_multihit srbds mmio_stale_data retbleed gds",
//           "bogomips\t: 6599.98",
//           "clflush size\t: 64",
//           "cache_alignment\t: 64",
//           "address sizes\t: 39 bits physical, 48 bits virtual",
//           "power management:",
//           "",
//           "processor\t: 10",
//           "vendor_id\t: GenuineIntel",
//           "cpu family\t: 6",
//           "model\t\t: 158",
//           "model name\t: Intel(R) Xeon(R) E-2136 CPU @ 3.30GHz",
//           "stepping\t: 10",
//           "microcode\t: 0xf8",
//           "cpu MHz\t\t: 1853.858",
//           "cache size\t: 12288 KB",
//           "physical id\t: 0",
//           "siblings\t: 12",
//           "core id\t\t: 4",
//           "cpu cores\t: 6",
//           "apicid\t\t: 9",
//           "initial apicid\t: 9",
//           "fpu\t\t: yes",
//           "fpu_exception\t: yes",
//           "cpuid level\t: 22",
//           "wp\t\t: yes",
//           "flags\t\t: fpu vme de pse tsc msr pae mce cx8 apic sep mtrr pge mca cmov pat pse36 clflush dts acpi mmx fxsr sse sse2 ss ht tm pbe syscall nx pdpe1gb rdtscp lm contant_tsc art arch_perfmon pebs bts rep_good nopl xtopology nonstop_tsc cpuid aperfmperf pni pclmulqdq dtes64 monitor ds_cpl vmx smx est tm2 ssse3 sdbg fma cx16 xtpr pdcm pcid se4_1 sse4_2 x2apic movbe popcnt tsc_deadline_timer aes xsave avx f16c rdrand lahf_lm abm 3dnowprefetch cpuid_fault epb invpcid_single pti ssbd ibrs ibpb stibp tpr_shadow vnmi fexpriority ept vpid ept_ad fsgsbase tsc_adjust bmi1 avx2 smep bmi2 erms invpcid mpx rdseed adx smap clflushopt intel_pt xsaveopt xsavec xgetbv1 xsaves dtherm ida arat pln pts hp hwp_notify hwp_act_window hwp_epp md_clear flush_l1d arch_capabilities",
//           "vmx flags\t: vnmi preemption_timer invvpid ept_x_only ept_ad ept_1gb flexpriority tsc_offset vtpr mtf vapic ept vpid unrestricted_guest ple shadow_vmcs pml ept_mod_based_exec",
//           "bugs\t\t: cpu_meltdown spectre_v1 spectre_v2 spec_store_bypass l1tf mds swapgs taa itlb_multihit srbds mmio_stale_data retbleed gds",
//           "bogomips\t: 6599.98",
//           "clflush size\t: 64",
//           "cache_alignment\t: 64",
//           "address sizes\t: 39 bits physical, 48 bits virtual",
//           "power management:",
//           "",
//           "processor\t: 11",
//           "vendor_id\t: GenuineIntel",
//           "cpu family\t: 6",
//           "model\t\t: 158",
//           "model name\t: Intel(R) Xeon(R) E-2136 CPU @ 3.30GHz",
//           "stepping\t: 10",
//           "microcode\t: 0xf8",
//           "cpu MHz\t\t: 3300.000",
//           "cache size\t: 12288 KB",
//           "physical id\t: 0",
//           "siblings\t: 12",
//           "core id\t\t: 5",
//           "cpu cores\t: 6",
//           "apicid\t\t: 11",
//           "initial apicid\t: 11",
//           "fpu\t\t: yes",
//           "fpu_exception\t: yes",
//           "cpuid level\t: 22",
//           "wp\t\t: yes",
//           "flags\t\t: fpu vme de pse tsc msr pae mce cx8 apic sep mtrr pge mca cmov pat pse36 clflush dts acpi mmx fxsr sse sse2 ss ht tm pbe syscall nx pdpe1gb rdtscp lm contant_tsc art arch_perfmon pebs bts rep_good nopl xtopology nonstop_tsc cpuid aperfmperf pni pclmulqdq dtes64 monitor ds_cpl vmx smx est tm2 ssse3 sdbg fma cx16 xtpr pdcm pcid se4_1 sse4_2 x2apic movbe popcnt tsc_deadline_timer aes xsave avx f16c rdrand lahf_lm abm 3dnowprefetch cpuid_fault epb invpcid_single pti ssbd ibrs ibpb stibp tpr_shadow vnmi fexpriority ept vpid ept_ad fsgsbase tsc_adjust bmi1 avx2 smep bmi2 erms invpcid mpx rdseed adx smap clflushopt intel_pt xsaveopt xsavec xgetbv1 xsaves dtherm ida arat pln pts hp hwp_notify hwp_act_window hwp_epp md_clear flush_l1d arch_capabilities",
//           "vmx flags\t: vnmi preemption_timer invvpid ept_x_only ept_ad ept_1gb flexpriority tsc_offset vtpr mtf vapic ept vpid unrestricted_guest ple shadow_vmcs pml ept_mod_based_exec",
//           "bugs\t\t: cpu_meltdown spectre_v1 spectre_v2 spec_store_bypass l1tf mds swapgs taa itlb_multihit srbds mmio_stale_data retbleed gds",
//           "bogomips\t: 6599.98",
//           "clflush size\t: 64",
//           "cache_alignment\t: 64",
//           "address sizes\t: 39 bits physical, 48 bits virtual",
//           "power management:"];
//         myType = "Server";
//         myGroups = ["servers"];
//         myEpoch = (Number(Number(currentEpoch)).toFixed(3));
//         myIcon = "pi pi-server";
//         myLastUpdate = "2024-10-10:21:50:22";
//         myUptime = (Number(Number("3279890.20")/3600)).toFixed(3);
        
//         myServer = this.setTestServer(myCPU, myEpoch, myGroups, myhostname, myIcon, myLastUpdate, myStatus, myType, myUptime);
        
//         // console.log("--------- myServer 8 ---------");
//         // console.log(myServer8);
        
//         postsArray.push(myServer);

//         this.hosts.push(myhostname);
        
//         myhostname = "ubuntu1";
//         myCPU = [
//           "processor\t: 0",
//           "vendor_id\t: GenuineIntel",
//           "cpu family\t: 6",
//           "model\t\t: 154",
//           "model name\t: 12th Gen Intel(R) Core(TM) i7-1255U",
//           "stepping\t: 4",
//           "microcode\t: 0x433",
//           "cpu MHz\t\t: 4700.000",
//           "cache size\t: 12288 KB",
//           "physical id\t: 0",
//           "siblings\t: 12",
//           "core id\t\t: 0",
//           "cpu cores\t: 10",
//           "apicid\t\t: 0",
//           "initial apicid\t: 0",
//           "fpu\t\t: yes",
//           "fpu_exception\t: yes",
//           "cpuid level\t: 32",
//           "wp\t\t: yes",
//           "flags\t\t: fpu vme de pse tsc msr pae mce cx8 apic sep mtrr pge mca cmov pat pse36 clflush dts acpi mmx fxsr sse sse2 ss ht tm pbe syscall nx pdpe1gb rdtscp lm contant_tsc art arch_perfmon pebs bts rep_good nopl xtopology nonstop_tsc cpuid aperfmperf tsc_known_freq pni pclmulqdq dtes64 monitor ds_cpl vmx smx est tm2 ssse3 sdbg fma cx16 xpr pdcm sse4_1 sse4_2 x2apic movbe popcnt tsc_deadline_timer aes xsave avx f16c rdrand lahf_lm abm 3dnowprefetch cpuid_fault epb cat_l2 cdp_l2 ssbd ibrs ibpb stibp ibrs_enhance tpr_shadow flexpriority ept vpid ept_ad fsgsbase tsc_adjust bmi1 avx2 smep bmi2 erms invpcid rdt_a rdseed adx smap clflushopt clwb intel_pt sha_ni xsaveopt xsavec xgetbv1 xsavs split_lock_detect user_shstk avx_vnni dtherm ida arat pln pts hwp hwp_notify hwp_act_window hwp_epp hwp_pkg_req hfi vnmi umip pku ospke waitpkg gfni vaes vpclmulqdq rdpid moviri movdir64b fsrm md_clear serialize arch_lbr ibt flush_l1d arch_capabilities",
//           "vmx flags\t: vnmi preemption_timer posted_intr invvpid ept_x_only ept_ad ept_1gb flexpriority apicv tsc_offset vtpr mtf vapic ept vpid unrestricted_guest vapic_regvid ple shadow_vmcs ept_mode_based_exec tsc_scaling usr_wait_pause",
//           "bugs\t\t: spectre_v1 spectre_v2 spec_store_bypass swapgs eibrs_pbrsb rfds bhi",
//           "bogomips\t: 5222.40",
//           "clflush size\t: 64",
//           "cache_alignment\t: 64",
//           "address sizes\t: 39 bits physical, 48 bits virtual",
//           "power management:",
//           "",
//           "processor\t: 1",
//           "vendor_id\t: GenuineIntel",
//           "cpu family\t: 6",
//           "model\t\t: 154",
//           "model name\t: 12th Gen Intel(R) Core(TM) i7-1255U",
//           "stepping\t: 4",
//           "microcode\t: 0x433",
//           "cpu MHz\t\t: 2547.533",
//           "cache size\t: 12288 KB",
//           "physical id\t: 0",
//           "siblings\t: 12",
//           "core id\t\t: 0",
//           "cpu cores\t: 10",
//           "apicid\t\t: 1",
//           "initial apicid\t: 1",
//           "fpu\t\t: yes",
//           "fpu_exception\t: yes",
//           "cpuid level\t: 32",
//           "wp\t\t: yes",
//           "flags\t\t: fpu vme de pse tsc msr pae mce cx8 apic sep mtrr pge mca cmov pat pse36 clflush dts acpi mmx fxsr sse sse2 ss ht tm pbe syscall nx pdpe1gb rdtscp lm contant_tsc art arch_perfmon pebs bts rep_good nopl xtopology nonstop_tsc cpuid aperfmperf tsc_known_freq pni pclmulqdq dtes64 monitor ds_cpl vmx smx est tm2 ssse3 sdbg fma cx16 xpr pdcm sse4_1 sse4_2 x2apic movbe popcnt tsc_deadline_timer aes xsave avx f16c rdrand lahf_lm abm 3dnowprefetch cpuid_fault epb cat_l2 cdp_l2 ssbd ibrs ibpb stibp ibrs_enhance tpr_shadow flexpriority ept vpid ept_ad fsgsbase tsc_adjust bmi1 avx2 smep bmi2 erms invpcid rdt_a rdseed adx smap clflushopt clwb intel_pt sha_ni xsaveopt xsavec xgetbv1 xsavs split_lock_detect user_shstk avx_vnni dtherm ida arat pln pts hwp hwp_notify hwp_act_window hwp_epp hwp_pkg_req hfi vnmi umip pku ospke waitpkg gfni vaes vpclmulqdq rdpid moviri movdir64b fsrm md_clear serialize arch_lbr ibt flush_l1d arch_capabilities",
//           "vmx flags\t: vnmi preemption_timer posted_intr invvpid ept_x_only ept_ad ept_1gb flexpriority apicv tsc_offset vtpr mtf vapic ept vpid unrestricted_guest vapic_regvid ple shadow_vmcs ept_mode_based_exec tsc_scaling usr_wait_pause",
//           "bugs\t\t: spectre_v1 spectre_v2 spec_store_bypass swapgs eibrs_pbrsb rfds bhi",
//           "bogomips\t: 5222.40",
//           "clflush size\t: 64",
//           "cache_alignment\t: 64",
//           "address sizes\t: 39 bits physical, 48 bits virtual",
//           "power management:",
//           "",
//           "processor\t: 2",
//           "vendor_id\t: GenuineIntel",
//           "cpu family\t: 6",
//           "model\t\t: 154",
//           "model name\t: 12th Gen Intel(R) Core(TM) i7-1255U",
//           "stepping\t: 4",
//           "microcode\t: 0x433",
//           "cpu MHz\t\t: 400.478",
//           "cache size\t: 12288 KB",
//           "physical id\t: 0",
//           "siblings\t: 12",
//           "core id\t\t: 4",
//           "cpu cores\t: 10",
//           "apicid\t\t: 8",
//           "initial apicid\t: 8",
//           "fpu\t\t: yes",
//           "fpu_exception\t: yes",
//           "cpuid level\t: 32",
//           "wp\t\t: yes",
//           "flags\t\t: fpu vme de pse tsc msr pae mce cx8 apic sep mtrr pge mca cmov pat pse36 clflush dts acpi mmx fxsr sse sse2 ss ht tm pbe syscall nx pdpe1gb rdtscp lm contant_tsc art arch_perfmon pebs bts rep_good nopl xtopology nonstop_tsc cpuid aperfmperf tsc_known_freq pni pclmulqdq dtes64 monitor ds_cpl vmx smx est tm2 ssse3 sdbg fma cx16 xpr pdcm sse4_1 sse4_2 x2apic movbe popcnt tsc_deadline_timer aes xsave avx f16c rdrand lahf_lm abm 3dnowprefetch cpuid_fault epb cat_l2 cdp_l2 ssbd ibrs ibpb stibp ibrs_enhance tpr_shadow flexpriority ept vpid ept_ad fsgsbase tsc_adjust bmi1 avx2 smep bmi2 erms invpcid rdt_a rdseed adx smap clflushopt clwb intel_pt sha_ni xsaveopt xsavec xgetbv1 xsavs split_lock_detect user_shstk avx_vnni dtherm ida arat pln pts hwp hwp_notify hwp_act_window hwp_epp hwp_pkg_req hfi vnmi umip pku ospke waitpkg gfni vaes vpclmulqdq rdpid moviri movdir64b fsrm md_clear serialize arch_lbr ibt flush_l1d arch_capabilities",
//           "vmx flags\t: vnmi preemption_timer posted_intr invvpid ept_x_only ept_ad ept_1gb flexpriority apicv tsc_offset vtpr mtf vapic ept vpid unrestricted_guest vapic_regvid ple shadow_vmcs ept_mode_based_exec tsc_scaling usr_wait_pause",
//           "bugs\t\t: spectre_v1 spectre_v2 spec_store_bypass swapgs eibrs_pbrsb rfds bhi",
//           "bogomips\t: 5222.40",
//           "clflush size\t: 64",
//           "cache_alignment\t: 64",
//           "address sizes\t: 39 bits physical, 48 bits virtual",
//           "power management:",
//           "",
//           "processor\t: 3",
//           "vendor_id\t: GenuineIntel",
//           "cpu family\t: 6",
//           "model\t\t: 154",
//           "model name\t: 12th Gen Intel(R) Core(TM) i7-1255U",
//           "stepping\t: 4",
//           "microcode\t: 0x433",
//           "cpu MHz\t\t: 441.627",
//           "cache size\t: 12288 KB",
//           "physical id\t: 0",
//           "siblings\t: 12",
//           "core id\t\t: 4",
//           "cpu cores\t: 10",
//           "apicid\t\t: 9",
//           "initial apicid\t: 9",
//           "fpu\t\t: yes",
//           "fpu_exception\t: yes",
//           "cpuid level\t: 32",
//           "wp\t\t: yes",
//           "flags\t\t: fpu vme de pse tsc msr pae mce cx8 apic sep mtrr pge mca cmov pat pse36 clflush dts acpi mmx fxsr sse sse2 ss ht tm pbe syscall nx pdpe1gb rdtscp lm contant_tsc art arch_perfmon pebs bts rep_good nopl xtopology nonstop_tsc cpuid aperfmperf tsc_known_freq pni pclmulqdq dtes64 monitor ds_cpl vmx smx est tm2 ssse3 sdbg fma cx16 xpr pdcm sse4_1 sse4_2 x2apic movbe popcnt tsc_deadline_timer aes xsave avx f16c rdrand lahf_lm abm 3dnowprefetch cpuid_fault epb cat_l2 cdp_l2 ssbd ibrs ibpb stibp ibrs_enhance tpr_shadow flexpriority ept vpid ept_ad fsgsbase tsc_adjust bmi1 avx2 smep bmi2 erms invpcid rdt_a rdseed adx smap clflushopt clwb intel_pt sha_ni xsaveopt xsavec xgetbv1 xsavs split_lock_detect user_shstk avx_vnni dtherm ida arat pln pts hwp hwp_notify hwp_act_window hwp_epp hwp_pkg_req hfi vnmi umip pku ospke waitpkg gfni vaes vpclmulqdq rdpid moviri movdir64b fsrm md_clear serialize arch_lbr ibt flush_l1d arch_capabilities",
//           "vmx flags\t: vnmi preemption_timer posted_intr invvpid ept_x_only ept_ad ept_1gb flexpriority apicv tsc_offset vtpr mtf vapic ept vpid unrestricted_guest vapic_regvid ple shadow_vmcs ept_mode_based_exec tsc_scaling usr_wait_pause",
//           "bugs\t\t: spectre_v1 spectre_v2 spec_store_bypass swapgs eibrs_pbrsb rfds bhi",
//           "bogomips\t: 5222.40",
//           "clflush size\t: 64",
//           "cache_alignment\t: 64",
//           "address sizes\t: 39 bits physical, 48 bits virtual",
//           "power management:",
//           "",
//           "processor\t: 4",
//           "vendor_id\t: GenuineIntel",
//           "cpu family\t: 6",
//           "model\t\t: 154",
//           "model name\t: 12th Gen Intel(R) Core(TM) i7-1255U",
//           "stepping\t: 4",
//           "microcode\t: 0x433",
//           "cpu MHz\t\t: 3384.259",
//           "cache size\t: 12288 KB",
//           "physical id\t: 0",
//           "siblings\t: 12",
//           "core id\t\t: 8",
//           "cpu cores\t: 10",
//           "apicid\t\t: 16",
//           "initial apicid\t: 16",
//           "fpu\t\t: yes",
//           "fpu_exception\t: yes",
//           "cpuid level\t: 32",
//           "wp\t\t: yes",
//           "flags\t\t: fpu vme de pse tsc msr pae mce cx8 apic sep mtrr pge mca cmov pat pse36 clflush dts acpi mmx fxsr sse sse2 ss ht tm pbe syscall nx pdpe1gb rdtscp lm contant_tsc art arch_perfmon pebs bts rep_good nopl xtopology nonstop_tsc cpuid aperfmperf tsc_known_freq pni pclmulqdq dtes64 monitor ds_cpl vmx smx est tm2 ssse3 sdbg fma cx16 xpr pdcm sse4_1 sse4_2 x2apic movbe popcnt tsc_deadline_timer aes xsave avx f16c rdrand lahf_lm abm 3dnowprefetch cpuid_fault epb cat_l2 cdp_l2 ssbd ibrs ibpb stibp ibrs_enhance tpr_shadow flexpriority ept vpid ept_ad fsgsbase tsc_adjust bmi1 avx2 smep bmi2 erms invpcid rdt_a rdseed adx smap clflushopt clwb intel_pt sha_ni xsaveopt xsavec xgetbv1 xsavs split_lock_detect user_shstk avx_vnni dtherm ida arat pln pts hwp hwp_notify hwp_act_window hwp_epp hwp_pkg_req hfi vnmi umip pku ospke waitpkg gfni vaes vpclmulqdq rdpid moviri movdir64b fsrm md_clear serialize arch_lbr ibt flush_l1d arch_capabilities",
//           "vmx flags\t: vnmi preemption_timer posted_intr invvpid ept_x_only ept_ad ept_1gb flexpriority apicv tsc_offset vtpr mtf vapic ept vpid unrestricted_guest vapic_regvid ple shadow_vmcs ept_mode_based_exec tsc_scaling usr_wait_pause",
//           "bugs\t\t: spectre_v1 spectre_v2 spec_store_bypass swapgs eibrs_pbrsb rfds bhi",
//           "bogomips\t: 5222.40",
//           "clflush size\t: 64",
//           "cache_alignment\t: 64",
//           "address sizes\t: 39 bits physical, 48 bits virtual",
//           "power management:",
//           "",
//           "processor\t: 5",
//           "vendor_id\t: GenuineIntel",
//           "cpu family\t: 6",
//           "model\t\t: 154",
//           "model name\t: 12th Gen Intel(R) Core(TM) i7-1255U",
//           "stepping\t: 4",
//           "microcode\t: 0x433",
//           "cpu MHz\t\t: 3399.803",
//           "cache size\t: 12288 KB",
//           "physical id\t: 0",
//           "siblings\t: 12",
//           "core id\t\t: 9",
//           "cpu cores\t: 10",
//           "apicid\t\t: 18",
//           "initial apicid\t: 18",
//           "fpu\t\t: yes",
//           "fpu_exception\t: yes",
//           "cpuid level\t: 32",
//           "wp\t\t: yes",
//           "flags\t\t: fpu vme de pse tsc msr pae mce cx8 apic sep mtrr pge mca cmov pat pse36 clflush dts acpi mmx fxsr sse sse2 ss ht tm pbe syscall nx pdpe1gb rdtscp lm contant_tsc art arch_perfmon pebs bts rep_good nopl xtopology nonstop_tsc cpuid aperfmperf tsc_known_freq pni pclmulqdq dtes64 monitor ds_cpl vmx smx est tm2 ssse3 sdbg fma cx16 xpr pdcm sse4_1 sse4_2 x2apic movbe popcnt tsc_deadline_timer aes xsave avx f16c rdrand lahf_lm abm 3dnowprefetch cpuid_fault epb cat_l2 cdp_l2 ssbd ibrs ibpb stibp ibrs_enhance tpr_shadow flexpriority ept vpid ept_ad fsgsbase tsc_adjust bmi1 avx2 smep bmi2 erms invpcid rdt_a rdseed adx smap clflushopt clwb intel_pt sha_ni xsaveopt xsavec xgetbv1 xsavs split_lock_detect user_shstk avx_vnni dtherm ida arat pln pts hwp hwp_notify hwp_act_window hwp_epp hwp_pkg_req hfi vnmi umip pku ospke waitpkg gfni vaes vpclmulqdq rdpid moviri movdir64b fsrm md_clear serialize arch_lbr ibt flush_l1d arch_capabilities",
//           "vmx flags\t: vnmi preemption_timer posted_intr invvpid ept_x_only ept_ad ept_1gb flexpriority apicv tsc_offset vtpr mtf vapic ept vpid unrestricted_guest vapic_regvid ple shadow_vmcs ept_mode_based_exec tsc_scaling usr_wait_pause",
//           "bugs\t\t: spectre_v1 spectre_v2 spec_store_bypass swapgs eibrs_pbrsb rfds bhi",
//           "bogomips\t: 5222.40",
//           "clflush size\t: 64",
//           "cache_alignment\t: 64",
//           "address sizes\t: 39 bits physical, 48 bits virtual",
//           "power management:",
//           "",
//           "processor\t: 6",
//           "vendor_id\t: GenuineIntel",
//           "cpu family\t: 6",
//           "model\t\t: 154",
//           "model name\t: 12th Gen Intel(R) Core(TM) i7-1255U",
//           "stepping\t: 4",
//           "microcode\t: 0x433",
//           "cpu MHz\t\t: 3395.183",
//           "cache size\t: 12288 KB",
//           "physical id\t: 0",
//           "siblings\t: 12",
//           "core id\t\t: 10",
//           "cpu cores\t: 10",
//           "apicid\t\t: 20",
//           "initial apicid\t: 20",
//           "fpu\t\t: yes",
//           "fpu_exception\t: yes",
//           "cpuid level\t: 32",
//           "wp\t\t: yes",
//           "flags\t\t: fpu vme de pse tsc msr pae mce cx8 apic sep mtrr pge mca cmov pat pse36 clflush dts acpi mmx fxsr sse sse2 ss ht tm pbe syscall nx pdpe1gb rdtscp lm contant_tsc art arch_perfmon pebs bts rep_good nopl xtopology nonstop_tsc cpuid aperfmperf tsc_known_freq pni pclmulqdq dtes64 monitor ds_cpl vmx smx est tm2 ssse3 sdbg fma cx16 xpr pdcm sse4_1 sse4_2 x2apic movbe popcnt tsc_deadline_timer aes xsave avx f16c rdrand lahf_lm abm 3dnowprefetch cpuid_fault epb cat_l2 cdp_l2 ssbd ibrs ibpb stibp ibrs_enhance tpr_shadow flexpriority ept vpid ept_ad fsgsbase tsc_adjust bmi1 avx2 smep bmi2 erms invpcid rdt_a rdseed adx smap clflushopt clwb intel_pt sha_ni xsaveopt xsavec xgetbv1 xsavs split_lock_detect user_shstk avx_vnni dtherm ida arat pln pts hwp hwp_notify hwp_act_window hwp_epp hwp_pkg_req hfi vnmi umip pku ospke waitpkg gfni vaes vpclmulqdq rdpid moviri movdir64b fsrm md_clear serialize arch_lbr ibt flush_l1d arch_capabilities",
//           "vmx flags\t: vnmi preemption_timer posted_intr invvpid ept_x_only ept_ad ept_1gb flexpriority apicv tsc_offset vtpr mtf vapic ept vpid unrestricted_guest vapic_regvid ple shadow_vmcs ept_mode_based_exec tsc_scaling usr_wait_pause",
//           "bugs\t\t: spectre_v1 spectre_v2 spec_store_bypass swapgs eibrs_pbrsb rfds bhi",
//           "bogomips\t: 5222.40",
//           "clflush size\t: 64",
//           "cache_alignment\t: 64",
//           "address sizes\t: 39 bits physical, 48 bits virtual",
//           "power management:",
//           "",
//           "processor\t: 7",
//           "vendor_id\t: GenuineIntel",
//           "cpu family\t: 6",
//           "model\t\t: 154",
//           "model name\t: 12th Gen Intel(R) Core(TM) i7-1255U",
//           "stepping\t: 4",
//           "microcode\t: 0x433",
//           "cpu MHz\t\t: 3402.276",
//           "cache size\t: 12288 KB",
//           "physical id\t: 0",
//           "siblings\t: 12",
//           "core id\t\t: 11",
//           "cpu cores\t: 10",
//           "apicid\t\t: 22",
//           "initial apicid\t: 22",
//           "fpu\t\t: yes",
//           "fpu_exception\t: yes",
//           "cpuid level\t: 32",
//           "wp\t\t: yes",
//           "flags\t\t: fpu vme de pse tsc msr pae mce cx8 apic sep mtrr pge mca cmov pat pse36 clflush dts acpi mmx fxsr sse sse2 ss ht tm pbe syscall nx pdpe1gb rdtscp lm contant_tsc art arch_perfmon pebs bts rep_good nopl xtopology nonstop_tsc cpuid aperfmperf tsc_known_freq pni pclmulqdq dtes64 monitor ds_cpl vmx smx est tm2 ssse3 sdbg fma cx16 xpr pdcm sse4_1 sse4_2 x2apic movbe popcnt tsc_deadline_timer aes xsave avx f16c rdrand lahf_lm abm 3dnowprefetch cpuid_fault epb cat_l2 cdp_l2 ssbd ibrs ibpb stibp ibrs_enhance tpr_shadow flexpriority ept vpid ept_ad fsgsbase tsc_adjust bmi1 avx2 smep bmi2 erms invpcid rdt_a rdseed adx smap clflushopt clwb intel_pt sha_ni xsaveopt xsavec xgetbv1 xsavs split_lock_detect user_shstk avx_vnni dtherm ida arat pln pts hwp hwp_notify hwp_act_window hwp_epp hwp_pkg_req hfi vnmi umip pku ospke waitpkg gfni vaes vpclmulqdq rdpid moviri movdir64b fsrm md_clear serialize arch_lbr ibt flush_l1d arch_capabilities",
//           "vmx flags\t: vnmi preemption_timer posted_intr invvpid ept_x_only ept_ad ept_1gb flexpriority apicv tsc_offset vtpr mtf vapic ept vpid unrestricted_guest vapic_regvid ple shadow_vmcs ept_mode_based_exec tsc_scaling usr_wait_pause",
//           "bugs\t\t: spectre_v1 spectre_v2 spec_store_bypass swapgs eibrs_pbrsb rfds bhi",
//           "bogomips\t: 5222.40",
//           "clflush size\t: 64",
//           "cache_alignment\t: 64",
//           "address sizes\t: 39 bits physical, 48 bits virtual",
//           "power management:",
//           "",
//           "processor\t: 8",
//           "vendor_id\t: GenuineIntel",
//           "cpu family\t: 6",
//           "model\t\t: 154",
//           "model name\t: 12th Gen Intel(R) Core(TM) i7-1255U",
//           "stepping\t: 4",
//           "microcode\t: 0x433",
//           "cpu MHz\t\t: 3400.631",
//           "cache size\t: 12288 KB",
//           "physical id\t: 0",
//           "siblings\t: 12",
//           "core id\t\t: 12",
//           "cpu cores\t: 10",
//           "apicid\t\t: 24",
//           "initial apicid\t: 24",
//           "fpu\t\t: yes",
//           "fpu_exception\t: yes",
//           "cpuid level\t: 32",
//           "wp\t\t: yes",
//           "flags\t\t: fpu vme de pse tsc msr pae mce cx8 apic sep mtrr pge mca cmov pat pse36 clflush dts acpi mmx fxsr sse sse2 ss ht tm pbe syscall nx pdpe1gb rdtscp lm contant_tsc art arch_perfmon pebs bts rep_good nopl xtopology nonstop_tsc cpuid aperfmperf tsc_known_freq pni pclmulqdq dtes64 monitor ds_cpl vmx smx est tm2 ssse3 sdbg fma cx16 xpr pdcm sse4_1 sse4_2 x2apic movbe popcnt tsc_deadline_timer aes xsave avx f16c rdrand lahf_lm abm 3dnowprefetch cpuid_fault epb cat_l2 cdp_l2 ssbd ibrs ibpb stibp ibrs_enhance tpr_shadow flexpriority ept vpid ept_ad fsgsbase tsc_adjust bmi1 avx2 smep bmi2 erms invpcid rdt_a rdseed adx smap clflushopt clwb intel_pt sha_ni xsaveopt xsavec xgetbv1 xsavs split_lock_detect user_shstk avx_vnni dtherm ida arat pln pts hwp hwp_notify hwp_act_window hwp_epp hwp_pkg_req hfi vnmi umip pku ospke waitpkg gfni vaes vpclmulqdq rdpid moviri movdir64b fsrm md_clear serialize arch_lbr ibt flush_l1d arch_capabilities",
//           "vmx flags\t: vnmi preemption_timer posted_intr invvpid ept_x_only ept_ad ept_1gb flexpriority apicv tsc_offset vtpr mtf vapic ept vpid unrestricted_guest vapic_regvid ple shadow_vmcs ept_mode_based_exec tsc_scaling usr_wait_pause",
//           "bugs\t\t: spectre_v1 spectre_v2 spec_store_bypass swapgs eibrs_pbrsb rfds bhi",
//           "bogomips\t: 5222.40",
//           "clflush size\t: 64",
//           "cache_alignment\t: 64",
//           "address sizes\t: 39 bits physical, 48 bits virtual",
//           "power management:",
//           "",
//           "processor\t: 9",
//           "vendor_id\t: GenuineIntel",
//           "cpu family\t: 6",
//           "model\t\t: 154",
//           "model name\t: 12th Gen Intel(R) Core(TM) i7-1255U",
//           "stepping\t: 4",
//           "microcode\t: 0x433",
//           "cpu MHz\t\t: 3399.603",
//           "cache size\t: 12288 KB",
//           "physical id\t: 0",
//           "siblings\t: 12",
//           "core id\t\t: 13",
//           "cpu cores\t: 10",
//           "apicid\t\t: 26",
//           "initial apicid\t: 26",
//           "fpu\t\t: yes",
//           "fpu_exception\t: yes",
//           "cpuid level\t: 32",
//           "wp\t\t: yes",
//           "flags\t\t: fpu vme de pse tsc msr pae mce cx8 apic sep mtrr pge mca cmov pat pse36 clflush dts acpi mmx fxsr sse sse2 ss ht tm pbe syscall nx pdpe1gb rdtscp lm contant_tsc art arch_perfmon pebs bts rep_good nopl xtopology nonstop_tsc cpuid aperfmperf tsc_known_freq pni pclmulqdq dtes64 monitor ds_cpl vmx smx est tm2 ssse3 sdbg fma cx16 xpr pdcm sse4_1 sse4_2 x2apic movbe popcnt tsc_deadline_timer aes xsave avx f16c rdrand lahf_lm abm 3dnowprefetch cpuid_fault epb cat_l2 cdp_l2 ssbd ibrs ibpb stibp ibrs_enhance tpr_shadow flexpriority ept vpid ept_ad fsgsbase tsc_adjust bmi1 avx2 smep bmi2 erms invpcid rdt_a rdseed adx smap clflushopt clwb intel_pt sha_ni xsaveopt xsavec xgetbv1 xsavs split_lock_detect user_shstk avx_vnni dtherm ida arat pln pts hwp hwp_notify hwp_act_window hwp_epp hwp_pkg_req hfi vnmi umip pku ospke waitpkg gfni vaes vpclmulqdq rdpid moviri movdir64b fsrm md_clear serialize arch_lbr ibt flush_l1d arch_capabilities",
//           "vmx flags\t: vnmi preemption_timer posted_intr invvpid ept_x_only ept_ad ept_1gb flexpriority apicv tsc_offset vtpr mtf vapic ept vpid unrestricted_guest vapic_regvid ple shadow_vmcs ept_mode_based_exec tsc_scaling usr_wait_pause",
//           "bugs\t\t: spectre_v1 spectre_v2 spec_store_bypass swapgs eibrs_pbrsb rfds bhi",
//           "bogomips\t: 5222.40",
//           "clflush size\t: 64",
//           "cache_alignment\t: 64",
//           "address sizes\t: 39 bits physical, 48 bits virtual",
//           "power management:",
//           "",
//           "processor\t: 10",
//           "vendor_id\t: GenuineIntel",
//           "cpu family\t: 6",
//           "model\t\t: 154",
//           "model name\t: 12th Gen Intel(R) Core(TM) i7-1255U",
//           "stepping\t: 4",
//           "microcode\t: 0x433",
//           "cpu MHz\t\t: 3398.114",
//           "cache size\t: 12288 KB",
//           "physical id\t: 0",
//           "siblings\t: 12",
//           "core id\t\t: 14",
//           "cpu cores\t: 10",
//           "apicid\t\t: 28",
//           "initial apicid\t: 28",
//           "fpu\t\t: yes",
//           "fpu_exception\t: yes",
//           "cpuid level\t: 32",
//           "wp\t\t: yes",
//           "flags\t\t: fpu vme de pse tsc msr pae mce cx8 apic sep mtrr pge mca cmov pat pse36 clflush dts acpi mmx fxsr sse sse2 ss ht tm pbe syscall nx pdpe1gb rdtscp lm contant_tsc art arch_perfmon pebs bts rep_good nopl xtopology nonstop_tsc cpuid aperfmperf tsc_known_freq pni pclmulqdq dtes64 monitor ds_cpl vmx smx est tm2 ssse3 sdbg fma cx16 xpr pdcm sse4_1 sse4_2 x2apic movbe popcnt tsc_deadline_timer aes xsave avx f16c rdrand lahf_lm abm 3dnowprefetch cpuid_fault epb cat_l2 cdp_l2 ssbd ibrs ibpb stibp ibrs_enhance tpr_shadow flexpriority ept vpid ept_ad fsgsbase tsc_adjust bmi1 avx2 smep bmi2 erms invpcid rdt_a rdseed adx smap clflushopt clwb intel_pt sha_ni xsaveopt xsavec xgetbv1 xsavs split_lock_detect user_shstk avx_vnni dtherm ida arat pln pts hwp hwp_notify hwp_act_window hwp_epp hwp_pkg_req hfi vnmi umip pku ospke waitpkg gfni vaes vpclmulqdq rdpid moviri movdir64b fsrm md_clear serialize arch_lbr ibt flush_l1d arch_capabilities",
//           "vmx flags\t: vnmi preemption_timer posted_intr invvpid ept_x_only ept_ad ept_1gb flexpriority apicv tsc_offset vtpr mtf vapic ept vpid unrestricted_guest vapic_regvid ple shadow_vmcs ept_mode_based_exec tsc_scaling usr_wait_pause",
//           "bugs\t\t: spectre_v1 spectre_v2 spec_store_bypass swapgs eibrs_pbrsb rfds bhi",
//           "bogomips\t: 5222.40",
//           "clflush size\t: 64",
//           "cache_alignment\t: 64",
//           "address sizes\t: 39 bits physical, 48 bits virtual",
//           "power management:",
//           "",
//           "processor\t: 11",
//           "vendor_id\t: GenuineIntel",
//           "cpu family\t: 6",
//           "model\t\t: 154",
//           "model name\t: 12th Gen Intel(R) Core(TM) i7-1255U",
//           "stepping\t: 4",
//           "microcode\t: 0x433",
//           "cpu MHz\t\t: 3135.933",
//           "cache size\t: 12288 KB",
//           "physical id\t: 0",
//           "siblings\t: 12",
//           "core id\t\t: 15",
//           "cpu cores\t: 10",
//           "apicid\t\t: 30",
//           "initial apicid\t: 30",
//           "fpu\t\t: yes",
//           "fpu_exception\t: yes",
//           "cpuid level\t: 32",
//           "wp\t\t: yes",
//           "flags\t\t: fpu vme de pse tsc msr pae mce cx8 apic sep mtrr pge mca cmov pat pse36 clflush dts acpi mmx fxsr sse sse2 ss ht tm pbe syscall nx pdpe1gb rdtscp lm contant_tsc art arch_perfmon pebs bts rep_good nopl xtopology nonstop_tsc cpuid aperfmperf tsc_known_freq pni pclmulqdq dtes64 monitor ds_cpl vmx smx est tm2 ssse3 sdbg fma cx16 xpr pdcm sse4_1 sse4_2 x2apic movbe popcnt tsc_deadline_timer aes xsave avx f16c rdrand lahf_lm abm 3dnowprefetch cpuid_fault epb cat_l2 cdp_l2 ssbd ibrs ibpb stibp ibrs_enhance tpr_shadow flexpriority ept vpid ept_ad fsgsbase tsc_adjust bmi1 avx2 smep bmi2 erms invpcid rdt_a rdseed adx smap clflushopt clwb intel_pt sha_ni xsaveopt xsavec xgetbv1 xsavs split_lock_detect user_shstk avx_vnni dtherm ida arat pln pts hwp hwp_notify hwp_act_window hwp_epp hwp_pkg_req hfi vnmi umip pku ospke waitpkg gfni vaes vpclmulqdq rdpid moviri movdir64b fsrm md_clear serialize arch_lbr ibt flush_l1d arch_capabilities",
//           "vmx flags\t: vnmi preemption_timer posted_intr invvpid ept_x_only ept_ad ept_1gb flexpriority apicv tsc_offset vtpr mtf vapic ept vpid unrestricted_guest vapic_regvid ple shadow_vmcs ept_mode_based_exec tsc_scaling usr_wait_pause",
//           "bugs\t\t: spectre_v1 spectre_v2 spec_store_bypass swapgs eibrs_pbrsb rfds bhi",
//           "bogomips\t: 5222.40",
//           "clflush size\t: 64",
//           "cache_alignment\t: 64",
//           "address sizes\t: 39 bits physical, 48 bits virtual",
//           "power management:"];
//         myType = "Laptop";
//         myGroups = ["laptops"];
//         myEpoch = (Number(Number(currentEpoch)).toFixed(3));
//         myIcon = "pi pi-briefcase";
//         myLastUpdate = "2024-10-10:21:50:22";
//         myUptime = (Number(Number("3279890.20")/3600)).toFixed(3);
        
//         myServer = this.setTestServer(myCPU, myEpoch, myGroups, myhostname, myIcon, myLastUpdate, myStatus, myType, myUptime);
        
//         // console.log("--------- myServer 9 ---------");
//         // console.log(myServer9);
        
//         postsArray.push(myServer);

//         this.hosts.push(myhostname);
        
//         myhostname = "ubuntu2";
//         myCPU = [
//           "processor\t: 0",
//           "vendor_id\t: GenuineIntel",
//           "cpu family\t: 6",
//           "model\t\t: 154",
//           "model name\t: 12th Gen Intel(R) Core(TM) i7-1255U",
//           "stepping\t: 4",
//           "microcode\t: 0x433",
//           "cpu MHz\t\t: 4700.000",
//           "cache size\t: 12288 KB",
//           "physical id\t: 0",
//           "siblings\t: 12",
//           "core id\t\t: 0",
//           "cpu cores\t: 10",
//           "apicid\t\t: 0",
//           "initial apicid\t: 0",
//           "fpu\t\t: yes",
//           "fpu_exception\t: yes",
//           "cpuid level\t: 32",
//           "wp\t\t: yes",
//           "flags\t\t: fpu vme de pse tsc msr pae mce cx8 apic sep mtrr pge mca cmov pat pse36 clflush dts acpi mmx fxsr sse sse2 ss ht tm pbe syscall nx pdpe1gb rdtscp lm contant_tsc art arch_perfmon pebs bts rep_good nopl xtopology nonstop_tsc cpuid aperfmperf tsc_known_freq pni pclmulqdq dtes64 monitor ds_cpl vmx smx est tm2 ssse3 sdbg fma cx16 xpr pdcm sse4_1 sse4_2 x2apic movbe popcnt tsc_deadline_timer aes xsave avx f16c rdrand lahf_lm abm 3dnowprefetch cpuid_fault epb cat_l2 cdp_l2 ssbd ibrs ibpb stibp ibrs_enhance tpr_shadow flexpriority ept vpid ept_ad fsgsbase tsc_adjust bmi1 avx2 smep bmi2 erms invpcid rdt_a rdseed adx smap clflushopt clwb intel_pt sha_ni xsaveopt xsavec xgetbv1 xsavs split_lock_detect user_shstk avx_vnni dtherm ida arat pln pts hwp hwp_notify hwp_act_window hwp_epp hwp_pkg_req hfi vnmi umip pku ospke waitpkg gfni vaes vpclmulqdq rdpid moviri movdir64b fsrm md_clear serialize arch_lbr ibt flush_l1d arch_capabilities",
//           "vmx flags\t: vnmi preemption_timer posted_intr invvpid ept_x_only ept_ad ept_1gb flexpriority apicv tsc_offset vtpr mtf vapic ept vpid unrestricted_guest vapic_regvid ple shadow_vmcs ept_mode_based_exec tsc_scaling usr_wait_pause",
//           "bugs\t\t: spectre_v1 spectre_v2 spec_store_bypass swapgs eibrs_pbrsb rfds bhi",
//           "bogomips\t: 5222.40",
//           "clflush size\t: 64",
//           "cache_alignment\t: 64",
//           "address sizes\t: 39 bits physical, 48 bits virtual",
//           "power management:",
//           "",
//           "processor\t: 1",
//           "vendor_id\t: GenuineIntel",
//           "cpu family\t: 6",
//           "model\t\t: 154",
//           "model name\t: 12th Gen Intel(R) Core(TM) i7-1255U",
//           "stepping\t: 4",
//           "microcode\t: 0x433",
//           "cpu MHz\t\t: 2547.533",
//           "cache size\t: 12288 KB",
//           "physical id\t: 0",
//           "siblings\t: 12",
//           "core id\t\t: 0",
//           "cpu cores\t: 10",
//           "apicid\t\t: 1",
//           "initial apicid\t: 1",
//           "fpu\t\t: yes",
//           "fpu_exception\t: yes",
//           "cpuid level\t: 32",
//           "wp\t\t: yes",
//           "flags\t\t: fpu vme de pse tsc msr pae mce cx8 apic sep mtrr pge mca cmov pat pse36 clflush dts acpi mmx fxsr sse sse2 ss ht tm pbe syscall nx pdpe1gb rdtscp lm contant_tsc art arch_perfmon pebs bts rep_good nopl xtopology nonstop_tsc cpuid aperfmperf tsc_known_freq pni pclmulqdq dtes64 monitor ds_cpl vmx smx est tm2 ssse3 sdbg fma cx16 xpr pdcm sse4_1 sse4_2 x2apic movbe popcnt tsc_deadline_timer aes xsave avx f16c rdrand lahf_lm abm 3dnowprefetch cpuid_fault epb cat_l2 cdp_l2 ssbd ibrs ibpb stibp ibrs_enhance tpr_shadow flexpriority ept vpid ept_ad fsgsbase tsc_adjust bmi1 avx2 smep bmi2 erms invpcid rdt_a rdseed adx smap clflushopt clwb intel_pt sha_ni xsaveopt xsavec xgetbv1 xsavs split_lock_detect user_shstk avx_vnni dtherm ida arat pln pts hwp hwp_notify hwp_act_window hwp_epp hwp_pkg_req hfi vnmi umip pku ospke waitpkg gfni vaes vpclmulqdq rdpid moviri movdir64b fsrm md_clear serialize arch_lbr ibt flush_l1d arch_capabilities",
//           "vmx flags\t: vnmi preemption_timer posted_intr invvpid ept_x_only ept_ad ept_1gb flexpriority apicv tsc_offset vtpr mtf vapic ept vpid unrestricted_guest vapic_regvid ple shadow_vmcs ept_mode_based_exec tsc_scaling usr_wait_pause",
//           "bugs\t\t: spectre_v1 spectre_v2 spec_store_bypass swapgs eibrs_pbrsb rfds bhi",
//           "bogomips\t: 5222.40",
//           "clflush size\t: 64",
//           "cache_alignment\t: 64",
//           "address sizes\t: 39 bits physical, 48 bits virtual",
//           "power management:",
//           "",
//           "processor\t: 2",
//           "vendor_id\t: GenuineIntel",
//           "cpu family\t: 6",
//           "model\t\t: 154",
//           "model name\t: 12th Gen Intel(R) Core(TM) i7-1255U",
//           "stepping\t: 4",
//           "microcode\t: 0x433",
//           "cpu MHz\t\t: 400.478",
//           "cache size\t: 12288 KB",
//           "physical id\t: 0",
//           "siblings\t: 12",
//           "core id\t\t: 4",
//           "cpu cores\t: 10",
//           "apicid\t\t: 8",
//           "initial apicid\t: 8",
//           "fpu\t\t: yes",
//           "fpu_exception\t: yes",
//           "cpuid level\t: 32",
//           "wp\t\t: yes",
//           "flags\t\t: fpu vme de pse tsc msr pae mce cx8 apic sep mtrr pge mca cmov pat pse36 clflush dts acpi mmx fxsr sse sse2 ss ht tm pbe syscall nx pdpe1gb rdtscp lm contant_tsc art arch_perfmon pebs bts rep_good nopl xtopology nonstop_tsc cpuid aperfmperf tsc_known_freq pni pclmulqdq dtes64 monitor ds_cpl vmx smx est tm2 ssse3 sdbg fma cx16 xpr pdcm sse4_1 sse4_2 x2apic movbe popcnt tsc_deadline_timer aes xsave avx f16c rdrand lahf_lm abm 3dnowprefetch cpuid_fault epb cat_l2 cdp_l2 ssbd ibrs ibpb stibp ibrs_enhance tpr_shadow flexpriority ept vpid ept_ad fsgsbase tsc_adjust bmi1 avx2 smep bmi2 erms invpcid rdt_a rdseed adx smap clflushopt clwb intel_pt sha_ni xsaveopt xsavec xgetbv1 xsavs split_lock_detect user_shstk avx_vnni dtherm ida arat pln pts hwp hwp_notify hwp_act_window hwp_epp hwp_pkg_req hfi vnmi umip pku ospke waitpkg gfni vaes vpclmulqdq rdpid moviri movdir64b fsrm md_clear serialize arch_lbr ibt flush_l1d arch_capabilities",
//           "vmx flags\t: vnmi preemption_timer posted_intr invvpid ept_x_only ept_ad ept_1gb flexpriority apicv tsc_offset vtpr mtf vapic ept vpid unrestricted_guest vapic_regvid ple shadow_vmcs ept_mode_based_exec tsc_scaling usr_wait_pause",
//           "bugs\t\t: spectre_v1 spectre_v2 spec_store_bypass swapgs eibrs_pbrsb rfds bhi",
//           "bogomips\t: 5222.40",
//           "clflush size\t: 64",
//           "cache_alignment\t: 64",
//           "address sizes\t: 39 bits physical, 48 bits virtual",
//           "power management:",
//           "",
//           "processor\t: 3",
//           "vendor_id\t: GenuineIntel",
//           "cpu family\t: 6",
//           "model\t\t: 154",
//           "model name\t: 12th Gen Intel(R) Core(TM) i7-1255U",
//           "stepping\t: 4",
//           "microcode\t: 0x433",
//           "cpu MHz\t\t: 441.627",
//           "cache size\t: 12288 KB",
//           "physical id\t: 0",
//           "siblings\t: 12",
//           "core id\t\t: 4",
//           "cpu cores\t: 10",
//           "apicid\t\t: 9",
//           "initial apicid\t: 9",
//           "fpu\t\t: yes",
//           "fpu_exception\t: yes",
//           "cpuid level\t: 32",
//           "wp\t\t: yes",
//           "flags\t\t: fpu vme de pse tsc msr pae mce cx8 apic sep mtrr pge mca cmov pat pse36 clflush dts acpi mmx fxsr sse sse2 ss ht tm pbe syscall nx pdpe1gb rdtscp lm contant_tsc art arch_perfmon pebs bts rep_good nopl xtopology nonstop_tsc cpuid aperfmperf tsc_known_freq pni pclmulqdq dtes64 monitor ds_cpl vmx smx est tm2 ssse3 sdbg fma cx16 xpr pdcm sse4_1 sse4_2 x2apic movbe popcnt tsc_deadline_timer aes xsave avx f16c rdrand lahf_lm abm 3dnowprefetch cpuid_fault epb cat_l2 cdp_l2 ssbd ibrs ibpb stibp ibrs_enhance tpr_shadow flexpriority ept vpid ept_ad fsgsbase tsc_adjust bmi1 avx2 smep bmi2 erms invpcid rdt_a rdseed adx smap clflushopt clwb intel_pt sha_ni xsaveopt xsavec xgetbv1 xsavs split_lock_detect user_shstk avx_vnni dtherm ida arat pln pts hwp hwp_notify hwp_act_window hwp_epp hwp_pkg_req hfi vnmi umip pku ospke waitpkg gfni vaes vpclmulqdq rdpid moviri movdir64b fsrm md_clear serialize arch_lbr ibt flush_l1d arch_capabilities",
//           "vmx flags\t: vnmi preemption_timer posted_intr invvpid ept_x_only ept_ad ept_1gb flexpriority apicv tsc_offset vtpr mtf vapic ept vpid unrestricted_guest vapic_regvid ple shadow_vmcs ept_mode_based_exec tsc_scaling usr_wait_pause",
//           "bugs\t\t: spectre_v1 spectre_v2 spec_store_bypass swapgs eibrs_pbrsb rfds bhi",
//           "bogomips\t: 5222.40",
//           "clflush size\t: 64",
//           "cache_alignment\t: 64",
//           "address sizes\t: 39 bits physical, 48 bits virtual",
//           "power management:",
//           "",
//           "processor\t: 4",
//           "vendor_id\t: GenuineIntel",
//           "cpu family\t: 6",
//           "model\t\t: 154",
//           "model name\t: 12th Gen Intel(R) Core(TM) i7-1255U",
//           "stepping\t: 4",
//           "microcode\t: 0x433",
//           "cpu MHz\t\t: 3384.259",
//           "cache size\t: 12288 KB",
//           "physical id\t: 0",
//           "siblings\t: 12",
//           "core id\t\t: 8",
//           "cpu cores\t: 10",
//           "apicid\t\t: 16",
//           "initial apicid\t: 16",
//           "fpu\t\t: yes",
//           "fpu_exception\t: yes",
//           "cpuid level\t: 32",
//           "wp\t\t: yes",
//           "flags\t\t: fpu vme de pse tsc msr pae mce cx8 apic sep mtrr pge mca cmov pat pse36 clflush dts acpi mmx fxsr sse sse2 ss ht tm pbe syscall nx pdpe1gb rdtscp lm contant_tsc art arch_perfmon pebs bts rep_good nopl xtopology nonstop_tsc cpuid aperfmperf tsc_known_freq pni pclmulqdq dtes64 monitor ds_cpl vmx smx est tm2 ssse3 sdbg fma cx16 xpr pdcm sse4_1 sse4_2 x2apic movbe popcnt tsc_deadline_timer aes xsave avx f16c rdrand lahf_lm abm 3dnowprefetch cpuid_fault epb cat_l2 cdp_l2 ssbd ibrs ibpb stibp ibrs_enhance tpr_shadow flexpriority ept vpid ept_ad fsgsbase tsc_adjust bmi1 avx2 smep bmi2 erms invpcid rdt_a rdseed adx smap clflushopt clwb intel_pt sha_ni xsaveopt xsavec xgetbv1 xsavs split_lock_detect user_shstk avx_vnni dtherm ida arat pln pts hwp hwp_notify hwp_act_window hwp_epp hwp_pkg_req hfi vnmi umip pku ospke waitpkg gfni vaes vpclmulqdq rdpid moviri movdir64b fsrm md_clear serialize arch_lbr ibt flush_l1d arch_capabilities",
//           "vmx flags\t: vnmi preemption_timer posted_intr invvpid ept_x_only ept_ad ept_1gb flexpriority apicv tsc_offset vtpr mtf vapic ept vpid unrestricted_guest vapic_regvid ple shadow_vmcs ept_mode_based_exec tsc_scaling usr_wait_pause",
//           "bugs\t\t: spectre_v1 spectre_v2 spec_store_bypass swapgs eibrs_pbrsb rfds bhi",
//           "bogomips\t: 5222.40",
//           "clflush size\t: 64",
//           "cache_alignment\t: 64",
//           "address sizes\t: 39 bits physical, 48 bits virtual",
//           "power management:",
//           "",
//           "processor\t: 5",
//           "vendor_id\t: GenuineIntel",
//           "cpu family\t: 6",
//           "model\t\t: 154",
//           "model name\t: 12th Gen Intel(R) Core(TM) i7-1255U",
//           "stepping\t: 4",
//           "microcode\t: 0x433",
//           "cpu MHz\t\t: 3399.803",
//           "cache size\t: 12288 KB",
//           "physical id\t: 0",
//           "siblings\t: 12",
//           "core id\t\t: 9",
//           "cpu cores\t: 10",
//           "apicid\t\t: 18",
//           "initial apicid\t: 18",
//           "fpu\t\t: yes",
//           "fpu_exception\t: yes",
//           "cpuid level\t: 32",
//           "wp\t\t: yes",
//           "flags\t\t: fpu vme de pse tsc msr pae mce cx8 apic sep mtrr pge mca cmov pat pse36 clflush dts acpi mmx fxsr sse sse2 ss ht tm pbe syscall nx pdpe1gb rdtscp lm contant_tsc art arch_perfmon pebs bts rep_good nopl xtopology nonstop_tsc cpuid aperfmperf tsc_known_freq pni pclmulqdq dtes64 monitor ds_cpl vmx smx est tm2 ssse3 sdbg fma cx16 xpr pdcm sse4_1 sse4_2 x2apic movbe popcnt tsc_deadline_timer aes xsave avx f16c rdrand lahf_lm abm 3dnowprefetch cpuid_fault epb cat_l2 cdp_l2 ssbd ibrs ibpb stibp ibrs_enhance tpr_shadow flexpriority ept vpid ept_ad fsgsbase tsc_adjust bmi1 avx2 smep bmi2 erms invpcid rdt_a rdseed adx smap clflushopt clwb intel_pt sha_ni xsaveopt xsavec xgetbv1 xsavs split_lock_detect user_shstk avx_vnni dtherm ida arat pln pts hwp hwp_notify hwp_act_window hwp_epp hwp_pkg_req hfi vnmi umip pku ospke waitpkg gfni vaes vpclmulqdq rdpid moviri movdir64b fsrm md_clear serialize arch_lbr ibt flush_l1d arch_capabilities",
//           "vmx flags\t: vnmi preemption_timer posted_intr invvpid ept_x_only ept_ad ept_1gb flexpriority apicv tsc_offset vtpr mtf vapic ept vpid unrestricted_guest vapic_regvid ple shadow_vmcs ept_mode_based_exec tsc_scaling usr_wait_pause",
//           "bugs\t\t: spectre_v1 spectre_v2 spec_store_bypass swapgs eibrs_pbrsb rfds bhi",
//           "bogomips\t: 5222.40",
//           "clflush size\t: 64",
//           "cache_alignment\t: 64",
//           "address sizes\t: 39 bits physical, 48 bits virtual",
//           "power management:",
//           "",
//           "processor\t: 6",
//           "vendor_id\t: GenuineIntel",
//           "cpu family\t: 6",
//           "model\t\t: 154",
//           "model name\t: 12th Gen Intel(R) Core(TM) i7-1255U",
//           "stepping\t: 4",
//           "microcode\t: 0x433",
//           "cpu MHz\t\t: 3395.183",
//           "cache size\t: 12288 KB",
//           "physical id\t: 0",
//           "siblings\t: 12",
//           "core id\t\t: 10",
//           "cpu cores\t: 10",
//           "apicid\t\t: 20",
//           "initial apicid\t: 20",
//           "fpu\t\t: yes",
//           "fpu_exception\t: yes",
//           "cpuid level\t: 32",
//           "wp\t\t: yes",
//           "flags\t\t: fpu vme de pse tsc msr pae mce cx8 apic sep mtrr pge mca cmov pat pse36 clflush dts acpi mmx fxsr sse sse2 ss ht tm pbe syscall nx pdpe1gb rdtscp lm contant_tsc art arch_perfmon pebs bts rep_good nopl xtopology nonstop_tsc cpuid aperfmperf tsc_known_freq pni pclmulqdq dtes64 monitor ds_cpl vmx smx est tm2 ssse3 sdbg fma cx16 xpr pdcm sse4_1 sse4_2 x2apic movbe popcnt tsc_deadline_timer aes xsave avx f16c rdrand lahf_lm abm 3dnowprefetch cpuid_fault epb cat_l2 cdp_l2 ssbd ibrs ibpb stibp ibrs_enhance tpr_shadow flexpriority ept vpid ept_ad fsgsbase tsc_adjust bmi1 avx2 smep bmi2 erms invpcid rdt_a rdseed adx smap clflushopt clwb intel_pt sha_ni xsaveopt xsavec xgetbv1 xsavs split_lock_detect user_shstk avx_vnni dtherm ida arat pln pts hwp hwp_notify hwp_act_window hwp_epp hwp_pkg_req hfi vnmi umip pku ospke waitpkg gfni vaes vpclmulqdq rdpid moviri movdir64b fsrm md_clear serialize arch_lbr ibt flush_l1d arch_capabilities",
//           "vmx flags\t: vnmi preemption_timer posted_intr invvpid ept_x_only ept_ad ept_1gb flexpriority apicv tsc_offset vtpr mtf vapic ept vpid unrestricted_guest vapic_regvid ple shadow_vmcs ept_mode_based_exec tsc_scaling usr_wait_pause",
//           "bugs\t\t: spectre_v1 spectre_v2 spec_store_bypass swapgs eibrs_pbrsb rfds bhi",
//           "bogomips\t: 5222.40",
//           "clflush size\t: 64",
//           "cache_alignment\t: 64",
//           "address sizes\t: 39 bits physical, 48 bits virtual",
//           "power management:",
//           "",
//           "processor\t: 7",
//           "vendor_id\t: GenuineIntel",
//           "cpu family\t: 6",
//           "model\t\t: 154",
//           "model name\t: 12th Gen Intel(R) Core(TM) i7-1255U",
//           "stepping\t: 4",
//           "microcode\t: 0x433",
//           "cpu MHz\t\t: 3402.276",
//           "cache size\t: 12288 KB",
//           "physical id\t: 0",
//           "siblings\t: 12",
//           "core id\t\t: 11",
//           "cpu cores\t: 10",
//           "apicid\t\t: 22",
//           "initial apicid\t: 22",
//           "fpu\t\t: yes",
//           "fpu_exception\t: yes",
//           "cpuid level\t: 32",
//           "wp\t\t: yes",
//           "flags\t\t: fpu vme de pse tsc msr pae mce cx8 apic sep mtrr pge mca cmov pat pse36 clflush dts acpi mmx fxsr sse sse2 ss ht tm pbe syscall nx pdpe1gb rdtscp lm contant_tsc art arch_perfmon pebs bts rep_good nopl xtopology nonstop_tsc cpuid aperfmperf tsc_known_freq pni pclmulqdq dtes64 monitor ds_cpl vmx smx est tm2 ssse3 sdbg fma cx16 xpr pdcm sse4_1 sse4_2 x2apic movbe popcnt tsc_deadline_timer aes xsave avx f16c rdrand lahf_lm abm 3dnowprefetch cpuid_fault epb cat_l2 cdp_l2 ssbd ibrs ibpb stibp ibrs_enhance tpr_shadow flexpriority ept vpid ept_ad fsgsbase tsc_adjust bmi1 avx2 smep bmi2 erms invpcid rdt_a rdseed adx smap clflushopt clwb intel_pt sha_ni xsaveopt xsavec xgetbv1 xsavs split_lock_detect user_shstk avx_vnni dtherm ida arat pln pts hwp hwp_notify hwp_act_window hwp_epp hwp_pkg_req hfi vnmi umip pku ospke waitpkg gfni vaes vpclmulqdq rdpid moviri movdir64b fsrm md_clear serialize arch_lbr ibt flush_l1d arch_capabilities",
//           "vmx flags\t: vnmi preemption_timer posted_intr invvpid ept_x_only ept_ad ept_1gb flexpriority apicv tsc_offset vtpr mtf vapic ept vpid unrestricted_guest vapic_regvid ple shadow_vmcs ept_mode_based_exec tsc_scaling usr_wait_pause",
//           "bugs\t\t: spectre_v1 spectre_v2 spec_store_bypass swapgs eibrs_pbrsb rfds bhi",
//           "bogomips\t: 5222.40",
//           "clflush size\t: 64",
//           "cache_alignment\t: 64",
//           "address sizes\t: 39 bits physical, 48 bits virtual",
//           "power management:",
//           "",
//           "processor\t: 8",
//           "vendor_id\t: GenuineIntel",
//           "cpu family\t: 6",
//           "model\t\t: 154",
//           "model name\t: 12th Gen Intel(R) Core(TM) i7-1255U",
//           "stepping\t: 4",
//           "microcode\t: 0x433",
//           "cpu MHz\t\t: 3400.631",
//           "cache size\t: 12288 KB",
//           "physical id\t: 0",
//           "siblings\t: 12",
//           "core id\t\t: 12",
//           "cpu cores\t: 10",
//           "apicid\t\t: 24",
//           "initial apicid\t: 24",
//           "fpu\t\t: yes",
//           "fpu_exception\t: yes",
//           "cpuid level\t: 32",
//           "wp\t\t: yes",
//           "flags\t\t: fpu vme de pse tsc msr pae mce cx8 apic sep mtrr pge mca cmov pat pse36 clflush dts acpi mmx fxsr sse sse2 ss ht tm pbe syscall nx pdpe1gb rdtscp lm contant_tsc art arch_perfmon pebs bts rep_good nopl xtopology nonstop_tsc cpuid aperfmperf tsc_known_freq pni pclmulqdq dtes64 monitor ds_cpl vmx smx est tm2 ssse3 sdbg fma cx16 xpr pdcm sse4_1 sse4_2 x2apic movbe popcnt tsc_deadline_timer aes xsave avx f16c rdrand lahf_lm abm 3dnowprefetch cpuid_fault epb cat_l2 cdp_l2 ssbd ibrs ibpb stibp ibrs_enhance tpr_shadow flexpriority ept vpid ept_ad fsgsbase tsc_adjust bmi1 avx2 smep bmi2 erms invpcid rdt_a rdseed adx smap clflushopt clwb intel_pt sha_ni xsaveopt xsavec xgetbv1 xsavs split_lock_detect user_shstk avx_vnni dtherm ida arat pln pts hwp hwp_notify hwp_act_window hwp_epp hwp_pkg_req hfi vnmi umip pku ospke waitpkg gfni vaes vpclmulqdq rdpid moviri movdir64b fsrm md_clear serialize arch_lbr ibt flush_l1d arch_capabilities",
//           "vmx flags\t: vnmi preemption_timer posted_intr invvpid ept_x_only ept_ad ept_1gb flexpriority apicv tsc_offset vtpr mtf vapic ept vpid unrestricted_guest vapic_regvid ple shadow_vmcs ept_mode_based_exec tsc_scaling usr_wait_pause",
//           "bugs\t\t: spectre_v1 spectre_v2 spec_store_bypass swapgs eibrs_pbrsb rfds bhi",
//           "bogomips\t: 5222.40",
//           "clflush size\t: 64",
//           "cache_alignment\t: 64",
//           "address sizes\t: 39 bits physical, 48 bits virtual",
//           "power management:",
//           "",
//           "processor\t: 9",
//           "vendor_id\t: GenuineIntel",
//           "cpu family\t: 6",
//           "model\t\t: 154",
//           "model name\t: 12th Gen Intel(R) Core(TM) i7-1255U",
//           "stepping\t: 4",
//           "microcode\t: 0x433",
//           "cpu MHz\t\t: 3399.603",
//           "cache size\t: 12288 KB",
//           "physical id\t: 0",
//           "siblings\t: 12",
//           "core id\t\t: 13",
//           "cpu cores\t: 10",
//           "apicid\t\t: 26",
//           "initial apicid\t: 26",
//           "fpu\t\t: yes",
//           "fpu_exception\t: yes",
//           "cpuid level\t: 32",
//           "wp\t\t: yes",
//           "flags\t\t: fpu vme de pse tsc msr pae mce cx8 apic sep mtrr pge mca cmov pat pse36 clflush dts acpi mmx fxsr sse sse2 ss ht tm pbe syscall nx pdpe1gb rdtscp lm contant_tsc art arch_perfmon pebs bts rep_good nopl xtopology nonstop_tsc cpuid aperfmperf tsc_known_freq pni pclmulqdq dtes64 monitor ds_cpl vmx smx est tm2 ssse3 sdbg fma cx16 xpr pdcm sse4_1 sse4_2 x2apic movbe popcnt tsc_deadline_timer aes xsave avx f16c rdrand lahf_lm abm 3dnowprefetch cpuid_fault epb cat_l2 cdp_l2 ssbd ibrs ibpb stibp ibrs_enhance tpr_shadow flexpriority ept vpid ept_ad fsgsbase tsc_adjust bmi1 avx2 smep bmi2 erms invpcid rdt_a rdseed adx smap clflushopt clwb intel_pt sha_ni xsaveopt xsavec xgetbv1 xsavs split_lock_detect user_shstk avx_vnni dtherm ida arat pln pts hwp hwp_notify hwp_act_window hwp_epp hwp_pkg_req hfi vnmi umip pku ospke waitpkg gfni vaes vpclmulqdq rdpid moviri movdir64b fsrm md_clear serialize arch_lbr ibt flush_l1d arch_capabilities",
//           "vmx flags\t: vnmi preemption_timer posted_intr invvpid ept_x_only ept_ad ept_1gb flexpriority apicv tsc_offset vtpr mtf vapic ept vpid unrestricted_guest vapic_regvid ple shadow_vmcs ept_mode_based_exec tsc_scaling usr_wait_pause",
//           "bugs\t\t: spectre_v1 spectre_v2 spec_store_bypass swapgs eibrs_pbrsb rfds bhi",
//           "bogomips\t: 5222.40",
//           "clflush size\t: 64",
//           "cache_alignment\t: 64",
//           "address sizes\t: 39 bits physical, 48 bits virtual",
//           "power management:",
//           "",
//           "processor\t: 10",
//           "vendor_id\t: GenuineIntel",
//           "cpu family\t: 6",
//           "model\t\t: 154",
//           "model name\t: 12th Gen Intel(R) Core(TM) i7-1255U",
//           "stepping\t: 4",
//           "microcode\t: 0x433",
//           "cpu MHz\t\t: 3398.114",
//           "cache size\t: 12288 KB",
//           "physical id\t: 0",
//           "siblings\t: 12",
//           "core id\t\t: 14",
//           "cpu cores\t: 10",
//           "apicid\t\t: 28",
//           "initial apicid\t: 28",
//           "fpu\t\t: yes",
//           "fpu_exception\t: yes",
//           "cpuid level\t: 32",
//           "wp\t\t: yes",
//           "flags\t\t: fpu vme de pse tsc msr pae mce cx8 apic sep mtrr pge mca cmov pat pse36 clflush dts acpi mmx fxsr sse sse2 ss ht tm pbe syscall nx pdpe1gb rdtscp lm contant_tsc art arch_perfmon pebs bts rep_good nopl xtopology nonstop_tsc cpuid aperfmperf tsc_known_freq pni pclmulqdq dtes64 monitor ds_cpl vmx smx est tm2 ssse3 sdbg fma cx16 xpr pdcm sse4_1 sse4_2 x2apic movbe popcnt tsc_deadline_timer aes xsave avx f16c rdrand lahf_lm abm 3dnowprefetch cpuid_fault epb cat_l2 cdp_l2 ssbd ibrs ibpb stibp ibrs_enhance tpr_shadow flexpriority ept vpid ept_ad fsgsbase tsc_adjust bmi1 avx2 smep bmi2 erms invpcid rdt_a rdseed adx smap clflushopt clwb intel_pt sha_ni xsaveopt xsavec xgetbv1 xsavs split_lock_detect user_shstk avx_vnni dtherm ida arat pln pts hwp hwp_notify hwp_act_window hwp_epp hwp_pkg_req hfi vnmi umip pku ospke waitpkg gfni vaes vpclmulqdq rdpid moviri movdir64b fsrm md_clear serialize arch_lbr ibt flush_l1d arch_capabilities",
//           "vmx flags\t: vnmi preemption_timer posted_intr invvpid ept_x_only ept_ad ept_1gb flexpriority apicv tsc_offset vtpr mtf vapic ept vpid unrestricted_guest vapic_regvid ple shadow_vmcs ept_mode_based_exec tsc_scaling usr_wait_pause",
//           "bugs\t\t: spectre_v1 spectre_v2 spec_store_bypass swapgs eibrs_pbrsb rfds bhi",
//           "bogomips\t: 5222.40",
//           "clflush size\t: 64",
//           "cache_alignment\t: 64",
//           "address sizes\t: 39 bits physical, 48 bits virtual",
//           "power management:",
//           "",
//           "processor\t: 11",
//           "vendor_id\t: GenuineIntel",
//           "cpu family\t: 6",
//           "model\t\t: 154",
//           "model name\t: 12th Gen Intel(R) Core(TM) i7-1255U",
//           "stepping\t: 4",
//           "microcode\t: 0x433",
//           "cpu MHz\t\t: 3135.933",
//           "cache size\t: 12288 KB",
//           "physical id\t: 0",
//           "siblings\t: 12",
//           "core id\t\t: 15",
//           "cpu cores\t: 10",
//           "apicid\t\t: 30",
//           "initial apicid\t: 30",
//           "fpu\t\t: yes",
//           "fpu_exception\t: yes",
//           "cpuid level\t: 32",
//           "wp\t\t: yes",
//           "flags\t\t: fpu vme de pse tsc msr pae mce cx8 apic sep mtrr pge mca cmov pat pse36 clflush dts acpi mmx fxsr sse sse2 ss ht tm pbe syscall nx pdpe1gb rdtscp lm contant_tsc art arch_perfmon pebs bts rep_good nopl xtopology nonstop_tsc cpuid aperfmperf tsc_known_freq pni pclmulqdq dtes64 monitor ds_cpl vmx smx est tm2 ssse3 sdbg fma cx16 xpr pdcm sse4_1 sse4_2 x2apic movbe popcnt tsc_deadline_timer aes xsave avx f16c rdrand lahf_lm abm 3dnowprefetch cpuid_fault epb cat_l2 cdp_l2 ssbd ibrs ibpb stibp ibrs_enhance tpr_shadow flexpriority ept vpid ept_ad fsgsbase tsc_adjust bmi1 avx2 smep bmi2 erms invpcid rdt_a rdseed adx smap clflushopt clwb intel_pt sha_ni xsaveopt xsavec xgetbv1 xsavs split_lock_detect user_shstk avx_vnni dtherm ida arat pln pts hwp hwp_notify hwp_act_window hwp_epp hwp_pkg_req hfi vnmi umip pku ospke waitpkg gfni vaes vpclmulqdq rdpid moviri movdir64b fsrm md_clear serialize arch_lbr ibt flush_l1d arch_capabilities",
//           "vmx flags\t: vnmi preemption_timer posted_intr invvpid ept_x_only ept_ad ept_1gb flexpriority apicv tsc_offset vtpr mtf vapic ept vpid unrestricted_guest vapic_regvid ple shadow_vmcs ept_mode_based_exec tsc_scaling usr_wait_pause",
//           "bugs\t\t: spectre_v1 spectre_v2 spec_store_bypass swapgs eibrs_pbrsb rfds bhi",
//           "bogomips\t: 5222.40",
//           "clflush size\t: 64",
//           "cache_alignment\t: 64",
//           "address sizes\t: 39 bits physical, 48 bits virtual",
//           "power management:"];
//         myType = "Laptop";
//         myGroups = ["laptops"];
//         myEpoch = (Number(Number(currentEpoch)).toFixed(3));
//         myIcon = "pi pi-briefcase";
//         myLastUpdate = "2024-10-10:21:50:22";
//         myUptime = (Number(Number("3279890.20")/3600)).toFixed(3);
        
//         myServer = this.setTestServer(myCPU, myEpoch, myGroups, myhostname, myIcon, myLastUpdate, myStatus, myType, myUptime);
        
//         // console.log("--------- myServer 10 ---------");
//         // console.log(myServer10);
        
//         postsArray.push(myServer);

//         this.hosts.push(myhostname);
        
//         myhostname = "ubuntu3";
//         myCPU = [
//           "processor\t: 0",
//           "vendor_id\t: GenuineIntel",
//           "cpu family\t: 6",
//           "model\t\t: 154",
//           "model name\t: 12th Gen Intel(R) Core(TM) i7-1255U",
//           "stepping\t: 4",
//           "microcode\t: 0x433",
//           "cpu MHz\t\t: 4700.000",
//           "cache size\t: 12288 KB",
//           "physical id\t: 0",
//           "siblings\t: 12",
//           "core id\t\t: 0",
//           "cpu cores\t: 10",
//           "apicid\t\t: 0",
//           "initial apicid\t: 0",
//           "fpu\t\t: yes",
//           "fpu_exception\t: yes",
//           "cpuid level\t: 32",
//           "wp\t\t: yes",
//           "flags\t\t: fpu vme de pse tsc msr pae mce cx8 apic sep mtrr pge mca cmov pat pse36 clflush dts acpi mmx fxsr sse sse2 ss ht tm pbe syscall nx pdpe1gb rdtscp lm contant_tsc art arch_perfmon pebs bts rep_good nopl xtopology nonstop_tsc cpuid aperfmperf tsc_known_freq pni pclmulqdq dtes64 monitor ds_cpl vmx smx est tm2 ssse3 sdbg fma cx16 xpr pdcm sse4_1 sse4_2 x2apic movbe popcnt tsc_deadline_timer aes xsave avx f16c rdrand lahf_lm abm 3dnowprefetch cpuid_fault epb cat_l2 cdp_l2 ssbd ibrs ibpb stibp ibrs_enhance tpr_shadow flexpriority ept vpid ept_ad fsgsbase tsc_adjust bmi1 avx2 smep bmi2 erms invpcid rdt_a rdseed adx smap clflushopt clwb intel_pt sha_ni xsaveopt xsavec xgetbv1 xsavs split_lock_detect user_shstk avx_vnni dtherm ida arat pln pts hwp hwp_notify hwp_act_window hwp_epp hwp_pkg_req hfi vnmi umip pku ospke waitpkg gfni vaes vpclmulqdq rdpid moviri movdir64b fsrm md_clear serialize arch_lbr ibt flush_l1d arch_capabilities",
//           "vmx flags\t: vnmi preemption_timer posted_intr invvpid ept_x_only ept_ad ept_1gb flexpriority apicv tsc_offset vtpr mtf vapic ept vpid unrestricted_guest vapic_regvid ple shadow_vmcs ept_mode_based_exec tsc_scaling usr_wait_pause",
//           "bugs\t\t: spectre_v1 spectre_v2 spec_store_bypass swapgs eibrs_pbrsb rfds bhi",
//           "bogomips\t: 5222.40",
//           "clflush size\t: 64",
//           "cache_alignment\t: 64",
//           "address sizes\t: 39 bits physical, 48 bits virtual",
//           "power management:",
//           "",
//           "processor\t: 1",
//           "vendor_id\t: GenuineIntel",
//           "cpu family\t: 6",
//           "model\t\t: 154",
//           "model name\t: 12th Gen Intel(R) Core(TM) i7-1255U",
//           "stepping\t: 4",
//           "microcode\t: 0x433",
//           "cpu MHz\t\t: 2547.533",
//           "cache size\t: 12288 KB",
//           "physical id\t: 0",
//           "siblings\t: 12",
//           "core id\t\t: 0",
//           "cpu cores\t: 10",
//           "apicid\t\t: 1",
//           "initial apicid\t: 1",
//           "fpu\t\t: yes",
//           "fpu_exception\t: yes",
//           "cpuid level\t: 32",
//           "wp\t\t: yes",
//           "flags\t\t: fpu vme de pse tsc msr pae mce cx8 apic sep mtrr pge mca cmov pat pse36 clflush dts acpi mmx fxsr sse sse2 ss ht tm pbe syscall nx pdpe1gb rdtscp lm contant_tsc art arch_perfmon pebs bts rep_good nopl xtopology nonstop_tsc cpuid aperfmperf tsc_known_freq pni pclmulqdq dtes64 monitor ds_cpl vmx smx est tm2 ssse3 sdbg fma cx16 xpr pdcm sse4_1 sse4_2 x2apic movbe popcnt tsc_deadline_timer aes xsave avx f16c rdrand lahf_lm abm 3dnowprefetch cpuid_fault epb cat_l2 cdp_l2 ssbd ibrs ibpb stibp ibrs_enhance tpr_shadow flexpriority ept vpid ept_ad fsgsbase tsc_adjust bmi1 avx2 smep bmi2 erms invpcid rdt_a rdseed adx smap clflushopt clwb intel_pt sha_ni xsaveopt xsavec xgetbv1 xsavs split_lock_detect user_shstk avx_vnni dtherm ida arat pln pts hwp hwp_notify hwp_act_window hwp_epp hwp_pkg_req hfi vnmi umip pku ospke waitpkg gfni vaes vpclmulqdq rdpid moviri movdir64b fsrm md_clear serialize arch_lbr ibt flush_l1d arch_capabilities",
//           "vmx flags\t: vnmi preemption_timer posted_intr invvpid ept_x_only ept_ad ept_1gb flexpriority apicv tsc_offset vtpr mtf vapic ept vpid unrestricted_guest vapic_regvid ple shadow_vmcs ept_mode_based_exec tsc_scaling usr_wait_pause",
//           "bugs\t\t: spectre_v1 spectre_v2 spec_store_bypass swapgs eibrs_pbrsb rfds bhi",
//           "bogomips\t: 5222.40",
//           "clflush size\t: 64",
//           "cache_alignment\t: 64",
//           "address sizes\t: 39 bits physical, 48 bits virtual",
//           "power management:",
//           "",
//           "processor\t: 2",
//           "vendor_id\t: GenuineIntel",
//           "cpu family\t: 6",
//           "model\t\t: 154",
//           "model name\t: 12th Gen Intel(R) Core(TM) i7-1255U",
//           "stepping\t: 4",
//           "microcode\t: 0x433",
//           "cpu MHz\t\t: 400.478",
//           "cache size\t: 12288 KB",
//           "physical id\t: 0",
//           "siblings\t: 12",
//           "core id\t\t: 4",
//           "cpu cores\t: 10",
//           "apicid\t\t: 8",
//           "initial apicid\t: 8",
//           "fpu\t\t: yes",
//           "fpu_exception\t: yes",
//           "cpuid level\t: 32",
//           "wp\t\t: yes",
//           "flags\t\t: fpu vme de pse tsc msr pae mce cx8 apic sep mtrr pge mca cmov pat pse36 clflush dts acpi mmx fxsr sse sse2 ss ht tm pbe syscall nx pdpe1gb rdtscp lm contant_tsc art arch_perfmon pebs bts rep_good nopl xtopology nonstop_tsc cpuid aperfmperf tsc_known_freq pni pclmulqdq dtes64 monitor ds_cpl vmx smx est tm2 ssse3 sdbg fma cx16 xpr pdcm sse4_1 sse4_2 x2apic movbe popcnt tsc_deadline_timer aes xsave avx f16c rdrand lahf_lm abm 3dnowprefetch cpuid_fault epb cat_l2 cdp_l2 ssbd ibrs ibpb stibp ibrs_enhance tpr_shadow flexpriority ept vpid ept_ad fsgsbase tsc_adjust bmi1 avx2 smep bmi2 erms invpcid rdt_a rdseed adx smap clflushopt clwb intel_pt sha_ni xsaveopt xsavec xgetbv1 xsavs split_lock_detect user_shstk avx_vnni dtherm ida arat pln pts hwp hwp_notify hwp_act_window hwp_epp hwp_pkg_req hfi vnmi umip pku ospke waitpkg gfni vaes vpclmulqdq rdpid moviri movdir64b fsrm md_clear serialize arch_lbr ibt flush_l1d arch_capabilities",
//           "vmx flags\t: vnmi preemption_timer posted_intr invvpid ept_x_only ept_ad ept_1gb flexpriority apicv tsc_offset vtpr mtf vapic ept vpid unrestricted_guest vapic_regvid ple shadow_vmcs ept_mode_based_exec tsc_scaling usr_wait_pause",
//           "bugs\t\t: spectre_v1 spectre_v2 spec_store_bypass swapgs eibrs_pbrsb rfds bhi",
//           "bogomips\t: 5222.40",
//           "clflush size\t: 64",
//           "cache_alignment\t: 64",
//           "address sizes\t: 39 bits physical, 48 bits virtual",
//           "power management:",
//           "",
//           "processor\t: 3",
//           "vendor_id\t: GenuineIntel",
//           "cpu family\t: 6",
//           "model\t\t: 154",
//           "model name\t: 12th Gen Intel(R) Core(TM) i7-1255U",
//           "stepping\t: 4",
//           "microcode\t: 0x433",
//           "cpu MHz\t\t: 441.627",
//           "cache size\t: 12288 KB",
//           "physical id\t: 0",
//           "siblings\t: 12",
//           "core id\t\t: 4",
//           "cpu cores\t: 10",
//           "apicid\t\t: 9",
//           "initial apicid\t: 9",
//           "fpu\t\t: yes",
//           "fpu_exception\t: yes",
//           "cpuid level\t: 32",
//           "wp\t\t: yes",
//           "flags\t\t: fpu vme de pse tsc msr pae mce cx8 apic sep mtrr pge mca cmov pat pse36 clflush dts acpi mmx fxsr sse sse2 ss ht tm pbe syscall nx pdpe1gb rdtscp lm contant_tsc art arch_perfmon pebs bts rep_good nopl xtopology nonstop_tsc cpuid aperfmperf tsc_known_freq pni pclmulqdq dtes64 monitor ds_cpl vmx smx est tm2 ssse3 sdbg fma cx16 xpr pdcm sse4_1 sse4_2 x2apic movbe popcnt tsc_deadline_timer aes xsave avx f16c rdrand lahf_lm abm 3dnowprefetch cpuid_fault epb cat_l2 cdp_l2 ssbd ibrs ibpb stibp ibrs_enhance tpr_shadow flexpriority ept vpid ept_ad fsgsbase tsc_adjust bmi1 avx2 smep bmi2 erms invpcid rdt_a rdseed adx smap clflushopt clwb intel_pt sha_ni xsaveopt xsavec xgetbv1 xsavs split_lock_detect user_shstk avx_vnni dtherm ida arat pln pts hwp hwp_notify hwp_act_window hwp_epp hwp_pkg_req hfi vnmi umip pku ospke waitpkg gfni vaes vpclmulqdq rdpid moviri movdir64b fsrm md_clear serialize arch_lbr ibt flush_l1d arch_capabilities",
//           "vmx flags\t: vnmi preemption_timer posted_intr invvpid ept_x_only ept_ad ept_1gb flexpriority apicv tsc_offset vtpr mtf vapic ept vpid unrestricted_guest vapic_regvid ple shadow_vmcs ept_mode_based_exec tsc_scaling usr_wait_pause",
//           "bugs\t\t: spectre_v1 spectre_v2 spec_store_bypass swapgs eibrs_pbrsb rfds bhi",
//           "bogomips\t: 5222.40",
//           "clflush size\t: 64",
//           "cache_alignment\t: 64",
//           "address sizes\t: 39 bits physical, 48 bits virtual",
//           "power management:",
//           "",
//           "processor\t: 4",
//           "vendor_id\t: GenuineIntel",
//           "cpu family\t: 6",
//           "model\t\t: 154",
//           "model name\t: 12th Gen Intel(R) Core(TM) i7-1255U",
//           "stepping\t: 4",
//           "microcode\t: 0x433",
//           "cpu MHz\t\t: 3384.259",
//           "cache size\t: 12288 KB",
//           "physical id\t: 0",
//           "siblings\t: 12",
//           "core id\t\t: 8",
//           "cpu cores\t: 10",
//           "apicid\t\t: 16",
//           "initial apicid\t: 16",
//           "fpu\t\t: yes",
//           "fpu_exception\t: yes",
//           "cpuid level\t: 32",
//           "wp\t\t: yes",
//           "flags\t\t: fpu vme de pse tsc msr pae mce cx8 apic sep mtrr pge mca cmov pat pse36 clflush dts acpi mmx fxsr sse sse2 ss ht tm pbe syscall nx pdpe1gb rdtscp lm contant_tsc art arch_perfmon pebs bts rep_good nopl xtopology nonstop_tsc cpuid aperfmperf tsc_known_freq pni pclmulqdq dtes64 monitor ds_cpl vmx smx est tm2 ssse3 sdbg fma cx16 xpr pdcm sse4_1 sse4_2 x2apic movbe popcnt tsc_deadline_timer aes xsave avx f16c rdrand lahf_lm abm 3dnowprefetch cpuid_fault epb cat_l2 cdp_l2 ssbd ibrs ibpb stibp ibrs_enhance tpr_shadow flexpriority ept vpid ept_ad fsgsbase tsc_adjust bmi1 avx2 smep bmi2 erms invpcid rdt_a rdseed adx smap clflushopt clwb intel_pt sha_ni xsaveopt xsavec xgetbv1 xsavs split_lock_detect user_shstk avx_vnni dtherm ida arat pln pts hwp hwp_notify hwp_act_window hwp_epp hwp_pkg_req hfi vnmi umip pku ospke waitpkg gfni vaes vpclmulqdq rdpid moviri movdir64b fsrm md_clear serialize arch_lbr ibt flush_l1d arch_capabilities",
//           "vmx flags\t: vnmi preemption_timer posted_intr invvpid ept_x_only ept_ad ept_1gb flexpriority apicv tsc_offset vtpr mtf vapic ept vpid unrestricted_guest vapic_regvid ple shadow_vmcs ept_mode_based_exec tsc_scaling usr_wait_pause",
//           "bugs\t\t: spectre_v1 spectre_v2 spec_store_bypass swapgs eibrs_pbrsb rfds bhi",
//           "bogomips\t: 5222.40",
//           "clflush size\t: 64",
//           "cache_alignment\t: 64",
//           "address sizes\t: 39 bits physical, 48 bits virtual",
//           "power management:",
//           "",
//           "processor\t: 5",
//           "vendor_id\t: GenuineIntel",
//           "cpu family\t: 6",
//           "model\t\t: 154",
//           "model name\t: 12th Gen Intel(R) Core(TM) i7-1255U",
//           "stepping\t: 4",
//           "microcode\t: 0x433",
//           "cpu MHz\t\t: 3399.803",
//           "cache size\t: 12288 KB",
//           "physical id\t: 0",
//           "siblings\t: 12",
//           "core id\t\t: 9",
//           "cpu cores\t: 10",
//           "apicid\t\t: 18",
//           "initial apicid\t: 18",
//           "fpu\t\t: yes",
//           "fpu_exception\t: yes",
//           "cpuid level\t: 32",
//           "wp\t\t: yes",
//           "flags\t\t: fpu vme de pse tsc msr pae mce cx8 apic sep mtrr pge mca cmov pat pse36 clflush dts acpi mmx fxsr sse sse2 ss ht tm pbe syscall nx pdpe1gb rdtscp lm contant_tsc art arch_perfmon pebs bts rep_good nopl xtopology nonstop_tsc cpuid aperfmperf tsc_known_freq pni pclmulqdq dtes64 monitor ds_cpl vmx smx est tm2 ssse3 sdbg fma cx16 xpr pdcm sse4_1 sse4_2 x2apic movbe popcnt tsc_deadline_timer aes xsave avx f16c rdrand lahf_lm abm 3dnowprefetch cpuid_fault epb cat_l2 cdp_l2 ssbd ibrs ibpb stibp ibrs_enhance tpr_shadow flexpriority ept vpid ept_ad fsgsbase tsc_adjust bmi1 avx2 smep bmi2 erms invpcid rdt_a rdseed adx smap clflushopt clwb intel_pt sha_ni xsaveopt xsavec xgetbv1 xsavs split_lock_detect user_shstk avx_vnni dtherm ida arat pln pts hwp hwp_notify hwp_act_window hwp_epp hwp_pkg_req hfi vnmi umip pku ospke waitpkg gfni vaes vpclmulqdq rdpid moviri movdir64b fsrm md_clear serialize arch_lbr ibt flush_l1d arch_capabilities",
//           "vmx flags\t: vnmi preemption_timer posted_intr invvpid ept_x_only ept_ad ept_1gb flexpriority apicv tsc_offset vtpr mtf vapic ept vpid unrestricted_guest vapic_regvid ple shadow_vmcs ept_mode_based_exec tsc_scaling usr_wait_pause",
//           "bugs\t\t: spectre_v1 spectre_v2 spec_store_bypass swapgs eibrs_pbrsb rfds bhi",
//           "bogomips\t: 5222.40",
//           "clflush size\t: 64",
//           "cache_alignment\t: 64",
//           "address sizes\t: 39 bits physical, 48 bits virtual",
//           "power management:",
//           "",
//           "processor\t: 6",
//           "vendor_id\t: GenuineIntel",
//           "cpu family\t: 6",
//           "model\t\t: 154",
//           "model name\t: 12th Gen Intel(R) Core(TM) i7-1255U",
//           "stepping\t: 4",
//           "microcode\t: 0x433",
//           "cpu MHz\t\t: 3395.183",
//           "cache size\t: 12288 KB",
//           "physical id\t: 0",
//           "siblings\t: 12",
//           "core id\t\t: 10",
//           "cpu cores\t: 10",
//           "apicid\t\t: 20",
//           "initial apicid\t: 20",
//           "fpu\t\t: yes",
//           "fpu_exception\t: yes",
//           "cpuid level\t: 32",
//           "wp\t\t: yes",
//           "flags\t\t: fpu vme de pse tsc msr pae mce cx8 apic sep mtrr pge mca cmov pat pse36 clflush dts acpi mmx fxsr sse sse2 ss ht tm pbe syscall nx pdpe1gb rdtscp lm contant_tsc art arch_perfmon pebs bts rep_good nopl xtopology nonstop_tsc cpuid aperfmperf tsc_known_freq pni pclmulqdq dtes64 monitor ds_cpl vmx smx est tm2 ssse3 sdbg fma cx16 xpr pdcm sse4_1 sse4_2 x2apic movbe popcnt tsc_deadline_timer aes xsave avx f16c rdrand lahf_lm abm 3dnowprefetch cpuid_fault epb cat_l2 cdp_l2 ssbd ibrs ibpb stibp ibrs_enhance tpr_shadow flexpriority ept vpid ept_ad fsgsbase tsc_adjust bmi1 avx2 smep bmi2 erms invpcid rdt_a rdseed adx smap clflushopt clwb intel_pt sha_ni xsaveopt xsavec xgetbv1 xsavs split_lock_detect user_shstk avx_vnni dtherm ida arat pln pts hwp hwp_notify hwp_act_window hwp_epp hwp_pkg_req hfi vnmi umip pku ospke waitpkg gfni vaes vpclmulqdq rdpid moviri movdir64b fsrm md_clear serialize arch_lbr ibt flush_l1d arch_capabilities",
//           "vmx flags\t: vnmi preemption_timer posted_intr invvpid ept_x_only ept_ad ept_1gb flexpriority apicv tsc_offset vtpr mtf vapic ept vpid unrestricted_guest vapic_regvid ple shadow_vmcs ept_mode_based_exec tsc_scaling usr_wait_pause",
//           "bugs\t\t: spectre_v1 spectre_v2 spec_store_bypass swapgs eibrs_pbrsb rfds bhi",
//           "bogomips\t: 5222.40",
//           "clflush size\t: 64",
//           "cache_alignment\t: 64",
//           "address sizes\t: 39 bits physical, 48 bits virtual",
//           "power management:",
//           "",
//           "processor\t: 7",
//           "vendor_id\t: GenuineIntel",
//           "cpu family\t: 6",
//           "model\t\t: 154",
//           "model name\t: 12th Gen Intel(R) Core(TM) i7-1255U",
//           "stepping\t: 4",
//           "microcode\t: 0x433",
//           "cpu MHz\t\t: 3402.276",
//           "cache size\t: 12288 KB",
//           "physical id\t: 0",
//           "siblings\t: 12",
//           "core id\t\t: 11",
//           "cpu cores\t: 10",
//           "apicid\t\t: 22",
//           "initial apicid\t: 22",
//           "fpu\t\t: yes",
//           "fpu_exception\t: yes",
//           "cpuid level\t: 32",
//           "wp\t\t: yes",
//           "flags\t\t: fpu vme de pse tsc msr pae mce cx8 apic sep mtrr pge mca cmov pat pse36 clflush dts acpi mmx fxsr sse sse2 ss ht tm pbe syscall nx pdpe1gb rdtscp lm contant_tsc art arch_perfmon pebs bts rep_good nopl xtopology nonstop_tsc cpuid aperfmperf tsc_known_freq pni pclmulqdq dtes64 monitor ds_cpl vmx smx est tm2 ssse3 sdbg fma cx16 xpr pdcm sse4_1 sse4_2 x2apic movbe popcnt tsc_deadline_timer aes xsave avx f16c rdrand lahf_lm abm 3dnowprefetch cpuid_fault epb cat_l2 cdp_l2 ssbd ibrs ibpb stibp ibrs_enhance tpr_shadow flexpriority ept vpid ept_ad fsgsbase tsc_adjust bmi1 avx2 smep bmi2 erms invpcid rdt_a rdseed adx smap clflushopt clwb intel_pt sha_ni xsaveopt xsavec xgetbv1 xsavs split_lock_detect user_shstk avx_vnni dtherm ida arat pln pts hwp hwp_notify hwp_act_window hwp_epp hwp_pkg_req hfi vnmi umip pku ospke waitpkg gfni vaes vpclmulqdq rdpid moviri movdir64b fsrm md_clear serialize arch_lbr ibt flush_l1d arch_capabilities",
//           "vmx flags\t: vnmi preemption_timer posted_intr invvpid ept_x_only ept_ad ept_1gb flexpriority apicv tsc_offset vtpr mtf vapic ept vpid unrestricted_guest vapic_regvid ple shadow_vmcs ept_mode_based_exec tsc_scaling usr_wait_pause",
//           "bugs\t\t: spectre_v1 spectre_v2 spec_store_bypass swapgs eibrs_pbrsb rfds bhi",
//           "bogomips\t: 5222.40",
//           "clflush size\t: 64",
//           "cache_alignment\t: 64",
//           "address sizes\t: 39 bits physical, 48 bits virtual",
//           "power management:",
//           "",
//           "processor\t: 8",
//           "vendor_id\t: GenuineIntel",
//           "cpu family\t: 6",
//           "model\t\t: 154",
//           "model name\t: 12th Gen Intel(R) Core(TM) i7-1255U",
//           "stepping\t: 4",
//           "microcode\t: 0x433",
//           "cpu MHz\t\t: 3400.631",
//           "cache size\t: 12288 KB",
//           "physical id\t: 0",
//           "siblings\t: 12",
//           "core id\t\t: 12",
//           "cpu cores\t: 10",
//           "apicid\t\t: 24",
//           "initial apicid\t: 24",
//           "fpu\t\t: yes",
//           "fpu_exception\t: yes",
//           "cpuid level\t: 32",
//           "wp\t\t: yes",
//           "flags\t\t: fpu vme de pse tsc msr pae mce cx8 apic sep mtrr pge mca cmov pat pse36 clflush dts acpi mmx fxsr sse sse2 ss ht tm pbe syscall nx pdpe1gb rdtscp lm contant_tsc art arch_perfmon pebs bts rep_good nopl xtopology nonstop_tsc cpuid aperfmperf tsc_known_freq pni pclmulqdq dtes64 monitor ds_cpl vmx smx est tm2 ssse3 sdbg fma cx16 xpr pdcm sse4_1 sse4_2 x2apic movbe popcnt tsc_deadline_timer aes xsave avx f16c rdrand lahf_lm abm 3dnowprefetch cpuid_fault epb cat_l2 cdp_l2 ssbd ibrs ibpb stibp ibrs_enhance tpr_shadow flexpriority ept vpid ept_ad fsgsbase tsc_adjust bmi1 avx2 smep bmi2 erms invpcid rdt_a rdseed adx smap clflushopt clwb intel_pt sha_ni xsaveopt xsavec xgetbv1 xsavs split_lock_detect user_shstk avx_vnni dtherm ida arat pln pts hwp hwp_notify hwp_act_window hwp_epp hwp_pkg_req hfi vnmi umip pku ospke waitpkg gfni vaes vpclmulqdq rdpid moviri movdir64b fsrm md_clear serialize arch_lbr ibt flush_l1d arch_capabilities",
//           "vmx flags\t: vnmi preemption_timer posted_intr invvpid ept_x_only ept_ad ept_1gb flexpriority apicv tsc_offset vtpr mtf vapic ept vpid unrestricted_guest vapic_regvid ple shadow_vmcs ept_mode_based_exec tsc_scaling usr_wait_pause",
//           "bugs\t\t: spectre_v1 spectre_v2 spec_store_bypass swapgs eibrs_pbrsb rfds bhi",
//           "bogomips\t: 5222.40",
//           "clflush size\t: 64",
//           "cache_alignment\t: 64",
//           "address sizes\t: 39 bits physical, 48 bits virtual",
//           "power management:",
//           "",
//           "processor\t: 9",
//           "vendor_id\t: GenuineIntel",
//           "cpu family\t: 6",
//           "model\t\t: 154",
//           "model name\t: 12th Gen Intel(R) Core(TM) i7-1255U",
//           "stepping\t: 4",
//           "microcode\t: 0x433",
//           "cpu MHz\t\t: 3399.603",
//           "cache size\t: 12288 KB",
//           "physical id\t: 0",
//           "siblings\t: 12",
//           "core id\t\t: 13",
//           "cpu cores\t: 10",
//           "apicid\t\t: 26",
//           "initial apicid\t: 26",
//           "fpu\t\t: yes",
//           "fpu_exception\t: yes",
//           "cpuid level\t: 32",
//           "wp\t\t: yes",
//           "flags\t\t: fpu vme de pse tsc msr pae mce cx8 apic sep mtrr pge mca cmov pat pse36 clflush dts acpi mmx fxsr sse sse2 ss ht tm pbe syscall nx pdpe1gb rdtscp lm contant_tsc art arch_perfmon pebs bts rep_good nopl xtopology nonstop_tsc cpuid aperfmperf tsc_known_freq pni pclmulqdq dtes64 monitor ds_cpl vmx smx est tm2 ssse3 sdbg fma cx16 xpr pdcm sse4_1 sse4_2 x2apic movbe popcnt tsc_deadline_timer aes xsave avx f16c rdrand lahf_lm abm 3dnowprefetch cpuid_fault epb cat_l2 cdp_l2 ssbd ibrs ibpb stibp ibrs_enhance tpr_shadow flexpriority ept vpid ept_ad fsgsbase tsc_adjust bmi1 avx2 smep bmi2 erms invpcid rdt_a rdseed adx smap clflushopt clwb intel_pt sha_ni xsaveopt xsavec xgetbv1 xsavs split_lock_detect user_shstk avx_vnni dtherm ida arat pln pts hwp hwp_notify hwp_act_window hwp_epp hwp_pkg_req hfi vnmi umip pku ospke waitpkg gfni vaes vpclmulqdq rdpid moviri movdir64b fsrm md_clear serialize arch_lbr ibt flush_l1d arch_capabilities",
//           "vmx flags\t: vnmi preemption_timer posted_intr invvpid ept_x_only ept_ad ept_1gb flexpriority apicv tsc_offset vtpr mtf vapic ept vpid unrestricted_guest vapic_regvid ple shadow_vmcs ept_mode_based_exec tsc_scaling usr_wait_pause",
//           "bugs\t\t: spectre_v1 spectre_v2 spec_store_bypass swapgs eibrs_pbrsb rfds bhi",
//           "bogomips\t: 5222.40",
//           "clflush size\t: 64",
//           "cache_alignment\t: 64",
//           "address sizes\t: 39 bits physical, 48 bits virtual",
//           "power management:",
//           "",
//           "processor\t: 10",
//           "vendor_id\t: GenuineIntel",
//           "cpu family\t: 6",
//           "model\t\t: 154",
//           "model name\t: 12th Gen Intel(R) Core(TM) i7-1255U",
//           "stepping\t: 4",
//           "microcode\t: 0x433",
//           "cpu MHz\t\t: 3398.114",
//           "cache size\t: 12288 KB",
//           "physical id\t: 0",
//           "siblings\t: 12",
//           "core id\t\t: 14",
//           "cpu cores\t: 10",
//           "apicid\t\t: 28",
//           "initial apicid\t: 28",
//           "fpu\t\t: yes",
//           "fpu_exception\t: yes",
//           "cpuid level\t: 32",
//           "wp\t\t: yes",
//           "flags\t\t: fpu vme de pse tsc msr pae mce cx8 apic sep mtrr pge mca cmov pat pse36 clflush dts acpi mmx fxsr sse sse2 ss ht tm pbe syscall nx pdpe1gb rdtscp lm contant_tsc art arch_perfmon pebs bts rep_good nopl xtopology nonstop_tsc cpuid aperfmperf tsc_known_freq pni pclmulqdq dtes64 monitor ds_cpl vmx smx est tm2 ssse3 sdbg fma cx16 xpr pdcm sse4_1 sse4_2 x2apic movbe popcnt tsc_deadline_timer aes xsave avx f16c rdrand lahf_lm abm 3dnowprefetch cpuid_fault epb cat_l2 cdp_l2 ssbd ibrs ibpb stibp ibrs_enhance tpr_shadow flexpriority ept vpid ept_ad fsgsbase tsc_adjust bmi1 avx2 smep bmi2 erms invpcid rdt_a rdseed adx smap clflushopt clwb intel_pt sha_ni xsaveopt xsavec xgetbv1 xsavs split_lock_detect user_shstk avx_vnni dtherm ida arat pln pts hwp hwp_notify hwp_act_window hwp_epp hwp_pkg_req hfi vnmi umip pku ospke waitpkg gfni vaes vpclmulqdq rdpid moviri movdir64b fsrm md_clear serialize arch_lbr ibt flush_l1d arch_capabilities",
//           "vmx flags\t: vnmi preemption_timer posted_intr invvpid ept_x_only ept_ad ept_1gb flexpriority apicv tsc_offset vtpr mtf vapic ept vpid unrestricted_guest vapic_regvid ple shadow_vmcs ept_mode_based_exec tsc_scaling usr_wait_pause",
//           "bugs\t\t: spectre_v1 spectre_v2 spec_store_bypass swapgs eibrs_pbrsb rfds bhi",
//           "bogomips\t: 5222.40",
//           "clflush size\t: 64",
//           "cache_alignment\t: 64",
//           "address sizes\t: 39 bits physical, 48 bits virtual",
//           "power management:",
//           "",
//           "processor\t: 11",
//           "vendor_id\t: GenuineIntel",
//           "cpu family\t: 6",
//           "model\t\t: 154",
//           "model name\t: 12th Gen Intel(R) Core(TM) i7-1255U",
//           "stepping\t: 4",
//           "microcode\t: 0x433",
//           "cpu MHz\t\t: 3135.933",
//           "cache size\t: 12288 KB",
//           "physical id\t: 0",
//           "siblings\t: 12",
//           "core id\t\t: 15",
//           "cpu cores\t: 10",
//           "apicid\t\t: 30",
//           "initial apicid\t: 30",
//           "fpu\t\t: yes",
//           "fpu_exception\t: yes",
//           "cpuid level\t: 32",
//           "wp\t\t: yes",
//           "flags\t\t: fpu vme de pse tsc msr pae mce cx8 apic sep mtrr pge mca cmov pat pse36 clflush dts acpi mmx fxsr sse sse2 ss ht tm pbe syscall nx pdpe1gb rdtscp lm contant_tsc art arch_perfmon pebs bts rep_good nopl xtopology nonstop_tsc cpuid aperfmperf tsc_known_freq pni pclmulqdq dtes64 monitor ds_cpl vmx smx est tm2 ssse3 sdbg fma cx16 xpr pdcm sse4_1 sse4_2 x2apic movbe popcnt tsc_deadline_timer aes xsave avx f16c rdrand lahf_lm abm 3dnowprefetch cpuid_fault epb cat_l2 cdp_l2 ssbd ibrs ibpb stibp ibrs_enhance tpr_shadow flexpriority ept vpid ept_ad fsgsbase tsc_adjust bmi1 avx2 smep bmi2 erms invpcid rdt_a rdseed adx smap clflushopt clwb intel_pt sha_ni xsaveopt xsavec xgetbv1 xsavs split_lock_detect user_shstk avx_vnni dtherm ida arat pln pts hwp hwp_notify hwp_act_window hwp_epp hwp_pkg_req hfi vnmi umip pku ospke waitpkg gfni vaes vpclmulqdq rdpid moviri movdir64b fsrm md_clear serialize arch_lbr ibt flush_l1d arch_capabilities",
//           "vmx flags\t: vnmi preemption_timer posted_intr invvpid ept_x_only ept_ad ept_1gb flexpriority apicv tsc_offset vtpr mtf vapic ept vpid unrestricted_guest vapic_regvid ple shadow_vmcs ept_mode_based_exec tsc_scaling usr_wait_pause",
//           "bugs\t\t: spectre_v1 spectre_v2 spec_store_bypass swapgs eibrs_pbrsb rfds bhi",
//           "bogomips\t: 5222.40",
//           "clflush size\t: 64",
//           "cache_alignment\t: 64",
//           "address sizes\t: 39 bits physical, 48 bits virtual",
//           "power management:"];
//         myType = "Laptop";
//         myGroups = ["laptops"];
//         myEpoch = (Number(Number(currentEpoch)).toFixed(3));
//         myIcon = "pi pi-briefcase";
//         myLastUpdate = "2024-10-10:21:50:22";
//         myUptime = (Number(Number("3279890.20")/3600)).toFixed(3);
        
//         myServer = this.setTestServer(myCPU, myEpoch, myGroups, myhostname, myIcon, myLastUpdate, myStatus, myType, myUptime);
        
//         // console.log("--------- myServer 11 ---------");
//         // console.log(myServer11);
        
//         postsArray.push(myServer);

//         this.hosts.push(myhostname);


//         this.hosts = this.hosts.sort();

//         this.checkStatus();

//         this.status = postsArray;

//         this.groups = this.translateToGroups(this.status);

//          for (let group = 0; group < this.groups.length; group++) {
//             this.rollupGroup(this.groups[group]);
//           }

//           //Need to roll up the displayed group
//           this.rollupGroup(this.group);

//         //this.getHostStatus();

//         this.group = {};
//         this.groupHost = {};


//         console.log("===================================== info start =====================================");
//         console.log("------- hosts ------");
//         console.log(this.hosts);
        
//         // console.log("------- servers ------");
//         // console.log(this.servers);
        
//         // console.log("------- servers host 0------");
//         // console.log(this.servers[this.hosts[0]]);

//         console.log("------- groups ------");
//         console.log(this.groups);
        
//         // console.log("------- loadedServers ------");
//         // console.log(this.loadedServers);
        
//         console.log("------- status ------");
//         console.log(this.status);

//         console.log("===================================== info end =====================================");

//     }

}