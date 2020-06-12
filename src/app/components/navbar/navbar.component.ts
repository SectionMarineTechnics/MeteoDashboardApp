import { Component, OnInit, OnDestroy, EventEmitter, ViewChild } from '@angular/core';
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

  auth0_profile: any = null;

  @ViewChild('myPageSelect', { static: true }) myPageSelect: MatSelect;

  constructor(public layoutService: GridsterLayoutService, public auth: AuthService, private router: Router) { }

  ngOnInit() {
    const source = timer(1000, 1000);
    //const subscribe = source.subscribe(val => this.refreshTimer(val));

    this.auth.userProfile$.subscribe(profile => {
      this.auth0_profile = profile;
    }) 

    this.layoutService.pagesLoadedEvent.subscribe((event) => {
        this.reloadpages();
    });
  }

  ngOnDestroy() {
    /* console.log("NavbarComponent ngOnDestroy()");*/
    if (this.layoutService.pagesLoadedEvent != undefined) this.layoutService.pagesLoadedEvent.unsubscribe();
  }    

  getUserName(){
    if(this.auth0_profile != null){
      return this.auth0_profile.name;
    }
    else{
      return "";
    }
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
    /*console.log("UpdateRefreshState()");*/

    if (this.SelectedRefreshState == "Aan") {
      this.layoutService.refreshTimerActive = true;
    } else {
      this.layoutService.refreshTimerActive = false;
    }
  }

  disableRefresh() {
    this.SelectedRefreshState = "Uit";
    this.layoutService.refreshTimerActive = false;
  } 

  ZoomIn(){
    this.disableRefresh();
    this.layoutService.zoomIn();
  }

  ZoomOut(){
    this.disableRefresh();    
    this.layoutService.zoomOut();
  }

  GoForward(){
    this.disableRefresh();    
    this.layoutService.goForward();
  }

  GoBackward(){
    this.disableRefresh();    
    this.layoutService.goBackward();
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

  reloadpages() {
    /*console.log("loadpages(): this.layoutService.currentUser.Page: ", this.layoutService.currentUser.Page);*/
    this.pages = [];

    let sortedPages = this.layoutService.currentUser.Page.sort( function(a, b) { 
      return a.position - b.position;
    });
    sortedPages.forEach((page: Page) => {
      this.pages.push(page.name);
    });

    /*console.log("loadpages(): sortedPages: ", sortedPages);*/

    if (this.SelectedPage == "") {
      /*this.page = this.layoutService.currentUser.Page[0].name;*/
      this.page = sortedPages[0].name;
      this.SelectedPage = this.page;
    }

    if(sortedPages.find(x => x.name == this.SelectedPage) == undefined){
      this.page = sortedPages[0].name;
      this.SelectedPage = this.page;      
    }

    /*console.log("loadpages(): call myPageSelect.open(): ", this.pages, this.page, this.SelectedPage);*/
  }

  loadpages() {
    this.reloadpages();
    this.myPageSelect.open();
  }
}
