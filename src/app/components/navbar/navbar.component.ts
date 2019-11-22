import { Component, OnInit, EventEmitter, ViewChild } from '@angular/core';
import { GridsterLayoutService } from 'src/app/services/gridster-layout.service';
import { timer } from 'rxjs';
import { FormControl } from '@angular/forms';
import { AuthService } from 'src/app/services/auth.service';
import { Router } from '@angular/router';
import { Page } from 'src/app/models/Page';
import { MatSelect } from '@angular/material/select';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {
  timeIntervals: String[] = ["Custom", "1 hour", "2 hours", "4 hours", "6 hours", "8 hours", "16 hours", "24 hours"];
  refreshStates: String[] = ["Aan", "Uit"];
  pages: String[] = [];


  refreshState: string = "Aan";
  SelectedRefreshState: string = "Aan";
  timeInterval: string = "4 hours";

  page: string = "";
  SelectedPage: string = "";

  @ViewChild('myPageSelect', { static: true }) myPageSelect: MatSelect;

  constructor(public layoutService: GridsterLayoutService, public auth: AuthService, private router: Router) { }

  ngOnInit() {
    const source = timer(1000, 1000);
    //const subscribe = source.subscribe(val => this.refreshTimer(val));
  }

  isDashboardView() {
    // return true if the current page is home
    //console.log("isDashboardView(): ", this.router.url);
    return this.router.url.match('^/$') || this.router.url.match('^/Dashboard$');
  }

  padZeroes(input: number, length: number) {
    return String("0").repeat(Math.abs(length - input.toString().length)) + input.toString();
  }

  timeToStr(time: Date): string {
    return this.padZeroes(time.getUTCDate(), 2) + '/' + this.padZeroes((time.getUTCMonth() + 1), 2) + '/' + time.getUTCFullYear() + ' ' + this.padZeroes(time.getUTCHours(), 2) + ':' + this.padZeroes(time.getUTCMinutes(), 2) + ':' + this.padZeroes(time.getUTCSeconds(), 2);
  }

  ShowOtaryWebSite() {
    let url: string = "https://www.otary.be"
    window.open(url, "_blank");
  }

  UpdateRefreshState() {
    console.log("UpdateRefreshState()");

    if (this.SelectedRefreshState == "Aan") {
      this.layoutService.refreshTimerActive = true;
    } else {
      this.layoutService.refreshTimerActive = false;
    }
  }

  UpdatePage() {
    console.log("UpdatePage(): ", this.SelectedPage);
    if(this.SelectedPage == "Pagina instellingen"){
      this.router.navigateByUrl('/PageSettings');
    }
  }

  loadpages() {
    console.log("loadpages(): ");

    this.pages = [];

    let sortedPages = this.layoutService.currentUser.Page.sort( function(a, b) { 
      return a.position - b.position;
    });
    sortedPages.forEach((page: Page) => {
      this.pages.push(page.name);
    });
    this.pages.push("Pagina instellingen");

    if (this.SelectedPage == "") {
      this.page = this.layoutService.currentUser.Page[0].name;
      this.SelectedPage = this.page;
    }

    this.myPageSelect.open();
  }
}
