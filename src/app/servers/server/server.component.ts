import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Params, Data } from '@angular/router';
//import { HttpClient } from '@angular/common/http';
//import { Router } from '@angular/router';

//import { interval, Subscription, take } from 'rxjs';  // throws something every second or whatyou define
//import { map } from 'rxjs/operators';
import { SortEvent } from 'primeng/api';

import { ServerService } from '../../servers/servers.Service';
import { Server } from '../server.module';

//import { Subscription } from 'rxjs/Subscription';

@Component({
  selector: 'app-server',
  templateUrl: './server.component.html',
  styleUrls: ['./server.component.css']
})
export class ServerComponent implements OnInit, OnDestroy {

  server: Server = new Server("", "", "pi pi-server", "", "", "", "red");
  
  
  memInfoAvailable     = false;
  diskInfoAvailable    = false;
  cpuInfoAvailable     = false;
  processInfoAvailable = false;
  
  memCols: any[];
  diskCols: any[];
  cpuCols: any[];
  processCols: any[];

  memInfo     = {};
  diskInfo    = {};
  cpuInfo     = {};
  processInfo = {};

  selectedMemRow: {};
  selectedDiskRow: {};
  selectedCpuRow: {};
  selectedProcessRow: {};

  disabled = true;

  host = "";

  //paramSubscription: Subscription;constructor
  constructor(
    private route: ActivatedRoute, 
    //private http: HttpClient,
    public serverService: ServerService
  ) {

  }

  ngOnInit() {
    console.log("----------  ServerComponent  ngOnInit ----------"); 
    const myServer = this.route.snapshot.params['server'];
    //console.log(this.route.snapshot.params);
     this.host = this.route.snapshot.params['server'];
     console.log("The host is " + this.host);
    
     if ((typeof this.host === 'undefined') || this.host.length < 1) {
      this.disabled = true;
    } else {
      this.server = this.serverService.getServer(this.host);
      console.log("The server data is ");
      console.log(this.server);
      this.disabled = false;
    }

    this.memInfoAvailable     = false;
    this.diskInfoAvailable    = false;
    this.cpuInfoAvailable     = false;
    this.processInfoAvailable = false;

    this.memCols = [
      { field: '0', header: 'Name' },
      { field: '1', header: 'Value' }
    ];

    this.diskCols = [
      { field: 'filesystem', header: 'Name' },
      { field: 'size', header: 'Size' },
      { field: 'used', header: 'Used' },
      { field: 'avail', header: 'Available' },
      { field: 'use', header: 'Used %' },
      { field: 'mounted', header: 'Mounted On' }
    ];

    this.cpuCols = [
      { field: 'processor', header: 'processor' },
      { field: 'venderid', header: 'venderid' },
      { field: 'cpufamily', header: 'cpufamily' },
      { field: 'model', header: 'model' },
      { field: 'modelname', header: 'modelname' },
      { field: 'stepping', header: 'stepping' },
      { field: 'microcode', header: 'microcode' },
      { field: 'cpumhz', header: 'cpumhz' },
      { field: 'cachesize', header: 'cachesize' },
      { field: 'physicalid', header: 'physicalid' },
      { field: 'coreid', header: 'coreid' },
      { field: 'cpucores', header: 'cpucores' },
      { field: 'apicid', header: 'apicid' },
      { field: 'initialapicid', header: 'initialapicid' },
      { field: 'fpu', header: 'fpu' },
      { field: 'fpuexception', header: 'fpuexception' },
      { field: 'cpuidlevel', header: 'cpuidlevel' },
      { field: 'wp', header: 'wp' },
      { field: 'flags', header: 'flags' },
      { field: 'vmxflags', header: 'vmxflags' },
      { field: 'bugs', header: 'bugs' },
      { field: 'bogomips', header: 'bogomips' },
      { field: 'clflushsize', header: 'clflush Size' },
      { field: 'cachealignment', header: 'Cache Alignment' },
      { field: 'addresssizes', header: 'Address Sizes' },
      { field: 'powermanagement', header: 'Power Management' }
    ];

    this.processCols = [
      { field: 'processor', header: 'Process' }
    ];

    // this.route.data
    //   .subscribe(
    //     (data: Data) => {
    //       this.server = data['server'];
    //     }
    //   );

    //  this.host = this.route.snapshot.params['server'];

    // this.route.params
    //   .subscribe(
    //     (params: Params) => {
    //       this.host = params['server'];
    //       this.server = this.serverService.getServer(params['server']);
    //     }
    //   );
  }

