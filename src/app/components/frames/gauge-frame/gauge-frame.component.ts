import { Component, OnInit, Input, EventEmitter } from '@angular/core';
import { Serie } from 'src/app/models/Serie';
import { Subscription } from 'rxjs';
import { DataService } from 'src/app/services/data.service';

@Component({
  selector: 'app-gauge-frame',
  templateUrl: './gauge-frame.component.html',
  styleUrls: ['./gauge-frame.component.css']
})
export class GaugeFrameComponent implements OnInit {
  @Input() widget;
  @Input() resizeEvent: EventEmitter<any>;
  @Input() updateTimeEvent: EventEmitter<any>;

  @Input() serieList: Serie[];

  updateTimeSubsription: Subscription;
  resizeSubsription: Subscription;

  myChartData: Array<Array<any>>;
  myColumnNames: string[];

  constructor(private dataService: DataService) {
    dataService.updateChartDataEvent.subscribe(value => {
      if (value.widget == this.widget) {
        console.log("GaugeFrameComponent updateChartDataEvent(value): value = ", value);

        let realValue: number = Number(value.ChartData[value.ChartData.length-1][1].toFixed(2));
       
        this.myChartData = [ ['Waarde', realValue] ];
      }
    });
  }

  ngOnInit() {
    console.log("GaugeFrameComponent ngOnInit");
    if (this.updateTimeEvent != undefined) {
      this.updateTimeSubsription = this.updateTimeEvent.subscribe((event) => {
        console.log("GaugeFrameComponent updateTimeEvent event started from ngOnInit");
        console.log("GaugeFrameComponent updateTimeEvent startTime: ", event.startTime);
        console.log("GaugeFrameComponent updateTimeEvent endTime: ", event.endTime);

        this.loadData();
      });
    }

    this.serieList = this.widget.serieList;
  }

  public ngAfterViewInit() {
    /*this.RedrawChart();*/

    console.log("GaugeFrameComponent ngAfterViewInit()");
    if (this.resizeEvent != undefined) {
      this.resizeSubsription = this.resizeEvent.subscribe((event) => {

        console.log("GaugeFrameComponent Resize event", event);
        if (event.gridsterItem === this.widget) {
          console.log("GaugeFrameComponent Resize event");
          console.log("GaugeFrameComponent gridsterItem: ", event.gridsterItem);
          console.log("GaugeFrameComponent gridsterItemComponent: ", event.gridsterItemComponent);

          this.loadData();
        }
      });
    }
  }

  loadData() {
    console.log("GaugeFrameComponent loadData()");
    this.dataService.GetData(this.widget, 1, this.serieList[0].StartTime, this.serieList[0].EndTime, this.serieList);
  }  

  ngOnDestroy() {
    console.log("GaugeFrameComponent ngOnDestroy()");
    if (this.updateTimeSubsription != undefined) this.updateTimeSubsription.unsubscribe();
  }

  showData() {
    return (this.myChartData != undefined);
  }

  lastTime() {
    return this.timeToStr(this.myChartData[this.myChartData.length-1][0]);
  }

  lastValue() {
    /*let value: number = Math.trunc( this.myChartData[this.myChartData.length-1][1] * 100);*/
    /*return value / 100;*/
    return this.myChartData[this.myChartData.length-1][1].toFixed(2);
  }

  padZeroes(input: number, length: number) {
    return String("0").repeat(Math.abs(length - input.toString().length)) + input.toString();
  }

  timeToStr(time: Date): string {
    return this.padZeroes(time.getDate(), 2) + '/' + this.padZeroes((time.getMonth() + 1), 2) + '/' + time.getFullYear() + ' ' + this.padZeroes(time.getHours(), 2) + ':' + this.padZeroes(time.getMinutes(), 2) + ':' + this.padZeroes(time.getSeconds(), 2);
  }  }
