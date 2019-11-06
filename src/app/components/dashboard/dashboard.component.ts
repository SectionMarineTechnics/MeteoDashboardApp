import { Component, OnInit, OnDestroy, EventEmitter } from '@angular/core';
import { Subscription, timer } from 'rxjs';
import { first } from 'rxjs/operators';

import { GridsterConfig, GridsterItem } from 'angular-gridster2';
import { GridsterLayoutService, IComponent  } from '../../services/gridster-layout.service';

import { FormControl } from '@angular/forms';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit, OnDestroy {
  resizeEvent: EventEmitter<any> = new EventEmitter();
  updateTimeEvent: EventEmitter<any> = new EventEmitter();

  get options(): GridsterConfig {
    return this.layoutService.options;
  }
  get layout(): GridsterItem[] {
    return this.layoutService.layout;
  }
  get components(): IComponent[] {
    return this.layoutService.components;
  }  
  constructor(public layoutService: GridsterLayoutService) { }

  ngOnInit() {
    this.layoutService.options.itemResizeCallback = this.itemResize;    
  }

  ngOnDestroy() {
    //this.currentUserSubscription.unsubscribe();
  }  

  itemResize = (gridsterItem: any, gridsterItemComponent: any) => {
    this.resizeEvent.emit( {gridsterItem, gridsterItemComponent} );
  }

}
