import { Component, OnInit, OnDestroy, EventEmitter, Input } from '@angular/core';

import { GridsterConfig, GridsterItem } from 'angular-gridster2';
import { GridsterLayoutService, IComponent  } from '../../services/gridster-layout.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit, OnDestroy {
  resizeEvent: EventEmitter<any> = new EventEmitter();

  @Input() updateTimeEvent: EventEmitter<any>; 

  startTime: Date = new Date(2019, 8, 26, 0, 0, 0);
  endTime: Date = new Date(2019, 8, 28, 0, 0, 0);

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
