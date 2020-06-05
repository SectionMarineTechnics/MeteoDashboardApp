import * as tslib_1 from "tslib";
import { Component } from '@angular/core';
import { timer } from 'rxjs';
let NavbarComponent = class NavbarComponent {
    constructor(layoutService, auth, router) {
        this.layoutService = layoutService;
        this.auth = auth;
        this.router = router;
        this.timeIntervals = ["Custom", "2 hours", "4 hours"];
    }
    ngOnInit() {
        const source = timer(1000, 1000);
        //const subscribe = source.subscribe(val => this.refreshTimer(val));
    }
    isDashboardView() {
        // return true if the current page is home
        //console.log("isDashboardView(): ", this.router.url);
        return this.router.url.match('^/$') || this.router.url.match('^/Dashboard$');
    }
};
NavbarComponent = tslib_1.__decorate([
    Component({
        selector: 'app-navbar',
        templateUrl: './navbar.component.html',
        styleUrls: ['./navbar.component.css']
    })
], NavbarComponent);
export { NavbarComponent };
//# sourceMappingURL=navbar.component.js.map