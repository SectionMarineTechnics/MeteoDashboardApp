import { Injectable, EventEmitter } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class GoogleChartsBaseService {
  public readyEvent: EventEmitter<any> = new EventEmitter();

  chartMap: Map<string, Object>;

  constructor() { 
    google.charts.load('current', {'packages':['corechart']});
    this.chartMap = new Map<string, Object>();
  }

  protected buildChart(data: any[], chartFunc: any, options: any, elementId: string) : void {
    var func = (chartFunc, options) => {
      console.log("GoogleChartsBaseService draw()", this.chartMap);
      
      


    var myChart;
    if(this.chartMap.has(elementId))
    {  
      if(!document.getElementById(elementId).hasChildNodes())
      {
        myChart = chartFunc();
        this.chartMap.set(elementId, myChart);
        console.log("GoogleChartsBaseService buildChart: elementId has no child nodes ==> created new LineChart");
      }
      else
      {
        myChart = this.chartMap.get(elementId);
        console.log("GoogleChartsBaseService buildChart: reused existing LineChart");
      }
    }
    else
    {
      myChart = chartFunc();
      this.chartMap.set(elementId, myChart);
      console.log("GoogleChartsBaseService buildChart: created new LineChart");
    }
      
      
      /*var myChart = chartFunc();*/
      
      
      
      google.visualization.events.addListener(myChart, 'ready', this.readyhandler.bind(this));
      
      var datatable = google.visualization.arrayToDataTable(data);
      myChart.draw(datatable, options);
    };   
    var callback = () => func(chartFunc, options);
    google.charts.setOnLoadCallback(callback);
  }

  public readyhandler() {
    console.log("GoogleChartsBaseService readyNotifyEvent.emit()");
    this.readyEvent.emit();
  }
}
