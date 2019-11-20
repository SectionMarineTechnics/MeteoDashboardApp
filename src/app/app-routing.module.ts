import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { DashboardComponent } from './components/dashboard/dashboard.component';
import { WeatherComponent } from './components/weather/weather.component';
import { SourceSelectorComponent } from './components/source-selector/source-selector.component';
import { UserProfileComponent } from './components/user-profile/user-profile.component';

const routes: Routes = [
  { path: '', component: DashboardComponent/*, canActivate: [AuthGuard]*/ },
  { path: 'SourceSelector/:id', component: SourceSelectorComponent },
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
