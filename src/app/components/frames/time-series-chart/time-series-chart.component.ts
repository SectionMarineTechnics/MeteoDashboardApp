import { Component, OnInit, AfterViewInit, Input, EventEmitter, OnDestroy, ViewChild } from '@angular/core';
import { Subscription, Subject } from 'rxjs';
import { DataService } from 'src/app/services/data.service';
import { Lspi } from 'src/app/models/Lspi';
import { GoogleChartComponent } from 'angular-google-charts';
import { Serie } from 'src/app/models/Serie';
import { LineChartConfig } from 'src/app/models/LineChartConfig';
import { LineChartComponent } from '../../dashboard/line-chart/line-chart.component';
import { ResizedEvent } from 'angular-resize-event';

@Component({
  selector: 'app-time-series-chart',
  templateUrl: './time-series-chart.component.html',
  styleUrls: ['./time-series-chart.component.css']
})
export class TimeSeriesChartComponent implements OnInit, OnDestroy, AfterViewInit {
  chartData: any[];
  chartConfig: LineChartConfig;
  chartElementId: string;

  resizeLineChartComponentEvent: EventEmitter<any> = new EventEmitter();
  updateLineChartComponentEvent: EventEmitter<any> = new EventEmitter();

  @Input() widget;
  @Input() resizeEvent: EventEmitter<any>;
  @Input() updateTimeEvent: EventEmitter<any>;

  @Input() serieList: Serie[];
  @Input() title: string;

  @Input() chartTitle: string;
  @Input() chartSubTitle: string;

  updateTimeSubsription: Subscription;
  resizeSubsription: Subscription;
  updateChartDataSubscription: Subscription;

  private loading: boolean = true;

  constructor(private dataService: DataService) {
    console.log("TimeSeriesChartComponent constructor()");
    this.updateChartDataSubscription = dataService.updateChartDataEvent.subscribe(event => {
      if (event.widget == this.widget) {
        console.log("TimeSeriesChartComponent dataService.updateChartDataEvent", event);
        if(event.ChartData[0][0] != "Time") event.ChartData.unshift(event.ColumnNames);
        this.chartData = event.ChartData;
        this.updateLineChartComponentEvent.emit(this.chartData);
      }
    });

    this.chartTitle = "Waterstand";
    this.chartSubTitle = "(Locatie Seastar, cm)";

    let lspiList: Lspi[] = [];
  }

  ngOnInit() {
    console.log("TimeSeriesChartComponent ngOnInit()");

    this.chartData =  [[ ]];
    this.chartConfig = new LineChartConfig(this.widget.id, 0.4, 100, 100, 'dd/MM HH:mm');
    this.chartElementId = this.widget.id + '_ChartElementId';

    if (this.updateTimeEvent != undefined) {
      this.updateTimeSubsription = this.updateTimeEvent.subscribe((event) => {
        console.log("TimeSeriesChartComponent updateTimeEvent event", event);

        let update: boolean = false;
        this.serieList.forEach((element, index) => {


          update = true;


          
          if (element.StartTime != event.startTime) {
            element.StartTime = event.startTime;
            update = true;
          }
          if (element.EndTime != event.endTime) {
            element.EndTime = event.endTime;
            update = true;
          }
        });

        if (update) {
          this.loadData();
        }
      });
    }
    let lspiList: Lspi[] = [];

    this.serieList = this.widget.serieList;

    this.serieList.forEach((serie, index) => {
      lspiList.push(serie.Lspi);
    });
  }

  ngOnDestroy() {
    console.log("TimeSeriesChartComponent ngOnDestroy()");
    if (this.updateTimeSubsription != undefined) this.updateTimeSubsription.unsubscribe();
    if (this.resizeSubsription != undefined) this.resizeSubsription.unsubscribe();
    if (this.updateChartDataSubscription != undefined) this.updateChartDataSubscription.unsubscribe();
  }  

  public readyNotifyEventHandler(): void {
      console.log("TimeSeriesChartComponent readyNotifyEvent event", event);
      this.loading = false;
  }

  public ngAfterViewInit() {
    console.log("TimeSeriesChartComponent ngAfterViewInit()");
    if (this.resizeEvent != undefined) {
      this.resizeSubsription = this.resizeEvent.subscribe((event) => {
        if (event.gridsterItem == this.widget) {
          console.log("TimeSeriesChartComponent Gridster Resize event", event);
          
          this.chartConfig.width = event.gridsterItemComponent.width;
          this.chartConfig.height = event.gridsterItemComponent.height - 26;
          this.loadData();
        }
      });
    }
  }

  protected setInitialValue() {
  }

  public onChartContainerResized(event: ResizedEvent){
    console.log("onChartContainerResized", event);
    
    this.chartConfig.width = event.newWidth;
    this.chartConfig.height = event.newHeight;

    if(!this.loading){
      this.loading = true;
      this.resizeLineChartComponentEvent.emit( event );
    }
  }

  loadData() {
    if (this.serieList.length > 0) {
      this.loading = true;

      let firstCall: boolean = true;
      let combinedFrame: any;
      
      let hAxisFormat:string = 'dd/MM HH:mm';
      if(this.serieList != undefined){
        let startTime: Date = this.serieList[0].StartTime;
        let endTime: Date = this.serieList[0].EndTime;
        let duration:number = endTime.getTime() - startTime.getTime();

        let hourInMs: number = 60*60*1000;
        let dayInMs: number = 24*hourInMs;
        let weekInMs: number = 7*dayInMs;
        let monthInMs: number = 4*weekInMs;
        let yearInMs: number = 52*weekInMs;

        if(duration > 0 && duration <= hourInMs){
          hAxisFormat = 'mm';
        }
        else if(duration > hourInMs && duration <= dayInMs){
          hAxisFormat = 'HH:mm';
        }
        else if(duration > dayInMs && duration <= weekInMs){
          hAxisFormat = 'dd HH:mm';
        }
        else if(duration > weekInMs && duration <= monthInMs){
          hAxisFormat = 'dd/MM HH:mm';
        }
        else if(duration > monthInMs && duration <= yearInMs){
          hAxisFormat = 'dd/MM';
        }
        else if(duration > yearInMs){
          hAxisFormat = 'dd/MM/YYYY';
        }
      }
      this.chartConfig.hAxisFormat = hAxisFormat;
      

      if (this.serieList != undefined && this.serieList.length > 0) {
        this.dataService.GetData(this.widget, 1, this.serieList[0].StartTime, this.serieList[0].EndTime, this.serieList);
      }
    }
  }

  showData() {
    return (this.serieList.length > 0);
  }

  showNoData() {
    return (this.serieList.length == 0);
  }

  showLoading() {
    if (this.serieList != undefined && this.serieList.length == 0) {
      return false;
    }
    else {
      return (this.loading);
    }
  }
}
