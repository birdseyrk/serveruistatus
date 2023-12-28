import { Component } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { Subscription } from 'rxjs-compat/Subscription';

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

  //constructor(private router: Router, private authService: AuthService) { }
  
  constructor(
    private route: ActivatedRoute,
    private serverService: ServerService
  ) { }
  //constructor() { }

  ngOnInit() {
    //TODO not sure this is needed
    this.hostname = this.route.snapshot.params['server']; 
    this.paramsSubscription = this.route.params
      .subscribe(
        (params: Params) => {
          this.hostname = this.route.snapshot.params['server']; 
        }
      );
  }

  onLoadServer(id: number) {
    
  }

  onLogin() {
    //this.authService.login();
  }

  onLogout() {
    //this.authService.logout();
  }

  getServers() {
    console.log(this.serverService.getServers());
  }

  getHosts() {
    console.log(this.serverService.getHosts());
  }

}
