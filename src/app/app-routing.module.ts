import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { ErrorPageComponent } from './error-page/error-page.component';
import { ServerStatusComponent } from './serverstatus/serverstatus.component';
import { ServerComponent } from './servers/server/server.component';
import { ServersComponent } from './servers/servers.component';

const routes: Routes = [
  { path: '', component: ServerStatusComponent },
  { path: 'serverstatus', component: ServerStatusComponent },
  { path: 'servers', component:ServersComponent},
  { path: 'server',  component:ServerComponent},
  { path: 'server/:server',  component:ServerComponent},
  { path: 'not-found', component: ErrorPageComponent, data: {message: 'Page not found!'} },
  { path: '**', redirectTo: '/not-found' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})

export class AppRoutingModule { }
