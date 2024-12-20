import { Injectable, Component, OnInit, OnDestroy } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { Server } from '../modules/server.module';
import { DatePipe } from '@angular/common';

import { interval, Subscription, take } from 'rxjs'; // throws something every second or what you define

@Injectable({
  providedIn: 'root',
})
export class ServerService {
  datePipe = new DatePipe('en-US');

  //TODO Get from somewhere else - more dynamic  This needs to use properties
  private baseHostIP: string = '192.168.1.100'; //"my.serverstatus.com/"; //"nginx.ingress.192.168.1.100.nip.io"; //"serverstatus-service.default"; //"mynginx.192.168.1.100.nip.io"; //"192.168.1.100";
  private basePort: string = '30850'; //"8085"; //"30850";
  private baseUrl: string =
    'http://' + this.baseHostIP + ':' + this.basePort + '/';

  private uptimeUrl: string = this.baseUrl + 'uptime';
  private upMemUrl: string = this.baseUrl + 'meminfo';
  private upDiskUrl: string = this.baseUrl + 'diskinfo';
  private upCPUUrl: string = this.baseUrl + 'cpuinfo';
  private upProcessUrl: string = this.baseUrl + 'processinfo';

  private upOSUrl: string = this.baseUrl + 'os';
  private upGroupUrl: string = this.baseUrl + 'groups';

  public hosts: string[] = [];
  public groups: any[] = [];
  public group: any = {};
  public groupHost: any = {};
  private lastGroup: string = '';
  private lastHost: string = '';

  public status: any[] = [];
  public lastStatusUpdate: string = 'No Update';

  // private numbers = interval(60000); //one minute
  // private takeFourNumbers = this.numbers.pipe();

  public httpError = null;

  constructor(private http: HttpClient) {
    this.hosts = [];
    this.groups = [];
    this.status = [];
    this.lastStatusUpdate = 'No Update';
  }

  ngOnInit() {}

