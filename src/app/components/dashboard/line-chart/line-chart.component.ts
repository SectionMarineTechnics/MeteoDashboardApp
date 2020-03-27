import { Component, OnInit, OnDestroy, AfterViewInit, Input, EventEmitter, Output } from '@angular/core';
import { LineChartConfig } from 'src/app/models/LineChartConfig';
import { GoogleLineChartService } from 'src/app/services/google-line-chart.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'line-chart',
  templateUrl: './line-chart.component.html',
  styleUrls: ['./line-chart.component.css']
})
export class LineChartComponent implements OnInit {

  @Input() data: any[];
  @Input() config: LineChartConfig;
  @Input() elementId: string;
  
  @Input() resizeEvent: EventEmitter<any>;
  @Input() updateEvent: EventEmitter<any>;
  @Output() readyNotifyEvent: EventEmitter<any> = new EventEmitter();

  readyEvent: EventEmitter<any>;

  resizeSubsription: Subscription;
  updateSubsription: Subscription;
  readySubsription: Subscription;

  constructor(private _lineChartService: GoogleLineChartService) { 
    this.readyEvent = this._lineChartService.readyEvent;
  }

  ngOnInit() {
  }

  ngAfterViewInit() {
    if (this.resizeEvent != undefined) {
      this.resizeSubsription = this.resizeEvent.subscribe((event) => {
        console.log("resizeEvent: Width: " + event.newWidth + " Height: " + event.newHeight);
          this.config.width = event.newWidth;
          this.config.height = event.newHeight;
          this.redraw();
      });
    }    
    if (this.updateEvent != undefined) {
      this.updateSubsription = this.updateEvent.subscribe((event) => {
          this.data = event;
          this.redraw();
      });
    }   
    if (this.readyEvent != undefined) {
      this.readySubsription = this.readyEvent.subscribe((event) => {
        /*console.log("LineChartComponent readyNotifyEvent.emit()");*/
        this.readyNotifyEvent.emit();
      });
    }     
  }

  ngOnDestroy() {
    console.log("LineChartComponent ngOnDestroy()");
    if (this.readySubsription != undefined) this.readySubsription.unsubscribe();
    if (this.resizeSubsription != undefined) this.resizeSubsription.unsubscribe();
    if (this.updateSubsription != undefined) this.updateSubsription.unsubscribe();
  }

  public redraw() {
    console.log("LineChartComponent redraw");
    this._lineChartService.BuildLineChart(this.elementId, this.data, this.config); 
  }

}
