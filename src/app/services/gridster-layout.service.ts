import { Injectable, EventEmitter } from '@angular/core';
import { GridsterConfig, GridsterItem, DisplayGrid, GridType } from 'angular-gridster2';
import { UUID } from 'angular2-uuid';
import { Lspi } from '../models/Lspi';
import { Serie } from '../models/Serie';

import { AuthService } from 'src/app/services/auth.service';

import { SettingsService } from '../services/settings.service'
import { User } from '../models/User'
import { UserShort } from '../models/UserShort'
import { Page } from '../models/Page'
import { Frame } from '../models/Frame'
import { Frame_Element } from '../models/Frame_Element'
import { PanelType } from '../models/PanelType';
import { timer } from 'rxjs';

export interface IComponent {
  id: string;
  componentRef: string;
}

@Injectable({
  providedIn: 'root'
})
export class GridsterLayoutService {
  static instance: GridsterLayoutService;

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

  public startTime: Date;
  public endTime: Date;
  public updateTimeEvent: EventEmitter<any> = new EventEmitter();

  public refreshTimerActive: boolean;

  usersShortList: UserShort[];
  auth0_profile: any;

  currentUser: User;
  public currentPage: Page;

  constructor(public settingsService: SettingsService, public auth: AuthService) {
    /* Get current time, set seconds to 0: */
    this.endTime = new Date(Date.now());
    this.endTime.setSeconds(0);
    this.endTime.setMilliseconds(0);

    /* Calculate start time as current time - 3 days: */
    this.startTime = new Date(this.endTime.getTime() - 3 * 24 * 60 * 60 * 1000);
    this.startTime.setSeconds(0);
    this.startTime.setMilliseconds(0);

    /* Convert to UTC time: */
    this.endTime = new Date(this.endTime.getUTCFullYear(), this.endTime.getUTCMonth(), this.endTime.getUTCDate(), this.endTime.getUTCHours(), this.endTime.getUTCMinutes(), 0, 0);
    this.startTime = new Date(this.startTime.getUTCFullYear(), this.startTime.getUTCMonth(), this.startTime.getUTCDate(), this.startTime.getUTCHours(), this.startTime.getUTCMinutes(), 0, 0);

    console.log("intial startTime: ", this.startTime);
    console.log("intial endTime: ", this.endTime);

    this.refreshTimerActive = true;

    this.auth.userProfile$.subscribe(profile => {
      this.auth0_profile = profile;
    })

    const source = timer(1000, 1000);
    const subscribe = source.subscribe(val => this.refreshTimer(val));

    this.settingsService.getUsers().subscribe(users => {
      console.log('GridsterLayoutService:getUsers', 'received users: ', users);
      this.usersShortList = users;
      if (this.auth0_profile) {
        let currentUserId: number = this.usersShortList.find(x => x.name == this.auth0_profile.name).id;
        if (currentUserId) {
          this.settingsService.getUser(currentUserId).subscribe(user => {
            this.currentUser = user;
            console.log('GridsterLayoutService this.currentUser:  ', this.currentUser);
            console.log('Update this.currentUser login_time to now: ', this.currentUser);
            this.currentUser.login_time = new Date();
            this.currentUser.login_count++;
            this.settingsService.updateUser(this.currentUser).subscribe();

            /* Check if already pages exist: */
            if (this.currentUser.Page.length == 0) {
              this.settingsService.updatePage(new Page(0, [], this.currentUser.id, 'Page 1', this.getNexPagePosition())).subscribe(() => { this.UpdateCurrentUser(); }); /* Add empty frame for user */
            } else {
              this.currentPage = this.currentUser.Page[0];
            }
            console.log('Current page set to: ', this.currentPage);

            this.RebuildLayout(this.currentPage);
          });
        }
      }
    });

    return GridsterLayoutService.instance = GridsterLayoutService.instance || this;
  }

  RebuildLayout(page: Page) {
    page.Frame.forEach(frame => {
      let newId: string = frame.name;
      let getGetijSeriesData: Array<Serie> = new Array<Serie>();

      frame.Frame_Element.forEach(frameElement => {

        if (typeof frameElement.start_time == 'string') {
          frameElement.start_time = new Date(frameElement.start_time);
        }

        if (typeof frameElement.stop_time == 'string') {
          frameElement.stop_time = new Date(frameElement.stop_time);
        }

        getGetijSeriesData.push(new Serie(
          new Lspi(frameElement.LSPI_location, frameElement.LSPI_sensor, frameElement.LSPI_parameter, frameElement.LSPI_interval),
          this.startTime/*frameElement.start_time*/, this.endTime/*frameElement.stop_time*/));
      });

      let gridsterType: string = '';
      switch (frame.frame_type) {
        case 1: {
          gridsterType = 'widgetTimeSeriesChart';
          break;
        }
        case 2: {
          gridsterType = 'widgetTimeSeriesChart';
          break;
        }
        case 3: {
          gridsterType = 'widgetTimeSeriesChart';
          break;
        }
        default: {
          gridsterType = 'widgetTimeSeriesChart';
          break;
        }
      }

      this.layout.push({
        cols: frame.width,
        id: newId,
        rows: frame.height,
        x: frame.X,
        y: frame.Y,
        type: gridsterType,
        title: frame.title,
        serieList: getGetijSeriesData
      });
    });
  }

