import { Component, OnInit, AfterViewInit, Input, EventEmitter, OnDestroy, ViewChild } from '@angular/core';
import { Subscription, Subject } from 'rxjs';
import { DataService } from 'src/app/services/data.service';
import { Lspi } from 'src/app/models/Lspi';
import { GoogleChartComponent } from 'angular-google-charts';
import { Serie } from 'src/app/models/Serie';

@Component({
  selector: 'app-time-series-chart',
  templateUrl: './time-series-chart.component.html',
  styleUrls: ['./time-series-chart.component.css']
})
export class TimeSeriesChartComponent implements OnInit, OnDestroy {
  @Input() widget;
  @Input() resizeEvent: EventEmitter<any>;
  @Input() updateTimeEvent: EventEmitter<any>;  

  @Input() serieList: Serie[];
  @Input() title: string;  

  @Input() chartTitle: string;
  @Input() chartSubTitle: string;

  updateTimeSubsription: Subscription;

  resizeSubsription: Subscription;

  protected _onDestroy = new Subject<void>();
  private chartHandle: GoogleChartComponent;

  private loading: boolean = true;

  @ViewChild('GoogleChart', {static: false}) set content(content: GoogleChartComponent) {
     this.chartHandle = content;
  }

  myChartData: Array<Array<any>>;
  myColumnNames: string[];
  

  gridsterItemComponent_height: number = 0;
  gridsterItemComponent_width: number = 0;


  constructor(private dataService: DataService ) { 
    dataService.updateChartDataEvent.subscribe(value => this.updateChart(value));

    this.chartTitle = "Waterstand";
    this.chartSubTitle = "(Locatie Seastar, cm)";

    this.myChartData = [];
    this.myChartData.push([0, 0]);
    this.myColumnNames = ["time", "var"];    

    let lspiList: Lspi[] = [];
  }

  ngOnInit() {
    if(this.updateTimeEvent != undefined){
      this.updateTimeSubsription = this.updateTimeEvent.subscribe((event) => {
          console.log("updateTimeEvent event");
          console.log("updateTimeEvent startTime: ", event.startTime);
          console.log("updateTimeEvent endTime: ", event.endTime);
      });    
    } 

    let lspiList: Lspi[] = [];

    this.serieList = this.widget.serieList;

    this.serieList.forEach( (serie, index) => {
      lspiList.push(serie.Lspi);
    });    
  }

  public ngAfterViewInit(){
    /*this.RedrawChart();*/

    console.log("ngAfterViewInit() Resize event: ", this.resizeEvent);
    if(this.resizeEvent != undefined){
      this.resizeSubsription = this.resizeEvent.subscribe((event) => {
        if (event.gridsterItem === this.widget) {
          console.log("Resize event");
          console.log("gridsterItem: ", event.gridsterItem);
          console.log("gridsterItemComponent: ", event.gridsterItemComponent);

          this.gridsterItemComponent_height = event.gridsterItemComponent.height;
          this.gridsterItemComponent_width =  event.gridsterItemComponent.width;
          this.loadData();
        }
      });    
    }

    if(this.updateTimeEvent != undefined){
      this.updateTimeSubsription = this.updateTimeEvent.subscribe((event) => {
        /*if (event.gridsterItem === this.widget) { */
          console.log("updateTimeEvent event");
          console.log("updateTimeEvent startTime: ", event.startTime);
          console.log("updateTimeEvent endTime: ", event.endTime);
          
          let update: boolean = false;
          this.serieList.forEach( (element, index) => {
            if(element.StartTime = event.startTime) { 
              element.StartTime = event.startTime; 
              update = true;
            }
            if(element.EndTime = event.endTime) { 
              element.EndTime = event.endTime;
              update = true;
            }
          });

          if(update){
            this.loadData();
          }

          /*console.log("gridsterItem: ", event.gridsterItem);
          console.log("gridsterItemComponent: ", event.gridsterItemComponent);*/
        /*}*/
      });    
    }    

    console.log("ngAfterViewInit: this.chartHandle: ", this.chartHandle);
    
    /*
    this.dataService.getLSPIList()
          .then(_ => (this.loading = false) )
          .then(result => {
            this.setInitialValue();
          });
    */

    //this.loadData(0);
  }

  protected setInitialValue() {
  } 

  ngOnDestroy() {
    if(this.updateTimeSubsription != undefined) this.updateTimeSubsription.unsubscribe();
  }  
  
  updateChart(value) {
    if(value.widget == this.widget){
      this.myChartData = value.ChartData;
      this.myColumnNames = value.ColumnNames;
    }
  }

  loadData() 
  {
    /*this.chart.instance.showLoadingIndicator();*/
    let firstCall: boolean = true;
    let combinedFrame: any;

    let headerHeight: number = 100;

    console.log("this.widget.cols; ", this.widget.cols);
    console.log("this.widget.rows; ", this.widget.rows);

    this.chartHandle.options = { title: 'TestBed', width: '100%', height: '100%', chartArea: {width: 'auto', height: 'auto'}, curveType: 'none', legend: { position: 'none' }}
    if(this.gridsterItemComponent_height != 0) {
      this.chartHandle.options.height = this.gridsterItemComponent_height - headerHeight;
    }
    if(this.gridsterItemComponent_width != 0) {
      this.chartHandle.options.width = this.gridsterItemComponent_width;
    }
    this.chartHandle.dynamicResize = true;

    if(this.serieList != undefined && this.serieList.length > 0){
      this.dataService.GetData(this.widget, 1, this.serieList[0].StartTime, this.serieList[0].EndTime, this.serieList);
    }
  }  

  RedrawChart() {
    console.log("this.myChartData: ", this.myChartData);
    console.log("this.myColumnNames: ", this.myColumnNames);

    /*console.log("this.dataService.lspis: ", this.dataService.lspis);*/

    console.log("this.loading: ", this.loading);


  }    

  GetDataTest(){
    let lspiList: Lspi[] = new Array<Lspi>();

    lspiList.push( new Lspi("OKG","VL1","WS0",10));
    /*lspiList.push( new Lspi("NPT","VL1","WS0",10));
    lspiList.push( new Lspi("ZLD","VL1","WS0",10));*/

    this.dataService.getDataFrameWithLspiList( 0, new Date(2019, 8, 26, 0, 0, 0), new Date(2019, 8, 28, 0, 0, 0),  lspiList);
  }

  showData(){
    return (this.serieList.length > 0);
  }

}
