import { Injectable, Component, OnInit, OnDestroy } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { DatePipe } from '@angular/common';

import { interval, Subscription, take } from 'rxjs'; // throws something every second or what you define
import { Server } from '../modules/server.module';
import { ServerService } from './server.service';

@Injectable({
  providedIn: 'root',
})
export class HeartbeatService {
  private baseHostIP: string = '192.168.1.100'; //"my.serverstatus.com/"; //"nginx.ingress.192.168.1.100.nip.io"; //"serverstatus-service.default"; //"mynginx.192.168.1.100.nip.io"; //"192.168.1.100";
  private basePort: string = '30850'; //"8085"; //"30850";
  private baseUrl: string =
    'http://' + this.baseHostIP + ':' + this.basePort + '/';

  private uptimeUrl: string = this.baseUrl + 'uptime';
  private hostStatusUrl: string = this.baseUrl + 'hostStatus';

  //private numbers = interval(60000); //one minute
  private numbers = interval(30000); //one / half minute
  private takeFourNumbers = this.numbers.pipe();

  constructor(private http: HttpClient, public serverService: ServerService) {}

  ngOnInit() {}

  startStatusTimer() {
    // console.log("--------- ServerService startStatusTimer ---------");
    this.takeFourNumbers.subscribe((x) => {
      this.getStatus();
    });
  }

  getStatus() {
    // combine this and the gethost status
    console.log('--- heartbeat getStatus  ---');

    // Send Http request
    const pad = (i: number) => (i < 10 ? '0' + i : '' + i);
    const myDate = new Date();

    this.serverService.lastStatusUpdate =
      myDate.getFullYear() +
      '-' +
      pad(myDate.getMonth() + 1) +
      '-' +
      pad(myDate.getDate()) +
      ':' +
      pad(myDate.getHours()) +
      ':' +
      pad(myDate.getMinutes()) +
      ':' +
      pad(myDate.getSeconds());
    console.log(
      'ServerService - getStatus ' +
        this.hostStatusUrl +
        ' ' +
        this.serverService.lastStatusUpdate
    );

    //console.log("--------- ServerService getStatus --------- " + this.uptimeUrl + " " + myDate.getFullYear() + "-" + pad(myDate.getMonth() + 1) + "-" + pad(myDate.getDate()) + ":" + pad(myDate.getHours()) + ":" + pad(myDate.getMinutes()) + ":" + pad(myDate.getSeconds()));

    this.serverService.hosts = []; //TODO we do not want to set this to blank and we do not want to add the same host twice.
    this.serverService.status = [];
    this.http
      .get<Server>(this.hostStatusUrl)
      .pipe(
        map((responseData) => {
          const postsArray: Server[] = [];

          // console.log("--- responseData ---");
          // console.log(responseData);

          for (const key in responseData) {
            if (responseData.hasOwnProperty(key)) {
              postsArray.push({ ...responseData[key], id: key });
            }
          }
          // console.log("--------- ServerService getStatus postsArray --------- ");
          // console.log(postsArray);
          return postsArray;
        })
      )
      .subscribe(
        (serverData) => {
          this.serverService.httpError = null;
          // console.log("--------- ServerService subscribe serverData ---------");
          // console.log(serverData);

          let myIcon: string = '';

          for (const host in serverData) {
            // console.log(" for host in serverData [" + host +"]");
            // console.log(this.serverService.hosts);
            // console.log("serverData[host].hostname ["+ serverData[host].hostname + "] epoch [" + serverData[host].epoch + "]");

            //TODO need to figure this out and then remove this
            if (
              serverData[host].hostname === 'creede' ||
              serverData[host].hostname === 'creede02' ||
              serverData[host].hostname === 'creede03'
            ) {
              serverData[host].type = 'Server';
              serverData[host].icon = 'pi pi-server';
              //myIcon = "pi pi-server";
            } else if (serverData[host].hostname === 'ansible-master') {
              serverData[host].type = 'Cloud';
              serverData[host].icon = 'pi pi-cloud';
              //myIcon = "pi pi-cloud";
            } else if (
              serverData[host].hostname.substring(0, 11) === 'ubuntu-node'
            ) {
              serverData[host].type = 'Cloud';
              serverData[host].icon = 'pi pi-cloud';
              //myIcon = "pi pi-cloud";
            } else if (serverData[host].hostname.substring(0, 3) === '172') {
              serverData[host].type = 'Cloud';
              serverData[host].icon = 'pi pi-cloud';
              //myIcon = "pi pi-cloud";
            } else {
              serverData[host].type = 'Laptop';
              serverData[host].icon = 'pi pi-briefcase';
              //myIcon = "pi pi-briefcase";
            }

            // console.log("host " + serverData[host].hostname + " type " + serverData[host].type + " icon " + myIcon);

            if (this.serverService.hosts.includes(serverData[host].hostname)) {
              // this should never happen
            } else {
              // console.log("does not includes - " + serverData[host].hostname);
              serverData[host].lastUpdate = this.serverService.getStatusDate(
                serverData[host].epoch
              );
              this.serverService.getHostUptime(serverData[host]);
              this.serverService.hosts.push(serverData[host].hostname);

              // console.log("host " + myServer.hostname + " type " + myServer.type + " icon " + myServer.icon);
            }

          }

          this.serverService.status = serverData;

          this.serverService.hosts = this.serverService.hosts.sort();
          // console.log("this.serverService.hosts Sorted");
          // console.log(this.serverService.hosts);

          this.serverService.checkStatus();

          this.serverService.groups = this.serverService.translateToGroups(
            this.serverService.status
          );

          //TODO remove this.serverService.translateToGroups(this.serverService.status);
          //Need to roll up the displayed group
          this.serverService.rollupGroup(this.serverService.group);

          console.log(
            '===================================== info start ====================================='
          );
          console.log('------- hosts ------');
          console.log(this.serverService.hosts);

          console.log('------- groups ------');
          console.log(this.serverService.groups);

          console.log('------- status ------');
          console.log(this.serverService.status);

          console.log(
            '===================================== info end ====================================='
          );
        },
        (error) => {
          console.log('*** get Error ****');
          this.serverService.httpError = error;
          console.log(error);
          console.log(this.serverService.httpError);
        }
      );
  }
}
