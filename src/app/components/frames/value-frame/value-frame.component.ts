import { Component, OnInit, Input, AfterViewInit, EventEmitter, OnDestroy } from '@angular/core';
import { DataService } from 'src/app/services/data.service';
import { Subscription } from 'rxjs';
import { Serie } from 'src/app/models/Serie';
import { Lspi } from 'src/app/models/Lspi';

@Component({
  selector: 'app-value-frame',
  templateUrl: './value-frame.component.html',
  styleUrls: ['./value-frame.component.css']
})
export class ValueFrameComponent implements OnInit, OnDestroy, AfterViewInit {
  @Input() widget;
  @Input() resizeEvent: EventEmitter<any>;
  @Input() updateTimeEvent: EventEmitter<any>;

  @Input() serieList: Serie[];

  updateTimeSubsription: Subscription;
  resizeSubsription: Subscription;
  updateChartDataSubscription: Subscription;

  myChartData: Array<Array<any>>;
  myColumnNames: string[];
  showingLastValue: boolean = true;

  constructor(private dataService: DataService) {
    this.updateChartDataSubscription = dataService.updateChartDataEvent.subscribe(value => {
      if (value.widget == this.widget) {
        /*console.log("ValueFrameComponent updateChartDataEvent(value): value = ", value);*/
        this.myChartData = value.ChartData;
        this.myColumnNames = value.ColumnNames;
      }
    });
  }

  ngOnInit() {
    /*console.log("ValueFrameComponent ngOnInit");*/
    if (this.updateTimeEvent != undefined) {
      this.updateTimeSubsription = this.updateTimeEvent.subscribe((event) => {
        /*console.log("ValueFrameComponent updateTimeEvent event started from ngOnInit");
        console.log("ValueFrameComponent updateTimeEvent startTime: ", event.startTime);
        console.log("ValueFrameComponent updateTimeEvent endTime: ", event.endTime);*/

        this.loadData();
      });
    }

    this.serieList = this.widget.serieList;
  }

  ngOnDestroy() {
    /*console.log("ValueComponent ngOnDestroy()");*/
    if (this.updateTimeSubsription != undefined) this.updateTimeSubsription.unsubscribe();
    if (this.resizeSubsription != undefined) this.resizeSubsription.unsubscribe();
    if (this.updateChartDataSubscription != undefined) this.updateChartDataSubscription.unsubscribe();
  }  

  public ngAfterViewInit() {
    /*this.RedrawChart();*/

    /*console.log("ValueFrameComponent ngAfterViewInit()");*/
    if (this.resizeEvent != undefined) {
      this.resizeSubsription = this.resizeEvent.subscribe((event) => {

        /*console.log("ValueFrameComponent Resize event", event);*/
        if (event.gridsterItem === this.widget) {
          /*console.log("ValueFrameComponent Resize event");
          console.log("ValueFrameComponent gridsterItem: ", event.gridsterItem);
          console.log("ValueFrameComponent gridsterItemComponent: ", event.gridsterItemComponent);*/

          this.loadData();
        }
      });
    }
  }

  loadData() {
    /*console.log("ValueFrameComponent loadData()");*/
    this.dataService.GetData(this.widget, 1, this.serieList[0].StartTime, this.serieList[0].EndTime, this.serieList);
  }  

  showData() {
    return (this.myChartData != undefined);
  }

  lastTime() {
    if(this.showingLastValue) return this.timeToStr(this.myChartData[this.myChartData.length-1][0]);
    else return this.timeToStr(this.myChartData[this.myChartData.length-2][0]);
  }

  unit() {
    let lspi: Lspi = this.serieList[0].Lspi;
    if(lspi != undefined)
    {
      return lspi.unit;
    }
  }

  lastValue() {
    /*let value: number = Math.trunc( this.myChartData[this.myChartData.length-1][1] * 100);*/
    /*return value / 100;*/
    let value: number = this.myChartData[this.myChartData.length-1][1];
    if(value != undefined && value != null)
    {
      this.showingLastValue = true;
      return value.toFixed(2);
    }
    else
    {
      /* try second oldest:*/
      value = this.myChartData[this.myChartData.length-2][1];
      if(value != undefined && value != null)
      {
        this.showingLastValue = false;
        return value.toFixed(2);      
      }
    }
    this.showingLastValue = true;
    return "Unknown";
  }

  lastValueWithUnit(){
    return this.lastValue() + " " + this.unit() /*+ " (" + this.lastTime() + ")"*/;
  }

  numberOfCharInlastValueWithUnit(){
    return "0 0 "+ this.lastValueWithUnit().length * 9 + " 18";
  }

  padZeroes(input: number, length: number) {
    return String("0").repeat(Math.abs(length - input.toString().length)) + input.toString();
  }

  timeToStr(time: Date): string {
    return this.padZeroes(time.getDate(), 2) + '/' + this.padZeroes((time.getMonth() + 1), 2) + '/' + time.getFullYear() + ' ' + this.padZeroes(time.getHours(), 2) + ':' + this.padZeroes(time.getMinutes(), 2) + ':' + this.padZeroes(time.getSeconds(), 2);
  }  
}
