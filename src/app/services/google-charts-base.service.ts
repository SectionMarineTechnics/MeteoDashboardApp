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
      /*console.log("GoogleChartsBaseService draw()", this.chartMap);*/
      
      


    var myChart;
    if(this.chartMap.has(elementId))
    {  
      if(!document.getElementById(elementId).hasChildNodes())
      {
        myChart = chartFunc();
        this.chartMap.set(elementId, myChart);
        /*console.log("GoogleChartsBaseService buildChart: elementId has no child nodes ==> created new LineChart");*/
      }
      else
      {
        myChart = this.chartMap.get(elementId);
        /*console.log("GoogleChartsBaseService buildChart: reused existing LineChart");*/
      }
    }
    else
    {
      myChart = chartFunc();
      this.chartMap.set(elementId, myChart);
      /*console.log("GoogleChartsBaseService buildChart: created new LineChart");*/
    }
      
      google.visualization.events.addListener(myChart, 'ready', this.readyhandler.bind(this));
      
      /*var datatable = google.visualization.arrayToDataTable(data);*/
      var datatable = new google.visualization.DataTable();
      datatable.addColumn('date', data[0][0]);
      for(let columnIndex = 1; columnIndex < data[0].length; columnIndex++)
      {
        datatable.addColumn('number', data[0][columnIndex]);
      }

      for(let rowIndex = 1; rowIndex < data.length; rowIndex++)
      {
        var dataRow = data[rowIndex];

        for(let columnIndex = 1; columnIndex < dataRow.length; columnIndex++)
        {
          if(dataRow[columnIndex] == -9999 || dataRow[columnIndex] == -999) dataRow[columnIndex] = null;
        }

        datatable.addRow(dataRow);
      }

      var formatter = new google.visualization.DateFormat({pattern: 'dd/MM/YYYY HH:mm'});
      formatter.format(datatable, 0);


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
