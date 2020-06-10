import { Component, OnInit, Input, EventEmitter, OnDestroy, AfterViewInit } from '@angular/core';
import { Serie } from 'src/app/models/Serie';
import { Subscription } from 'rxjs';
import { DataService } from 'src/app/services/data.service';
import { DataPoint } from 'src/app/models/DataPoint';

@Component({
  selector: 'app-table-frame',
  templateUrl: './table-frame.component.html',
  styleUrls: ['./table-frame.component.css']
})

export class TableFrameComponent implements OnInit, OnDestroy, AfterViewInit {
  @Input() widget;
  @Input() resizeEvent: EventEmitter<any>;
  @Input() updateTimeEvent: EventEmitter<any>;

  @Input() serieList: Serie[];

  updateTimeSubsription: Subscription;
  resizeSubsription: Subscription;
  updateChartDataSubscription: Subscription;

  /*myChartData: Array<Array<any>>;*/
  /*myChartData: Array<DataPoint>;*/
  myChartData: Array<Object>;
  myColumnNames: string[];

  constructor(private dataService: DataService) {
    this.updateChartDataSubscription = dataService.updateChartDataEvent.subscribe(value => {
      if (value.widget == this.widget) {
        /*console.log("TableFrameComponent updateChartDataEvent(value): value = ", value);*/

        /* Convert chartdata from value array to object array for mat-table compability: */
        value.ColumnNames.forEach((column, index) => {
          if (column == 'Time') value.ColumnNames[index] = 'Tijd';
        });
        this.myChartData = new Array<DataPoint>();
        value.ChartData.forEach(element => {
          let obj: Object = new Object();
          let index: number = 0;
          value.ColumnNames.forEach(column => {
            if(element[index] == -9999 || element[index] == -999) element[index] = null; 
            obj[column] = element[index];
            index++;
          });
          this.myChartData.push(obj);
        });
        this.myColumnNames = value.ColumnNames;

        /*console.log("this.myChartData: ", this.myChartData);*/
        /*console.log("this.myColumnNames: ", this.myColumnNames);*/
      }
    });
  }

  ngOnInit() {
    /*console.log("TableFrameComponent ngOnInit");*/
    if (this.updateTimeEvent != undefined) {
      this.updateTimeSubsription = this.updateTimeEvent.subscribe((event) => {
        /*console.log("TableFrameComponent updateTimeEvent event started from ngOnInit");*/
        /*console.log("TableFrameComponent updateTimeEvent startTime: ", event.startTime);*/
        /*console.log("TableFrameComponent updateTimeEvent endTime: ", event.endTime);*/

        this.loadData();
      });

      this.serieList = this.widget.serieList;
    }
  }

  ngOnDestroy() {
    console.log("ValueComponent ngOnDestroy()");
    if (this.updateTimeSubsription != undefined) this.updateTimeSubsription.unsubscribe();
    if (this.resizeSubsription != undefined) this.resizeSubsription.unsubscribe();
    if (this.updateChartDataSubscription != undefined) this.updateChartDataSubscription.unsubscribe();
  }  

  ngAfterViewInit() {
    /*this.RedrawChart();*/

    /*console.log("TableFrameComponent ngAfterViewInit()");*/
    if (this.resizeEvent != undefined) {
      this.resizeSubsription = this.resizeEvent.subscribe((event) => {

        /*console.log("ValueFramTableFrameComponenteComponent Resize event", event);*/
        if (event.gridsterItem === this.widget) {
          /*console.log("TableFrameComponent Resize event");*/
          /*console.log("TableFrameComponent gridsterItem: ", event.gridsterItem);*/
          /*console.log("TableFrameComponent gridsterItemComponent: ", event.gridsterItemComponent);*/
          this.loadData();
        }
      });
    }
  }

  loadData() {
    /*console.log("TableFrameComponent loadData()");*/
    this.dataService.GetData(this.widget, 1, this.serieList[0].StartTime, this.serieList[0].EndTime, this.serieList);
  }

  showData() {
    return (this.myChartData != undefined);
  }

  padZeroes(input: number, length: number) {
    return String("0").repeat(Math.abs(length - input.toString().length)) + input.toString();
  }

  timeToStr(time: Date): string {
    return this.padZeroes(time.getDate(), 2) + '/' + this.padZeroes((time.getMonth() + 1), 2) + '/' + time.getFullYear() + ' ' + this.padZeroes(time.getHours(), 2) + ':' + this.padZeroes(time.getMinutes(), 2) + ':' + this.padZeroes(time.getSeconds(), 2);
  }

  showDataValue(value: any) {
    if (typeof value == 'number') {
      let numberValue: number = value;
      return numberValue.toFixed(2);
    }
    else if (typeof value == 'string') {
      let stringValue: string = value;
      return value;
    }
    else if (value != null) {
      if (value.__proto__ != null) {
        if (value.__proto__.constructor.name == "Date") {
          let dateValue: Date = value;
          return this.timeToStr(dateValue);
        }
      }
    }
  }
}
