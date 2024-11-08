import { Component } from '@angular/core';

import { ServerService } from '../services/server.service';

@Component({
  selector: 'app-error-page',
  templateUrl: './error-page.component.html',
  styleUrl: './error-page.component.css'
})
export class ErrorPageComponent {
  
  constructor(
    
    public serverService: ServerService

  ) { }

}