  refreshTimer(val: number) {
    if (this.refreshTimerActive) {
      console.log("refreshTimer: ", val);

      let currentTime: Date = new Date();
      currentTime = new Date(currentTime.getUTCFullYear(), currentTime.getUTCMonth(), currentTime.getUTCDate(),
                             currentTime.getUTCHours(), currentTime.getUTCMinutes(), currentTime.getUTCSeconds(), 0 );

      let timeDiff = (this.endTime.getTime() - this.startTime.getTime());
      let timeOffsetMinutes = (currentTime.getTime() - this.endTime.getTime()) / 1000 / 60;

      console.log("currentTime: ", currentTime);
      console.log("timeDiff: ", timeDiff);
      console.log("timeOffsetMinutes: ", timeOffsetMinutes);

      if (timeOffsetMinutes >= 1) {
        currentTime.setSeconds(0, 0);

        console.log("Update Time range: ");
        console.log("adjusted currentTime: ", currentTime);

        this.endTime = new Date(currentTime.getTime());
        this.startTime = new Date(this.endTime.getTime() - timeDiff);
        
        /* Convert to UTC time: */
        //this.endTime = new Date(this.endTime.getUTCFullYear(), this.endTime.getUTCMonth(), this.endTime.getUTCDate(), this.endTime.getUTCHours(), this.endTime.getUTCMinutes(), 0, 0);
        //this.startTime = new Date(this.startTime.getUTCFullYear(), this.startTime.getUTCMonth(), this.startTime.getUTCDate(), this.startTime.getUTCHours(), this.startTime.getUTCMinutes(), 0, 0);

        console.log("New start time: ", this.startTime);
        console.log("New end time: ", this.endTime);
        this.updateTime();
      }
    }
  }

  ChangeCallback(gridsterItem: any, gridsterItemComponent: any) {
    console.log("GridsterLayoutService ChangeCallback event: ");
    console.log("gridsterItem: ", gridsterItem);
    console.log("gridsterItemComponent: ", gridsterItemComponent);
    console.log("this: ", this);

    let frame: Frame = this.currentPage.Frame.find(x => x.name == gridsterItem.id);

    console.log("frame before: ", frame);
    if (frame) {
      frame.X = gridsterItem.x;
      frame.Y = gridsterItem.y;
      frame.width = gridsterItem.cols;
      frame.height = gridsterItem.rows;

      console.log("frame send: ", frame);

      this.settingsService.updateFrame(frame).subscribe();
    }
  }

  UpdateCurrentUser() {
    this.settingsService.getUser(this.currentUser.id).subscribe(user => {
      this.currentUser = user;
    });
  }

  UpdateCurrentPage() {
    this.settingsService.getPage(this.currentPage.page_id).subscribe(page => {
      this.currentPage = page;
    });
  }

  updateItem(frameGUID: string, title: string, lspiList: Lspi[], type: PanelType) {
    console.log('updateItem: ', frameGUID, title, lspiList);

    let frameItem: Frame = this.currentPage.Frame.find(x => x.name == frameGUID);
    let gridsterItem = this.layout.find(d => d.id === frameGUID);

    console.log('frameItem: ', frameItem);
    console.log('gridsterItem: ', gridsterItem);

    /* Update widget: */
    gridsterItem.title = title;
    let serieList: Serie[] = new Array<Serie>();
    lspiList.forEach(lspi => {
      serieList.push(new Serie(lspi, this.startTime, this.endTime));
    });
    gridsterItem.serieList = serieList;
    let frame_type: number = 0;
    switch (type.value) {
      case 'chart': {
        gridsterItem.type = 'widgetTimeSeriesChart';
        frame_type = 1;
        break;
      }
      case 'value': {
        gridsterItem.type = 'widgetTimeSeriesChart';
        frame_type = 2;
        break;
      }
      case 'table': {
        gridsterItem.type = 'widgetTimeSeriesChart';
        frame_type = 3;
        break;
      }
      default: {
        gridsterItem.type = 'widgetTimeSeriesChart';
        frame_type = 4;
        break;
      }
    }

    /* Update settings: */
    frameItem.title = title;
    frameItem.frame_type = frame_type;
    frameItem.Frame_Element.forEach(frameElement => {
      this.settingsService.deleteFrame_Element(frameElement.id).subscribe(() => { this.UpdateCurrentPage() });
    });
    let position: number = 1;
    lspiList.forEach(lspi => {
      this.settingsService.updateFrame_Element(new Frame_Element(0, frameItem.frame_id, lspi.Location, lspi.Sensor, lspi.Parameter, lspi.Interval, this.startTime, this.endTime, true, 60, 1, 1, position++)).subscribe(() => { this.UpdateCurrentPage() });
    });
    this.settingsService.updateFrame(frameItem).subscribe(() => { this.UpdateCurrentPage() });
  }