  ngOnDestroy() {
    //this.paramSubscription.unsubscribe();
  }

  onRowMemSelect(event) {
    console.log("---------- onRowMemSelect ----------");
    console.log(event)
  }

  onRowDiskSelect(event) {
    console.log("---------- onRowDiskSelect ----------");
    console.log(event)
  }

  onRowCpuSelect(event) {
    console.log("---------- onRowCPUSelect ----------");
    console.log(event)
  }

  onRowProcessSelect(event) {
    console.log("---------- onRowProcessSelect ----------");
    console.log(event)
  }
  
  getServer() {
    //console.log("----------ServerComponent - getServer [" + this.host + "] ----------");
    if ( (typeof this.host !== 'undefined') && (this.host.length > 1)) {
      this.server = this.serverService.getServer(this.host);
      console.log(this.server);
    }
  }

  getMemInfo() {
   // console.log("----------ServerComponent - getMemInfo [" + this.host + "] ----------");
    if ( (typeof this.host !== 'undefined') && (this.host.length > 1)) {
      this.memInfo = this.serverService.getMemInfo(this.host);

      this.memInfoAvailable     = true;
      this.diskInfoAvailable    = false;
      this.cpuInfoAvailable     = false;
      this.processInfoAvailable = false;

      console.log(this.memInfo);
    }
  }
  
  getDiskInfo() {
    //console.log("---------- ServerComponent - getDiskInfo [" + this.host + "] ----------");
    if ( (typeof this.host !== 'undefined') && (this.host.length > 1)) {
      this.diskInfo = this.serverService.getDiskInfo(this.host);

      this.memInfoAvailable     = false;
      this.diskInfoAvailable    = true;
      this.cpuInfoAvailable     = false;
      this.processInfoAvailable = false;
      
      console.log(this.diskInfo);
    }
  }
  
  getCPUInfo() {
    //console.log("---------- ServerComponent - getCPUInfo [" + this.host + "] ----------");
    if ( (typeof this.host !== 'undefined') && (this.host.length > 1)) {
      this.cpuInfo = this.serverService.getCPUInfo(this.host);

      this.memInfoAvailable     = false;
      this.diskInfoAvailable    = false;
      this.cpuInfoAvailable     = true;
      this.processInfoAvailable = false;
      
      console.log(this.cpuInfo);
    }
  }
  
  getProcessInfo() {
    //console.log("---------- ServerComponent - getProcessInfo [" + this.host + "] ----------");
    
    if ( (typeof this.host !== 'undefined') && (this.host.length > 1)) {
      this.processInfo = this.serverService.getProcessInfo(this.host);

      this.memInfoAvailable     = false;
      this.diskInfoAvailable    = false;
      this.cpuInfoAvailable     = false;
      this.processInfoAvailable = true;
      
      console.log(this.processInfo);
      
    }
  }
  
  customMemSort(event: SortEvent) {
    console.log("---------- ServerComponent - customMemSort ----------");
    event.data.sort((data1, data2) => {
        
        let value1 = data1[event.field];
        let value2 = data2[event.field];
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

  customDiskSort(event: SortEvent) {
    console.log("---------- ServerComponent - customDiskSort ----------");
    event.data.sort((data1, data2) => {

        let value1 = data1[event.field];
        let value2 = data2[event.field];
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

  customCpuSort(event: SortEvent) {
    console.log("---------- ServerComponent - customCpuSort ----------");
    console.log(event);
    event.data.sort((data1, data2) => {
      console.log(data1);
      console.log(data2);
        let value1 = data1[event.field];
        let value2 = data2[event.field];
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

  customProcessSort(event: SortEvent) {
    console.log("---------- ServerComponent - customProcfessSort ----------");
    event.data.sort((data1, data2) => {
        let value1 = data1[event.field];
        let value2 = data2[event.field];
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
