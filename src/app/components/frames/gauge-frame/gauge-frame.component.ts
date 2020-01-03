import { Component, OnInit, Input, EventEmitter, ViewChild, OnDestroy, AfterViewInit } from '@angular/core';
import { Serie } from 'src/app/models/Serie';
import { Subscription } from 'rxjs';
import { DataService } from 'src/app/services/data.service';
import { GoogleChartComponent } from 'angular-google-charts';

@Component({
  selector: 'app-gauge-frame',
  templateUrl: './gauge-frame.component.html',
  styleUrls: ['./gauge-frame.component.css']
})
export class GaugeFrameComponent implements OnInit, OnDestroy, AfterViewInit {
  @Input() widget;
  @Input() resizeEvent: EventEmitter<any>;
  @Input() updateTimeEvent: EventEmitter<any>;

  @Input() serieList: Serie[];

  updateTimeSubsription: Subscription;
  resizeSubsription: Subscription;

  myChartData: Array<Array<any>>;
  myColumnNames: string[];

  realValue: number = 0;

  private chartHandle: GoogleChartComponent;

  @ViewChild('GoogleChart', { static: false }) set content(content: GoogleChartComponent) {
    this.chartHandle = content;
  }

  constructor(private dataService: DataService) {
    dataService.updateChartDataEvent.subscribe(value => {
      if (value.widget == this.widget) {
        /*console.log("GaugeFrameComponent updateChartDataEvent(value): value = ", value);*/

        this.realValue = Number(value.ChartData[value.ChartData.length-1][1].toFixed(2));
       
        /*this.myChartData = [ ['Waarde', realValue] ];*/
        this.drawChart();
      }
    });
  }

  public chartReady(chart: GoogleChartComponent) {
    /*console.log("chartReady");*/
    chart.dynamicResize = true;
    let element:HTMLElement = chart.getChartElement();
    element.addEventListener('onresize', function(){
      console.log("chart resize event");
    });
  }

  drawChart(){
    /*console.log("GaugeFrameComponent drawChart");*/
    this.myChartData = [ ['Waarde', this.realValue] ];
  }

  ngOnInit() {
    /*console.log("GaugeFrameComponent ngOnInit");*/
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

  ngOnDestroy() {
    console.log("GaugeFrameComponent ngOnDestroy()");
    if (this.updateTimeSubsription != undefined) this.updateTimeSubsription.unsubscribe();
    if (this.resizeSubsription != undefined) this.resizeSubsription.unsubscribe();
    /*if (this.dataService.updateChartDataEvent != undefined) this.dataService.updateChartDataEvent.unsubscribe();*/
  }  

  public ngAfterViewInit() {
    /*this.RedrawChart();*/

    console.log("GaugeFrameComponent ngAfterViewInit()");
    if (this.resizeEvent != undefined) {
      this.resizeSubsription = this.resizeEvent.subscribe((event) => {

        /*console.log("GaugeFrameComponent Resize event", event);*/
        if (event.gridsterItem === this.widget) {
          /*console.log("GaugeFrameComponent Resize event");*/
          /*console.log("GaugeFrameComponent gridsterItem: ", event.gridsterItem);*/
          /*console.log("GaugeFrameComponent gridsterItemComponent: ", event.gridsterItemComponent);*/

          this.loadData();

          /*this.chartHandle.wrapper.draw(this.chartHandle.getChartElement());          */
          /*
          window.dispatchEvent(new Event('resize'));
          setTimeout(() => {
            window.dispatchEvent(new Event('resize'))
          }, 1000);*/
        }
      });
    }
  }

  loadData() {
    /*console.log("GaugeFrameComponent loadData()");*/

    if (this.serieList.length > 0) {

      /*
      this.chartHandle.options = {
        dynamicResize: true,
        chart: {
          title: 'Luchtdruk waarde'
        },
        width: '100%', height: '100%',
        chartArea: {
          left: 5,
          right: 5,
          bottom: 5,
          top: 5,
          width: "100%",
          height: "100%"
        },
      }
      */
      this.dataService.GetData(this.widget, 1, this.serieList[0].StartTime, this.serieList[0].EndTime, this.serieList);
    }
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
  }  
}