  addItem(): void {
    var newId: string;
    newId = UUID.UUID();

    let getGetijSeriesData: Array<Serie> = []

    this.layout.push({
      cols: 40,
      id: newId,
      rows: 30,
      x: 0,
      y: 0,
      type: 'widgetTimeSeriesChart',
      serieList: getGetijSeriesData,
      title: 'nieuw frame'
    });

    console.log('addItem:' + newId);

    let newFrameElements: Frame_Element[] = new Array<Frame_Element>();

    /* Add new frame to page: */
    this.settingsService.updateFrame(new Frame(0, [], this.currentPage.page_id, newId, 1, 0, 0, 40, 30, "nieuw frame", "", "", "", this.getNexFramePosition())).subscribe(() => {
      this.settingsService.getPage(this.currentPage.page_id).subscribe(page => {
        this.currentPage = page;
        console.log('added new frame to page with ID: ', newId, this.currentPage);

        let frameId: number = this.currentPage.Frame.find(x => x.name == newId).frame_id;

        /*
        console.log('add 3 Frame_elements with frame ID:', frameId);
        this.settingsService.updateFrame_Element(new Frame_Element(0, frameId, 'OKG', 'VL1', 'WS0', 10, new Date(2019, 8, 26, 0, 0, 0), new Date(2019, 8, 28, 0, 0, 0), true, 60, 1, 1)).subscribe( () => { this.UpdateCurrentPage() } );
        this.settingsService.updateFrame_Element(new Frame_Element(0, frameId, 'NPT', 'VL1', 'WS0', 10, new Date(2019, 8, 26, 0, 0, 0), new Date(2019, 8, 28, 0, 0, 0), true, 60, 1, 1)).subscribe( () => { this.UpdateCurrentPage() } );
        this.settingsService.updateFrame_Element(new Frame_Element(0, frameId, 'ZLD', 'VL1', 'WS0', 10, new Date(2019, 8, 26, 0, 0, 0), new Date(2019, 8, 28, 0, 0, 0), true, 60, 1, 1)).subscribe( () => { this.UpdateCurrentPage() } );                
        */
      });
    });
  }

  deleteItem(id: string): void {
    console.log('deleteItem:' + id);

    const item = this.layout.find(d => d.id === id);
    this.layout.splice(this.layout.indexOf(item), 1);
    const comp = this.components.find(c => c.id === id);
    this.components.splice(this.components.indexOf(comp), 1);

    this.settingsService.deleteFrame(this.currentPage.Frame.find(x => x.name == id).frame_id).subscribe();
  }

  ChangeSettings(id: string): void {
    console.log('ChangeSettings:' + id);
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

  goBackward() {
    let timeDiff = (this.endTime.getTime() - this.startTime.getTime());
    this.startTime = new Date(this.startTime.getTime() - timeDiff);
    this.endTime = new Date(this.endTime.getTime() - timeDiff);
    this.updateTime();
  }

  goForward() {
    let timeDiff = (this.endTime.getTime() - this.startTime.getTime());
    this.startTime = new Date(this.startTime.getTime() + timeDiff);
    this.endTime = new Date(this.endTime.getTime() + timeDiff);
    this.updateTime();
  }

  zoomIn() {
    let timeDiff = (this.endTime.getTime() - this.startTime.getTime());
    this.startTime = new Date(this.startTime.getTime() + timeDiff / 4);
    this.endTime = new Date(this.endTime.getTime() - timeDiff / 4);
    this.startTime.setSeconds(0);
    this.endTime.setSeconds(0);
    this.updateTime();
  }

  zoomOut() {
    let timeDiff = (this.endTime.getTime() - this.startTime.getTime());
    this.startTime = new Date(this.startTime.getTime() - timeDiff / 2);
    this.endTime = new Date(this.endTime.getTime() + timeDiff / 2);
    this.startTime.setSeconds(0);
    this.endTime.setSeconds(0);
    this.updateTime();
  }

  updateTime() {
    let startTime = this.startTime;
    let endTime = this.endTime;

    this.layout.forEach( (item: GridsterItem) => { 
      item.serieList.forEach( (serie: Serie) => {
        serie.StartTime = this.startTime;
        serie.EndTime = this.endTime;
      });
    });
    
    this.updateTimeEvent.emit({ startTime, endTime });
  }

  getNexPagePosition(): number{
    if(this.currentUser){
      if(this.currentUser.Page){
        let highestPosition: number = 0;
        this.currentUser.Page.forEach( page => {
          if(page.position > highestPosition){
            highestPosition = page.position;
          } 
        });
        return (highestPosition + 1);
      }
    }
    return 1;
  }

  getNexFramePosition(): number{
    if(this.currentPage){
      if(this.currentPage.Frame){
        let highestPosition: number = 0;
        this.currentPage.Frame.forEach( frame => {
          if(frame.position > highestPosition){
            highestPosition = frame.position;
          } 
        });
        return (highestPosition + 1);
      }
    }
    return 1;
  }
}
