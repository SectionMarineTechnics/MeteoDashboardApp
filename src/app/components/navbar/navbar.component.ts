import { Component, OnInit, EventEmitter } from '@angular/core';
import { GridsterLayoutService } from 'src/app/services/gridster-layout.service';
import { timer } from 'rxjs';
import { FormControl } from '@angular/forms';
import { AuthService } from 'src/app/services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {
  timeIntervals: String[] = [ "Custom", "2 hours", "4 hours" ];

  constructor(public layoutService: GridsterLayoutService, public auth: AuthService, private router: Router) { }

  ngOnInit() {
    const source = timer( 1000, 1000);
    //const subscribe = source.subscribe(val => this.refreshTimer(val));    
  }

  isDashboardView() {
    // return true if the current page is home
    //console.log("isDashboardView(): ", this.router.url);
    return this.router.url.match('^/$') || this.router.url.match('^/Dashboard$');
  }
}
