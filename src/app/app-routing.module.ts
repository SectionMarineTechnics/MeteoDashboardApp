import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { DashboardComponent } from './components/dashboard/dashboard.component';
import { WeatherComponent } from './components/weather/weather.component';
import { SourceSelectorComponent } from './components/source-selector/source-selector.component';
import { TimeSelectorComponent } from './components/time-selector/time-selector.component';
import { UserProfileComponent } from './components/user-profile/user-profile.component';
import { PageSelectorComponent } from './components/page-selector/page-selector.component';
import { DisclaimerComponent } from './components/disclaimer/disclaimer.component';

const routes: Routes = [
  { path: '', component: DashboardComponent/*, canActivate: [AuthGuard]*/ },
  { path: 'SourceSelector/:id', component: SourceSelectorComponent },
  { path: 'TimeSelector', component: TimeSelectorComponent },
  { path: 'Disclaimer', component: DisclaimerComponent },
  { path: 'PageSettings', component: PageSelectorComponent },
  { path: 'Dashboard', component: DashboardComponent/*, canActivate: [AuthGuard]*/ },
  { path: 'Weather', component: WeatherComponent/*, canActivate: [AuthGuard]*/ },
  { path: 'login', component: WeatherComponent },
  { path: 'register', component: WeatherComponent },
  { path: 'profile', component: UserProfileComponent/*, canActivate: [AuthGuard]*/ },


  // otherwise redirect to Dashboard
  { path: '**', redirectTo: '' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
