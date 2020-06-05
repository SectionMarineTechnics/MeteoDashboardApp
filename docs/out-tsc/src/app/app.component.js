import * as tslib_1 from "tslib";
import { Component } from '@angular/core';
let AppComponent = class AppComponent {
    constructor(auth) {
        this.auth = auth;
        this.title = 'MeteoDashboardApp';
    }
    ngOnInit() {
        this.auth.localAuthSetup();
        this.auth.handleAuthCallback();
    }
};
AppComponent = tslib_1.__decorate([
    Component({
        selector: 'app-root',
        templateUrl: './app.component.html',
        styleUrls: ['./app.component.css']
    })
], AppComponent);
export { AppComponent };
//# sourceMappingURL=app.component.js.map