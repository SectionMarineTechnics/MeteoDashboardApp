import * as tslib_1 from "tslib";
import { Component, Input, ViewChild } from '@angular/core';
import { Subject } from 'rxjs';
import { Lspi } from 'src/app/models/Lspi';
let TimeSeriesChartComponent = class TimeSeriesChartComponent {
    constructor(dataService) {
        this.dataService = dataService;
        this._onDestroy = new Subject();
        this.loading = true;
        this.gridsterItemComponent_height = 0;
        this.gridsterItemComponent_width = 0;
        dataService.updateChartDataEvent.subscribe(value => this.updateChart(value));
        this.chartTitle = "Waterstand";
        this.chartSubTitle = "(Locatie Seastar, cm)";
        this.myChartData = [];
        this.myChartData.push([0, 0]);
        this.myColumnNames = ["time", "var"];
        let lspiList = [];
    }
    set content(content) {
        this.chartHandle = content;
    }
    ngOnInit() {
        if (this.updateTimeEvent != undefined) {
            this.updateTimeSubsription = this.updateTimeEvent.subscribe((event) => {
                console.log("updateTimeEvent event");
                console.log("updateTimeEvent startTime: ", event.startTime);
                console.log("updateTimeEvent endTime: ", event.endTime);
            });
        }
        let lspiList = [];
        this.serieList = this.widget.serieList;
        this.serieList.forEach((serie, index) => {
            lspiList.push(serie.Lspi);
        });
    }
    ngAfterViewInit() {
        /*this.RedrawChart();*/
        console.log("ngAfterViewInit() Resize event: ", this.resizeEvent);
        if (this.resizeEvent != undefined) {
            this.resizeSubsription = this.resizeEvent.subscribe((event) => {
                if (event.gridsterItem === this.widget) {
                    console.log("Resize event");
                    console.log("gridsterItem: ", event.gridsterItem);
                    console.log("gridsterItemComponent: ", event.gridsterItemComponent);
                    const wrapper = this.chartHandle.wrapper;
                    this.gridsterItemComponent_height = event.gridsterItemComponent.height;
                    this.gridsterItemComponent_width = event.gridsterItemComponent.width;
                    this.loadData();
                }
            });
        }
        if (this.updateTimeEvent != undefined) {
            this.updateTimeSubsription = this.updateTimeEvent.subscribe((event) => {
                /*if (event.gridsterItem === this.widget) { */
                console.log("updateTimeEvent event");
                console.log("updateTimeEvent startTime: ", event.startTime);
                console.log("updateTimeEvent endTime: ", event.endTime);
                let update = false;
                this.serieList.forEach((element, index) => {
                    if (element.StartTime = event.startTime) {
                        element.StartTime = event.startTime;
                        update = true;
                    }
                    if (element.EndTime = event.endTime) {
                        element.EndTime = event.endTime;
                        update = true;
                    }
                });
                if (update) {
                    this.loadData();
                }
                /*console.log("gridsterItem: ", event.gridsterItem);
                console.log("gridsterItemComponent: ", event.gridsterItemComponent);*/
                /*}*/
            });
        }
        console.log("ngAfterViewInit: this.chartHandle: ", this.chartHandle);
        this.dataService.getLSPIList()
            .then(_ => (this.loading = false))
            .then(result => {
            this.setInitialValue();
        });
        //this.loadData(0);
    }
    setInitialValue() {
    }
    ngOnDestroy() {
        if (this.updateTimeSubsription != undefined)
            this.updateTimeSubsription.unsubscribe();
    }
    updateChart(value) {
        if (value.widget == this.widget) {
            this.myChartData = value.ChartData;
            this.myColumnNames = value.ColumnNames;
        }
    }
    loadData() {
        /*this.chart.instance.showLoadingIndicator();*/
        let firstCall = true;
        let combinedFrame;
        let headerHeight = 100;
        console.log("this.widget.cols; ", this.widget.cols);
        console.log("this.widget.rows; ", this.widget.rows);
        this.chartHandle.options = { title: 'TestBed', width: '100%', height: '100%', chartArea: { width: 'auto', height: 'auto' }, curveType: 'none', legend: { position: 'none' } };
        if (this.gridsterItemComponent_height != 0) {
            this.chartHandle.options.height = this.gridsterItemComponent_height - headerHeight;
        }
        if (this.gridsterItemComponent_width != 0) {
            this.chartHandle.options.width = this.gridsterItemComponent_width;
        }
        this.chartHandle.dynamicResize = true;
        if (this.serieList != undefined && this.serieList.length > 0) {
            this.dataService.GetData(this.widget, 1, this.serieList[0].StartTime, this.serieList[0].EndTime, this.serieList);
        }
    }
    RedrawChart() {
        console.log("this.myChartData: ", this.myChartData);
        console.log("this.myColumnNames: ", this.myColumnNames);
        console.log("this.dataService.lspis: ", this.dataService.lspis);
        console.log("this.loading: ", this.loading);
    }
    GetDataTest() {
        let lspiList = new Array();
        lspiList.push(new Lspi("OKG", "VL1", "WS0", 10));
        /*lspiList.push( new Lspi("NPT","VL1","WS0",10));
        lspiList.push( new Lspi("ZLD","VL1","WS0",10));*/
        this.dataService.getDataFrameWithLspiList(0, new Date(2019, 8, 26, 0, 0, 0), new Date(2019, 8, 28, 0, 0, 0), lspiList);
    }
};
tslib_1.__decorate([
    Input()
], TimeSeriesChartComponent.prototype, "widget", void 0);
tslib_1.__decorate([
    Input()
], TimeSeriesChartComponent.prototype, "resizeEvent", void 0);
tslib_1.__decorate([
    Input()
], TimeSeriesChartComponent.prototype, "updateTimeEvent", void 0);
tslib_1.__decorate([
    Input()
], TimeSeriesChartComponent.prototype, "serieList", void 0);
tslib_1.__decorate([
    Input()
], TimeSeriesChartComponent.prototype, "title", void 0);
tslib_1.__decorate([
    Input()
], TimeSeriesChartComponent.prototype, "chartTitle", void 0);
tslib_1.__decorate([
    Input()
], TimeSeriesChartComponent.prototype, "chartSubTitle", void 0);
tslib_1.__decorate([
    ViewChild('GoogleChart', { static: false })
], TimeSeriesChartComponent.prototype, "content", null);
TimeSeriesChartComponent = tslib_1.__decorate([
    Component({
        selector: 'app-time-series-chart',
        templateUrl: './time-series-chart.component.html',
        styleUrls: ['./time-series-chart.component.css']
    })
], TimeSeriesChartComponent);
export { TimeSeriesChartComponent };
//# sourceMappingURL=time-series-chart.component.js.map