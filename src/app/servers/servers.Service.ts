import { Component, OnInit, OnDestroy } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { Server } from "./server.module";

import { Injectable } from '@angular/core';
import { interval, Subscription, take } from 'rxjs';  // throws something every second or whatyou define

@Injectable()
export class ServerService {

    //TODO Get from somewhere else - more dynamic
    private baseHostIP:   string = "192.168.1.102";
    private basePort:     string = "8085";
    private baseUrl:      string = "http://"+ this.baseHostIP +":" + this.basePort +"/" ;
    
    private uptimeUrl:    string = this.baseUrl + "uptime";
    private upMemUrl:     string = this.baseUrl + "meminfo";
    private upDiskUrl:    string = this.baseUrl + "diskinfo";
    private upCPUUrl:     string = this.baseUrl + "cpuinfo";
    private upProcessUrl: string = this.baseUrl + "processinfo";

    private servers:Server[];
    private loadedServers:Server[];
    private hosts: string[]; 
    public lastStatusUpdate: string = "No Update";

    private numbers = interval(60000); //one minute
    //private takeFourNumbers = this.numbers.pipe(take(4)); // only emits four numbers, if you leave off it will keep going
    private takeFourNumbers = this.numbers.pipe();
    private nextStatusTime = this.numbers.pipe();
    
    
    constructor(
        private http: HttpClient
    ) {
        console.log("ServerService constructor");
        this.hosts = [];
        this.servers = [];
        this.loadedServers = [];
        this.lastStatusUpdate = "No Update";
    }

    ngOnInit() {
    }

    // startNextTimer() {
    //     this.nextStatusTime.subscribe(x => {
        
    //     });
    // }

    startStatusTimer() {
        
        console.log("--------- ServerService startStatusTimer ---------");
        this.takeFourNumbers.subscribe(x => {
            console.log("");
            console.log("");
            console.log('********** Timer Calling ServerService Get Status: ********** ', x);
            this.getStatus();
            this.setLastStatusUpdate();
            // const myDate = new Date();
            // this.lastStatusUpdate = "" + myDate.toDateString() + ":" + myDate.toTimeString();
            // console.log(this.lastStatusUpdate);
        });

    }

