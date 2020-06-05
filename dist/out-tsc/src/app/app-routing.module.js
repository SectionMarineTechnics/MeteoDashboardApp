import * as tslib_1 from "tslib";
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { WeatherComponent } from './components/weather/weather.component';
import { SourceSelectorComponent } from './components/source-selector/source-selector.component';
const routes = [
    { path: '', component: DashboardComponent /*, canActivate: [AuthGuard]*/ },
    { path: 'SourceSelector/:id', component: SourceSelectorComponent },
    { path: 'Dashboard', component: DashboardComponent /*, canActivate: [AuthGuard]*/ },
    { path: 'Weather', component: WeatherComponent /*, canActivate: [AuthGuard]*/ },
    { path: 'login', component: WeatherComponent },
    { path: 'register', component: WeatherComponent },
    { path: 'profile', component: WeatherComponent /*, canActivate: [AuthGuard]*/ },
    // otherwise redirect to Dashboard
    { path: '**', redirectTo: '' }
];
let AppRoutingModule = class AppRoutingModule {
};
AppRoutingModule = tslib_1.__decorate([
    NgModule({
        imports: [RouterModule.forRoot(routes)],
        exports: [RouterModule]
    })
], AppRoutingModule);
export { AppRoutingModule };
//# sourceMappingURL=app-routing.module.js.map