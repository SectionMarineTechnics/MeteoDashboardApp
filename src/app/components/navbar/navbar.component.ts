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
  addActions: String[] = ["Voeg frame toe", "Voeg pagina toe"];
  pages: String[] = [];


  refreshState: string = "Aan";
  SelectedRefreshState: string = "Aan";
  SelectedAction: string = "Voeg frame toe";
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
    return this.padZeroes(time.getDate(), 2) + '/' + this.padZeroes((time.getMonth() + 1), 2) + '/' + time.getFullYear() + ' ' + this.padZeroes(time.getHours(), 2) + ':' + this.padZeroes(time.getMinutes(), 2) + ':' + this.padZeroes(time.getSeconds(), 2);
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

  UpdateAction() {
    if (this.SelectedAction == "Voeg frame toe") {
      this.layoutService.addItem();
    } else {
      this.router.navigateByUrl('/PageSettings');
    }
  }  

  UpdatePage() {
    console.log("UpdatePage(): ", this.SelectedPage);
    this.layoutService.currentPage = this.layoutService.currentUser.Page.find(x => x.name == this.SelectedPage);
    this.layoutService.RebuildLayout(this.layoutService.currentPage);
  }

  loadpages() {
    this.pages = [];

    let sortedPages = this.layoutService.currentUser.Page.sort( function(a, b) { 
      return a.position - b.position;
    });
    sortedPages.forEach((page: Page) => {
      this.pages.push(page.name);
    });

    if (this.SelectedPage == "") {
      this.page = this.layoutService.currentUser.Page[0].name;
      this.SelectedPage = this.page;
    }

    this.myPageSelect.open();
  }
}
