import { Injectable, EventEmitter } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class GoogleChartsBaseService {
  public readyEvent: EventEmitter<any> = new EventEmitter();

  constructor() { 
    google.charts.load('current', {'packages':['corechart']});
  }

  protected buildChart(data: any[], chartFunc: any, options: any) : void {
    var func = (chartFunc, options) => {
      /*console.log("GoogleChartsBaseService draw()");*/
      var myChart = chartFunc();
      google.visualization.events.addListener(myChart, 'ready', this.readyhandler.bind(this));
      
      var datatable = google.visualization.arrayToDataTable(data);
      myChart.draw(datatable, options);
    };   
    var callback = () => func(chartFunc, options);
    google.charts.setOnLoadCallback(callback);
  }

  public readyhandler() {
    /*console.log("GoogleChartsBaseService readyNotifyEvent.emit()");*/
    this.readyEvent.emit();
  }
}
