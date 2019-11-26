import { Component, OnInit, Input, EventEmitter, OnDestroy, AfterViewInit } from '@angular/core';
import { Serie } from 'src/app/models/Serie';
import { Subscription } from 'rxjs';
import { DataService } from 'src/app/services/data.service';

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

  myChartData: Array<Array<any>>;
  myColumnNames: string[];

  constructor(private dataService: DataService) {
    dataService.updateChartDataEvent.subscribe(value => {
      if (value.widget == this.widget) {
        console.log("TableFrameComponent updateChartDataEvent(value): value = ", value);
        this.myChartData = value.ChartData;
        this.myColumnNames = value.ColumnNames;
      }
    });
  }

  ngOnInit() {
    console.log("TableFrameComponent ngOnInit");
    if (this.updateTimeEvent != undefined) {
      this.updateTimeSubsription = this.updateTimeEvent.subscribe((event) => {
        console.log("TableFrameComponent updateTimeEvent event started from ngOnInit");
        console.log("TableFrameComponent updateTimeEvent startTime: ", event.startTime);
        console.log("TableFrameComponent updateTimeEvent endTime: ", event.endTime);

        this.loadData();
      });

      this.serieList = this.widget.serieList;
    }
  }

  ngAfterViewInit() {
    /*this.RedrawChart();*/

    console.log("TableFrameComponent ngAfterViewInit()");
    if (this.resizeEvent != undefined) {
      this.resizeSubsription = this.resizeEvent.subscribe((event) => {

        console.log("ValueFramTableFrameComponenteComponent Resize event", event);
        if (event.gridsterItem === this.widget) {
          console.log("TableFrameComponent Resize event");
          console.log("TableFrameComponent gridsterItem: ", event.gridsterItem);
          console.log("TableFrameComponent gridsterItemComponent: ", event.gridsterItemComponent);

          this.loadData();
        }
      });
    }
  }

  loadData() {
    console.log("TableFrameComponent loadData()");
    this.dataService.GetData(this.widget, 1, this.serieList[0].StartTime, this.serieList[0].EndTime, this.serieList);
  }

  ngOnDestroy() {
    console.log("ValueComponent ngOnDestroy()");
    if (this.updateTimeSubsription != undefined) this.updateTimeSubsription.unsubscribe();
  }

  showData() {
    return (this.myChartData != undefined);
  }
}