  translateToGroups(data: any[]): any {
    // console.log("====================================  start translateToGroups ====================================");
    let myTempGroups: any = [];
    let myGroups: any = [];

    // console.log(" --- Data to translate ---");
    // console.log(data);

    for (let i = 0; i < data.length; i++) {
      for (let group = 0; group < data[i].groups.length; group++) {
        let myGroup: any = { group: '', status: '', hosts: [] };
        // console.log( data[i] );

        data[i].disks = [];
        data[i].disks.push({
          name: 'OPS',
          avail: data[i].opsavail,
          used: data[i].opsused,
          total: data[i].opstotal,
          percent: data[i].opspercent,
        });
        data[i].disks.push({
          name: 'LOG',
          avail: data[i].logavail,
          used: data[i].logused,
          total: data[i].logtotal,
          percent: data[i].logpercent,
        });
        data[i].disks.push({
          name: 'TMP',
          avail: data[i].tmpavail,
          used: data[i].tmpused,
          total: data[i].tmptotal,
          percent: data[i].tmppercent,
        });

        myGroup.group = data[i].groups[group];
        myGroup.status = '';

        myGroup.hosts.push(data[i]);
        myTempGroups.push(myGroup);
      }
    }

    // console.log("--- myTempGroups ---");
    // console.log(myTempGroups);

    for (let i = 0; i < myTempGroups.length; i++) {
      let index = -1;
      if (myGroups.length == 0) {
        myTempGroups[i].status = myTempGroups[i].hosts[0].status;
        myGroups.push(myTempGroups[i]);
      } else {
        for (let group = 0; group < myGroups.length; group++) {
          if (myTempGroups[i].group == myGroups[group].group) {
            index = group;
            break;
          }
        }

        if (index == -1) {
          myTempGroups[i].status = myTempGroups[i].hosts[0].status;
          myGroups.push(myTempGroups[i]);
        } else {
          if (myTempGroups[i].hosts[0].status == 'red') {
            myTempGroups[i].status = myTempGroups[i].hosts[0].status;
          } else if (myGroups.status == 'green') {
            myTempGroups[i].status = myTempGroups[i].hosts[0].status;
          }
          myGroups[index].hosts.push(myTempGroups[i].hosts[0]);
        }
      }
    }

    this.groups = myGroups;

    for (let group = 0; group < this.groups.length; group++) {
      this.sortGroupHosts(this.groups[group]);
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
  }

  getServerStatus(host: string) {
    // console.log("--------- ServerService getServerStatus [" + host + "] ---------");
    for (let host = 0; host < this.status.length; host++) {
      if (this.status[host].hostname === host) {
        return this.status[host].status;
      }
    }
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

  getHostUptime(host: any) {
    // console.log(host);
    // console.log("uptime " + (Number(host.uptime)));
    if (Number(host.uptime) > 604800) {
      // console.log("--- Wks ---");
      host.uptimeLabel = 'Wks';
      host.uptime = (Number(host.uptime) / 604800).toFixed(2);
    } else if (Number(host.uptime) > 86400) {
      // console.log("--- Days ---");
      host.uptimeLabel = 'Days';
      host.uptime = (Number(host.uptime) / 86400).toFixed(2);
    } else if (Number(host.uptime) > 3600) {
      // console.log("--- Hrs ---");
      host.uptimeLabel = 'Hrs';
      host.uptime = (Number(host.uptime) / 3600).toFixed(2);
    } else if (Number(host.uptime) > 60) {
      // console.log("--- Mins ---");
      host.uptimeLabel = 'Mins';
      host.uptime = (Number(host.uptime) / 60).toFixed(2);
    } else {
      console.log('--- Secs ---');
      host.uptimeLabel = 'Secs';
    }
    // console.log("uptime " + host.uptime + " "+ host.uptimeLabel);
    // console.log(host);
  }

  checkStatus() {
    // console.log("--------- ServerService checkStatus ---------");
    const myDate = new Date();

    const currentEpoch = myDate.valueOf() / 1000;

    for (const host in this.status) {
      // console.log("host " + host);
      // console.log(this.status[host].hostname);
      // console.log("this.status[host].hostname ["+ this.status[host].hostname + "] epoch [" + this.status[host].epoch + "] diff " + (currentEpoch - Number(this.status[host].epoch)) );
      if (currentEpoch - Number(this.status[host].epoch) > 300) {
        this.status[host].status = 'red';
        this.status[host].uptime = '0.000';
        this.getHostUptime(this.status[host]);
      } else {
        this.status[host].status = 'green';
      }
      this.rollupGroup(this.group);
    }

    // console.log("--- this.status ---");
    // console.log(this.status);

    this.setGroupStatus();
  }

  rollupGroups(groups: any, group: string, status: string) {
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

  rollupGroup(group: any) {
    // console.log("--- rollupGroup ---");

    group.status = '';
    let oneHostUp = false;
    let oneHostDown = false;

    if (!group.hosts) {
      return;
    }

    for (let host = 0; host < group.hosts.length; host++) {
      // console.log(group.hosts[host].hostname + " is " + group.hosts[host].status);
      if (group.hosts[host].status === 'red') {
        group.status = 'red';
        oneHostDown = true;
      } else if (group.hosts[host].status === 'green') {
        oneHostUp = true;
      }
    }

    // console.log("oneHostDown " + oneHostDown + " oneHostUp " + oneHostUp);
    if (oneHostDown) {
      if (oneHostUp) {
        // console.log("setting group.status yellow");
        group.status = 'yellow';
        this.rollupGroups(this.groups, group.group, group.status);
      } else {
        // console.log("setting group.status red");
        group.status = 'red';
        this.rollupGroups(this.groups, group.group, group.status);
      }
    } else if (oneHostUp) {
      // console.log("setting group.status green");
      group.status = 'green';
      this.rollupGroups(this.groups, group.group, group.status);
    }
    // console.log(group);
  }

  sortGroupHosts(group: any) {
    // console.log("--- sortGroupHosts ---");
    // console.log(group);
    group.hosts.sort((a, b) => {
      const hostA = a.hostname.toUpperCase(); // ignore upper and lowercase
      const hostB = b.hostname.toUpperCase(); // ignore upper and lowercase

      if (hostA < hostB) {
        return -1;
      }
      if (hostA > hostB) {
        return 1;
      }

      // names must be equal
      return 0;
    });
  }

  clearServers() {
    // console.log("--------- ServerService clearServers --------- " + this.uptimeUrl);

    this.http
      .delete(this.uptimeUrl)
      .pipe(
        map((responseData) => {
          const postsArray: any = [];
          return postsArray;
        })
      )
      .subscribe((deleteStatus) => {
        // console.log(deleteStatus);
      });
    this.hosts = [];
    //this.servers = [];
    this.groups = [];
    this.status = [];
  }

  getMemInfo(host: string) {
    // Send Http request
    // console.log("getMemInfo- Server Component [" + host + "] " + this.upMemUrl);

    const postsArray: any = [];

    if (typeof host !== 'undefined' && host.length > 1) {
      this.http
        .get(this.upMemUrl + '/' + host)
        .pipe(
          map((responseData) => {
            // no change
            return responseData;
          })
        )
        .subscribe((serverData) => {
          // console.log("--------------------- getMemInfo serverData ---------------------");
          // console.log('serverData');
          // console.log(serverData);
          postsArray.push(serverData);
        });
    }

    return postsArray;
  }

  getOSInfo(host: string) {
    // Send Http request
    // console.log("getOSInfo- Server Component [" + host + "] " + this.upOSUrl +"/" + host);

    const postsArray: any = [];

    if (typeof host !== 'undefined' && host.length > 1) {
      this.http
        .get(this.upOSUrl + '/' + host)
        .pipe(
          map((responseData) => {
            // no change
            // console.log("--- responseData ---");
            // console.log(responseData);
            return responseData;
          })
        )
        .subscribe((serverData) => {
          // console.log("--------------------- getOSInfo serverData ---------------------");
          // console.log(serverData);

          postsArray.push(serverData);
        });
    }

    return postsArray;
  }

  getGroupInfo(host: string) {
    // Send Http request
    // console.log("getGroupInfo- Server Component [" + host + "] " + this.upGroupUrl +"/" + host);

    const postsArray: any = [];

    if (typeof host !== 'undefined' && host.length > 1) {
      this.http
        .get(this.upGroupUrl + '/' + host)
        .pipe(
          map((responseData) => {
            // no change
            // console.log("--- responseData ---");
            // console.log(responseData);
            return responseData;
          })
        )
        .subscribe((serverData) => {
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

  getDiskInfo(host: string) {
    // Send Http request
    // console.log("getDiskInfo- Server Component [" + host + "] " + this.upDiskUrl +"/" + host);

    const postsArray: any = [];

    if (typeof host !== 'undefined' && host.length > 1) {
      this.http
        .get(this.upDiskUrl + '/' + host)
        .pipe(
          map((responseData) => {
            //Do nothing - pass through
            // console.log(responseData);
            return responseData;
          })
        )
        .subscribe((serverData) => {
          postsArray.push(serverData);
        });
    }
    return postsArray;
  }

  getCPUInfo(host: string) {
    // Send Http request
    // console.log("getCPUInfo- Server Component [" + host + "] " + this.upCPUUrl);

    const postsArray: any = [];
    var headerData = [];
    var rowData: any = [];
    var header = true;

    if (typeof host !== 'undefined' && host.length > 1) {
      this.http
        .get(this.upCPUUrl + '/' + host)
        .pipe(
          map((responseData) => {
            // No change - pass through
            return responseData;
          })
        )
        .subscribe((serverData) => {
          // console.log("--------------------- getCPUInfo serverData ---------------------");

          Object.values(serverData).forEach(function (value: string) {
            if (value.length > 0) {
              var newValue = value.split(':');

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

  getProcessInfo(host: string) {
    // Send Http request
    // console.log("getProcessInfo- Server Component [" + host + "] " + this.upProcessUrl);

    const postsArray: any = [];

    if (typeof host !== 'undefined' && host.length > 1) {
      this.http
        .get(this.upProcessUrl + '/' + host)
        .pipe(
          map((responseData) => {
            const postsArray = [];
            return responseData;
          })
        )
        .subscribe((serverData) => {
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

  getGroupStatus(): any {
    // console.log('--- serversService getGroupStatus ---');

    this.groups = this.translateToGroups(this.status);

    return this.groups;
  }

  getStatusDate(epoch: any): string {
    // console.log("----- getStatusDate -----");
    // console.log(epoch);

    let myDate = new Date(0);
    let myStatusDate: any = '';

    this.datePipe = new DatePipe('en-US');
    if (epoch) {
      // console.log("--- epoch ---")
      // console.log(epoch);
      myDate.setUTCSeconds(epoch);
      // console.log("--- myDate ---");
      // console.log(myDate);
      if (myDate) {
        myStatusDate = this.datePipe.transform(myDate, 'yyyy-MM-dd hh:mm:ss');
      }
    }

    return myStatusDate;
  }

  public deleteHost(group: any, hostname: string) {
    console.log(
      '---  serverService deleteHost --- group ' +
        group.group +
        ' hostname ' +
        hostname
    );

    this.groupHost = {};
    this.lastHost = '';

    for (let host = 0; host < group.hosts.length; host++) {
      if (hostname === group.hosts[host].hostname) {
        // console.log("--- Deleting group host [" + group.hosts[host].hostname + "]");
        group.hosts.splice(host, 1);
        break;
      }
    }

    for (let host = 0; host < this.status.length; host++) {
      if (hostname === this.status[host].hostname) {
        // console.log("--- Deleting status host [" + this.status[host].hostname + "]");
        this.status.splice(host, 1);
        break;
      }
    }

    if (group.hosts.length === 0) {
      // console.log("--- Deleteing group [ " + group.group + " ]");
      for (let myGroup = 0; myGroup < this.groups.length; myGroup++) {
        if (group.group === this.groups[myGroup].group) {
          // console.log("--- Deleting group [" + this.groups[myGroup].group + "]");
          this.group = [];
          this.lastGroup = '';
          this.groups.splice(myGroup, 1);
          break;
        }
      }
    }
  }

  public onServer(myGroup: any) {
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

  public onHost(myHost: any) {
    // console.log('--- serversService onHost ---');
    // console.log(myHost);
    // console.log(this.group);

    if (!this.lastGroup) {
      return;
    }

    for (let thisHost = 0; thisHost < this.group.hosts.length; thisHost++) {
      // console.log(this.group.hosts[thisHost].hostname + " " + myHost);
      if (this.group.hosts[thisHost].hostname == myHost) {
        this.groupHost = this.group.hosts[thisHost];
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
}
