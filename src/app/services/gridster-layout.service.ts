import { Injectable, EventEmitter } from '@angular/core';
import { GridsterConfig, GridsterItem, DisplayGrid, GridType } from 'angular-gridster2';
import { UUID } from 'angular2-uuid';
import { Lspi } from '../models/Lspi';
import { Serie } from '../models/Serie';

export interface IComponent {
  id: string;
  componentRef: string;
}

@Injectable({
  providedIn: 'root'
})
export class GridsterLayoutService {
  public options: GridsterConfig = {
    draggable: {
      enabled: true,
      ignoreContent: true,
      dragHandleClass: 'dragHandleHeader'
    },
    pushItems: true,
    resizable: {
      enabled: true
    },
    minCols: 50,
    maxCols: 100,
    minRows: 50,
    maxRows: 100,
    maxItemCols: 100,
    minItemCols: 5,
    maxItemRows: 100,
    minItemRows: 5,
    maxItemArea: 10000,
    minItemArea: 25,
    defaultItemCols: 10,
    defaultItemRows: 10,
    displayGrid: DisplayGrid.None,
    margin: 10,
    outerMargin: true,
    outerMarginTop: null,
    outerMarginRight: null,
    outerMarginBottom: null,
    outerMarginLeft: null,    
    gridType: GridType.Fit
  };

  public layout: GridsterItem[] = [];
  public components: IComponent[] = [];
  dropId: string;

  startTime: Date = new Date(2019, 8, 26, 0, 0, 0);
  endTime: Date = new Date(2019, 8, 28, 0, 0, 0);  
  public updateTimeEvent: EventEmitter<any> = new EventEmitter();

  constructor( ) { }

  addItem(): void {
    var newId: string;
    newId = UUID.UUID();

    let getGetijSeriesData: Array<Serie> = [
      new Serie( new Lspi('OKG', 'VL1', 'WS0', 10), new Date(2019, 8, 26, 0, 0, 0), new Date(2019, 8, 28, 0, 0, 0) ),
      new Serie( new Lspi('NPT', 'VL1', 'WS0', 10), new Date(2019, 8, 26, 0, 0, 0), new Date(2019, 8, 28, 0, 0, 0) ),
      new Serie( new Lspi('ZLD', 'VL1', 'WS0', 10), new Date(2019, 8, 26, 0, 0, 0), new Date(2019, 8, 28, 0, 0, 0) )
    ]

    this.layout.push({
      cols: 40,
      id: newId,
      rows: 30,
      x: 0,
      y: 0,
      type: 'widgetTimeSeriesChart',
      serieList: getGetijSeriesData
    });

    console.log('addItem:' + newId);
  }

  deleteItem(id: string): void {
    console.log('deleteItem:' + id);
    
    const item = this.layout.find(d => d.id === id);
    this.layout.splice(this.layout.indexOf(item), 1);
    const comp = this.components.find(c => c.id === id);
    this.components.splice(this.components.indexOf(comp), 1);    
  } 

  setDropId(dropId: string): void {
    this.dropId = dropId;
  }
  dropItem(dragId: string): void {
    const componentlist = this.components;
    const comp: IComponent = componentlist.find(c => c.id === this.dropId);
    
    const updateIdx: number = comp ? componentlist.indexOf(comp) : componentlist.length;
    const componentItem: IComponent = {
      id: this.dropId,
      componentRef: dragId
    };
    this.components = Object.assign([], componentlist, { [updateIdx]: componentItem });
  }
  getComponentRef(id: string): string {
    const comp = this.components.find(c => c.id === id);
    return comp ? comp.componentRef : null;
  }  

  goBackward(){
    let timeDiff = (this.endTime.getTime() - this.startTime.getTime());
    this.startTime = new Date(this.startTime.getTime() - timeDiff);
    this.endTime = new Date(this.endTime.getTime() - timeDiff);
    this.updateTime();
  }  

  goForward(){
    let timeDiff = (this.endTime.getTime() - this.startTime.getTime());
    this.startTime = new Date(this.startTime.getTime() + timeDiff);
    this.endTime = new Date(this.endTime.getTime() + timeDiff);
    this.updateTime();
  }

  zoomIn(){
    let timeDiff = (this.endTime.getTime() - this.startTime.getTime());
    this.startTime = new Date(this.startTime.getTime() + timeDiff/4);
    this.endTime = new Date(this.endTime.getTime() - timeDiff/4);
    this.startTime.setSeconds(0);
    this.endTime.setSeconds(0);
    this.updateTime();
  }

  zoomOut(){
    let timeDiff = (this.endTime.getTime() - this.startTime.getTime());
    this.startTime = new Date(this.startTime.getTime() - timeDiff/2);
    this.endTime = new Date(this.endTime.getTime() + timeDiff/2);
    this.startTime.setSeconds(0);
    this.endTime.setSeconds(0);
    this.updateTime();
  }

  updateTime() {
    let startTime = this.startTime;
    let endTime = this.endTime;
    this.updateTimeEvent.emit( {startTime, endTime} );
  }   
}
