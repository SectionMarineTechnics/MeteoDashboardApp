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
export class TimeSeriesChartComponent implements OnInit, OnDestroy, AfterViewInit {
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

  @ViewChild('GoogleChart', { static: false }) set content(content: GoogleChartComponent) {
    this.chartHandle = content;
  }

  myChartData: Array<Array<any>>;
  myColumnNames: string[];


  gridsterItemComponent_height: number = 0;
  gridsterItemComponent_width: number = 0;


  constructor(private dataService: DataService) {
    this.myChartData = [];
    this.myColumnNames = [];

    dataService.updateChartDataEvent.subscribe(value => {
      if (value.widget == this.widget) {
        this.myChartData = value.ChartData;
        this.myColumnNames = value.ColumnNames;
      }
    });

    this.chartTitle = "Waterstand";
    this.chartSubTitle = "(Locatie Seastar, cm)";

    this.myChartData = [];
    this.myChartData.push([0, 0]);
    this.myColumnNames = ["time", "var"];

    let lspiList: Lspi[] = [];
  }

  ngOnInit() {
    console.log("TimeSeriesChartComponent ngOnInit()");
    if (this.updateTimeEvent != undefined) {
      this.updateTimeSubsription = this.updateTimeEvent.subscribe((event) => {
        console.log("TimeSeriesChartComponent UpdateTime event", event, this.chartHandle);

        let update: boolean = false;
        this.serieList.forEach((element, index) => {
          if (element.StartTime = event.startTime) {
            element.StartTime = event.startTime;
            update = true;
          }
          if (element.EndTime = event.endTime) {
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

  public ngAfterViewInit() {
    if (this.resizeEvent != undefined) {
      this.resizeSubsription = this.resizeEvent.subscribe((event) => {
        if (event.gridsterItem === this.widget) {
          console.log("TimeSeriesChartComponent Resize event", event, this.chartHandle);
          this.gridsterItemComponent_height = event.gridsterItemComponent.height;
          this.gridsterItemComponent_width = event.gridsterItemComponent.width;
          this.loadData();
        }
      });
    }

    this.chartHandle.ready.subscribe( (event) => {
      this.loading = false;
    });    
  }

  protected setInitialValue() {
  }

  ngOnDestroy() {
    console.log("TimeSeriesChartComponent ngOnDestroy()");
    if (this.updateTimeSubsription != undefined) this.updateTimeSubsription.unsubscribe();
  }

  loadData() {
    /*this.chart.instance.showLoadingIndicator();*/
    if (this.serieList.length > 0) {
      let firstCall: boolean = true;
      let combinedFrame: any;

 console.log("TEST");

      this.chartHandle.options = {
        chart: {
          /*title: 'Luchtdruk waarde'*/
        },
        /*        
        axes: {
          // Adds labels to each axis; they don't have to match the axis names.
          y: {
            0: {label: 'Luchtdruk (hPa)'  },
          },
          x: { 
            0: { side: 'bottom', label: 'Tijd' }
          },
        },
        */
        animation:{
          duration: 1000,
          easing: 'out',
          startup: false
        },

        vAxis: { format:'###.###'} ,
        hAxis: { format:'dd/MM HH:mm'} ,

        /*title: 'TestBed',*/
        width: '100%', height: '100%',
        chartArea:{
          left:10,
          right:10, // !!! works !!!
          bottom:20,  // !!! works !!!
          top:20,
          width:"90%",
          height:"90%"
        },
        theme: 'maximized',
        curveType: 'none',
        legend: { position: 'bottom' }
      }

      /*this.chartHandle.options.hAxis.format = "dd/MM/yyyy";*/

      if (this.gridsterItemComponent_height != 0) {
        this.chartHandle.options.height = this.gridsterItemComponent_height - 50;
      }
      if (this.gridsterItemComponent_width != 0) {
        //this.chartHandle.options.width = this.gridsterItemComponent_width;
      }
      /*this.chartHandle.dynamicResize = true;*/

      if (this.serieList != undefined && this.serieList.length > 0) {
        this.dataService.GetData(this.widget, 1, this.serieList[0].StartTime, this.serieList[0].EndTime, this.serieList);
      }
    }
  }

  showData() {
    return (this.serieList.length > 0);
  }

}