    getStatus() {
      // Send Http request
      console.log("--------- ServerService getStatus ---------");
      //this.hosts = [];
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
            return postsArray;
          })
        )
        .subscribe(serverData => {
          // ...
          console.log("--------- ServerService loadServers serverData ---------");
          //console.log(serverData);
  
          for (const host in serverData) {
                //console.log(this.hosts);
                //console.log("serverData[host].hostname ["+ serverData[host].hostname + "]");
                
                //TODO remove this
                if (serverData[host].hostname === 'creede') {
                  serverData[host].suite = "Server"
                } else {
                  serverData[host].suite = "Laptop"
                }

            if ( this.hosts.includes(serverData[host].hostname) ) {
                //console.log("ServerService loadServers serverData - update server");
                this.loadedServers[serverData[host].hostname].hostName = serverData[host].hostname;
                this.loadedServers[serverData[host].hostname].epoch = serverData[host].epoch;
                this.loadedServers[serverData[host].hostname].lastUpdate = serverData[host].lastupdate;
                this.loadedServers[serverData[host].hostname].uptime = (Number(Number(serverData[host].uptime)/3600)).toFixed(3);
            
            } else {
                //console.log("ServerService loadServers serverData - new server " + (Number(Number(serverData[host].uptime)/3600)).toFixed(3));
                const myServer = new Server(serverData[host].hostname, serverData[host].suite, "pi pi-server", serverData[host].epoch, serverData[host].lastupdate, (Number(Number(serverData[host].uptime)/3600)).toFixed(3), "red");
                this.loadedServers[serverData[host].hostname] = myServer;
                this.hosts.push(serverData[host].hostname);
            }
            //console.log("--------- ServerService loadServers addServer  ---------");
            //console.log(this.loadedServers[serverData[host].hostname]);
            this.addServer(this.loadedServers[serverData[host].hostname]);
  
          }
          //this.logServers()
          this.checkStatus();
        });
    }

    addServer(server: Server) {
        console.log("--------- ServerService addServer ---------");
        //console.log(server);
        this.servers[server.hostName] = server;
    }

    getServers() {
        console.log("--------- ServerService getServers ---------");
        return this.servers;
    }

    getServer(host: string) {
        console.log("--------- ServerService getServer " + host + "---------");
        return this.servers[host];
    }

    getHosts() {
        console.log("--------- ServerService getHostNames ---------");
        var myHosts:string[];
        myHosts=[];
        for (const host in this.servers) {
            myHosts[myHosts.length] = this.servers[host].hostName;
        }
        return myHosts.sort();
    }

    setLastStatusUpdate() {
        console.log("--------- ServerService setLastStatusUpdate " + this.lastStatusUpdate + " ---------");
        const myDate = new Date();
        this.lastStatusUpdate = "" + myDate.toDateString() + ":" + myDate.toTimeString();
        console.log(this.getLastStatusUpdate()); // this is just to check it.
    }

    getLastStatusUpdate() {
        console.log("--------- ServerService getLastStatusUpdate " + this.lastStatusUpdate + " ---------");
        return this.lastStatusUpdate;
    }

    setServersStatus(status: string) {
        console.log("--------- ServerService setServersStatus ---------");
        for (const host in this.servers) {
            this.servers[host].status = status;
        }
    }

    setServerStatus(host: string, status: string) {
        console.log("--------- ServerService setServerStatus ---------");
        this.servers[host].status = status;
        //this.servers[host].uptime = "0.000";
    }

    setServerUptime(host: string, uptime: string) {
        console.log("--------- ServerService setServerUptime " + uptime + " ---------");
        this.servers[host].uptime = uptime;
    }

    checkStatus() {
      console.log("--------- ServerService checkStatus ---------");
      const myDate = new Date();
  
      const currentEpoch = (myDate.valueOf() / 1000);

      //console.log("--------- ServerService checkStatus time " + currentEpoch + " ---------");
      //this.logServers();
  
      for (const host in this.getServers()) {
        if (currentEpoch - Number(this.servers[host].epoch) > 300) { 
          this.setServerStatus(host, "red");
          this.setServerUptime(host, "0.000");
        } else {
          this.setServerStatus(host, "green");
        }
      }
      //this.logServers();
    }

    clearServers() {
        console.log("--------- ServerService clearServers ---------");
        
        this.http
        .delete(this.uptimeUrl)
        .pipe(
          map(responseData => {
            const postsArray = [];
            return postsArray;
          })
        )
        .subscribe(deleteStatus => {
          
          console.log(deleteStatus);
        });
        this.hosts = [];
        this.servers = [];
    }
  
    getMemInfo(host:string) {
      // Send Http request
      console.log("getMemInfo- Server Component [" + host + "]");
      
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
            //console.log("--------------------- getMemInfo serverData ---------------------");
            Object.values(serverData).forEach(function (value) {
                var newValue= value.split(":");
                newValue[0] = newValue[0].toString().trim();
                newValue[1] = newValue[1].toString().trim();
                postsArray.push(newValue);
            });
            
          });
        }
        
        return postsArray;
    }
    
    getDiskInfo(host:string) {
      // Send Http request
      console.log("getDiskInfo- Server Component [" + host + "]");
      
      const postsArray = [];

      if ( (typeof host !== 'undefined') && (host.length > 1)) {
        this.http
          .get(this.upDiskUrl+"/"+host)
          .pipe(
            map(responseData => {
                //Do nothing - pass through
                return responseData;
            })
          )
          .subscribe(serverData => {

            //console.log("--------------------- getDiskInfo serverData ---------------------");

            var header = true;
            Object.values(serverData).forEach(function (value: string) {
                var rowData = [];
                var newValue= value.split(" ");

                if (header) {
                    header = false;
                    // Object.values(newValue).forEach(function (value: string) {
                    //     if ( (value.length > 0) && (value !== "on")) {
                    //         rowData[rowData.length] = value;
                    //     }
                    // });
                } else {
                    Object.values(newValue).forEach(function (value: string) {
                        if ( value.length > 0 ) {
                            rowData[rowData.length] = value;
                        }
                    });
                    postsArray.push(rowData);
                }
            });
          });
        }
        return postsArray;
    }
    
    getCPUInfo(host:string) {
      // Send Http request
      console.log("getCPUInfo- Server Component [" + host + "]");
      
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
            
            //console.log("--------------------- getCPUInfo serverData ---------------------");
            
            Object.values(serverData).forEach(function (value: string) {

                if (value.length > 0) {
                    
                    var newValue= value.split(":");

                    if (header) {
                        headerData[headerData.length] = newValue[0].toString().trim();
                    }

                    rowData[rowData.length] = newValue[1].toString().trim();
                } else {
                    if (header) {
                        //postsArray.push(headerData);
                    }
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
                    console.log(rowData);
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
      console.log("getProcessInfo- Server Component [" + host + "]");
      
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
            //console.log("--------------------- getProcessInfo serverData ---------------------");
            
            Object.values(serverData).forEach(function (value: string) {
              postsArray.push(value);
            });
          });
        }
        return postsArray;
    }

    logServers() {
        console.log(this.servers);
    }

    logHosts() {
        console.log(this.getHosts());
    }
}