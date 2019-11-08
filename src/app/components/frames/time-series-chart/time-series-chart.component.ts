import { Component, OnInit, Input, EventEmitter, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { DataService } from 'src/app/services/data.service';

@Component({
  selector: 'app-time-series-chart',
  templateUrl: './time-series-chart.component.html',
  styleUrls: ['./time-series-chart.component.css']
})
export class TimeSeriesChartComponent implements OnInit, OnDestroy {
  @Input() widget;
  @Input() resizeEvent: EventEmitter<any>;
  @Input() updateTimeEvent: EventEmitter<any>;  
  updateTimeSubsription: Subscription;

  constructor(private dataService: DataService ) { }

  ngOnInit() {
    if(this.updateTimeEvent != undefined){
      this.updateTimeSubsription = this.updateTimeEvent.subscribe((event) => {
          console.log("updateTimeEvent event");
          console.log("updateTimeEvent startTime: ", event.startTime);
          console.log("updateTimeEvent endTime: ", event.endTime);
      });    
    } 
  }

  ngOnDestroy() {
    if(this.updateTimeSubsription != undefined) this.updateTimeSubsription.unsubscribe();
  }    

}
