import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';

import { GridsterModule } from 'angular-gridster2';

import { NavbarComponent } from './components/navbar/navbar.component';

import { FlexLayoutModule } from '@angular/flex-layout';

import { MatMenuModule } from '@angular/material/menu'
import { MatToolbarModule } from '@angular/material/toolbar'
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatListModule } from '@angular/material/list';
import { MatSelectModule } from '@angular/material/select';

import { MatFormFieldModule } from '@angular/material/form-field';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatInputModule  } from '@angular/material/input';
import { MatProgressSpinnerModule  } from '@angular/material/progress-spinner';

import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';

import { MatTableModule } from '@angular/material/table';

import { MatDatepickerModule } from '@angular/material/datepicker';

import { MatTooltipModule } from '@angular/material/tooltip';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { WeatherComponent } from './components/weather/weather.component';
import { ParentDynamicComponent } from './components/dashboard/parent-dynamic/parent-dynamic.component';
import { TimeSeriesChartComponent } from './components/frames/time-series-chart/time-series-chart.component';
import { InterceptorService } from './services/interceptor.service';

import { SettingsService } from './services/settings.service';
import { AuthService } from './services/auth.service';
import { GridsterLayoutService } from './services/gridster-layout.service';

import { GoogleChartsModule } from 'angular-google-charts';
import { SourceSelectorComponent } from './components/source-selector/source-selector.component';
import { UserProfileComponent } from './components/user-profile/user-profile.component';
import { TimeSelectorComponent } from './components/time-selector/time-selector.component';
import { MatMomentDateModule } from '@angular/material-moment-adapter';
import { PageSelectorComponent } from './components/page-selector/page-selector.component';

import { DragDropModule } from '@angular/cdk/drag-drop';
import { ValueFrameComponent } from './components/frames/value-frame/value-frame.component';
import { TableFrameComponent } from './components/frames/table-frame/table-frame.component';
import { GaugeFrameComponent } from './components/frames/gauge-frame/gauge-frame.component';
import { LineChartComponent } from './components/dashboard/line-chart/line-chart.component';

import { AngularResizedEventModule } from 'angular-resize-event';

@NgModule({
  declarations: [
    AppComponent,
    NavbarComponent,
    DashboardComponent,
    WeatherComponent,
    ParentDynamicComponent,
    TimeSeriesChartComponent,
    SourceSelectorComponent,
    UserProfileComponent,
    TimeSelectorComponent,
    PageSelectorComponent,
    ValueFrameComponent,
    TableFrameComponent,
    GaugeFrameComponent,
    LineChartComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    ReactiveFormsModule,    
    BrowserAnimationsModule,
    HttpClientModule,
    GridsterModule, 
    MatMenuModule,
    MatToolbarModule,
    MatSidenavModule,
    MatListModule,
    MatSelectModule,
    MatFormFieldModule,
    MatAutocompleteModule,
    MatInputModule,
    MatProgressSpinnerModule,
    MatIconModule,
    MatButtonModule,
    MatTableModule,

    MatDatepickerModule,
    MatMomentDateModule,

    MatTooltipModule,    
    FlexLayoutModule,
    GoogleChartsModule.forRoot(),
    DragDropModule,

    AngularResizedEventModule
  ],
  providers: [ SettingsService, AuthService, GridsterLayoutService,
    { provide: HTTP_INTERCEPTORS, useClass: InterceptorService, multi: true },
   ],
  bootstrap: [AppComponent]
})
export class AppModule { }
