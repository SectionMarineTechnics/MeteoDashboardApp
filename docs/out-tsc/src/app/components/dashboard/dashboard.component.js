import * as tslib_1 from "tslib";
import { Component, EventEmitter } from '@angular/core';
let DashboardComponent = class DashboardComponent {
    constructor(layoutService) {
        this.layoutService = layoutService;
        this.resizeEvent = new EventEmitter();
        this.itemResize = (gridsterItem, gridsterItemComponent) => {
            this.resizeEvent.emit({ gridsterItem, gridsterItemComponent });
        };
        this.ChangeCallback = (gridsterItem, gridsterItemComponent) => {
            this.layoutService.ChangeCallback(gridsterItem, gridsterItemComponent);
        };
    }
    get options() {
        return this.layoutService.options;
    }
    get layout() {
        return this.layoutService.layout;
    }
    get components() {
        return this.layoutService.components;
    }
    ngOnInit() {
        this.layoutService.options.itemResizeCallback = this.itemResize;
        this.layoutService.options.itemChangeCallback = this.ChangeCallback;
        this.updateTimeEvent = this.layoutService.updateTimeEvent;
    }
    ngOnDestroy() {
        //this.currentUserSubscription.unsubscribe();
    }
};
DashboardComponent = tslib_1.__decorate([
    Component({
        selector: 'app-dashboard',
        templateUrl: './dashboard.component.html',
        styleUrls: ['./dashboard.component.css']
    })
], DashboardComponent);
export { DashboardComponent };
//# sourceMappingURL=dashboard.component.js.map