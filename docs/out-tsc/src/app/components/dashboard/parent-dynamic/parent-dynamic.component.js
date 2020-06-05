import * as tslib_1 from "tslib";
import { Component, Input } from '@angular/core';
let ParentDynamicComponent = class ParentDynamicComponent {
    constructor() { }
    ngOnInit() {
    }
};
tslib_1.__decorate([
    Input()
], ParentDynamicComponent.prototype, "widget", void 0);
tslib_1.__decorate([
    Input()
], ParentDynamicComponent.prototype, "resizeEvent", void 0);
tslib_1.__decorate([
    Input()
], ParentDynamicComponent.prototype, "updateTimeEvent", void 0);
ParentDynamicComponent = tslib_1.__decorate([
    Component({
        selector: 'app-parent-dynamic',
        templateUrl: './parent-dynamic.component.html',
        styleUrls: ['./parent-dynamic.component.css']
    })
], ParentDynamicComponent);
export { ParentDynamicComponent };
//# sourceMappingURL=parent-dynamic.component.js.map