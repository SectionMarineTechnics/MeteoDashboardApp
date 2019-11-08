import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { DashboardComponent } from './components/dashboard/dashboard.component';
import { WeatherComponent } from './components/weather/weather.component';

const routes: Routes = [
  { path: '', component: DashboardComponent/*, canActivate: [AuthGuard]*/ },
  { path: 'Dashboard', component: DashboardComponent/*, canActivate: [AuthGuard]*/ },
  { path: 'Weather', component: WeatherComponent/*, canActivate: [AuthGuard]*/ },
  { path: 'login', component: WeatherComponent },
  { path: 'register', component: WeatherComponent },
  { path: 'profile', component: WeatherComponent/*, canActivate: [AuthGuard]*/ },

  // otherwise redirect to Dashboard
  { path: '**', redirectTo: '' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
