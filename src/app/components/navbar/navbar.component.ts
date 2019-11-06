import { Component, OnInit, EventEmitter } from '@angular/core';
import { GridsterLayoutService } from 'src/app/services/gridster-layout.service';
import { timer } from 'rxjs';
import { FormControl } from '@angular/forms';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {
  startTime: Date = new Date(2019, 8, 26, 0, 0, 0);
  endTime: Date = new Date(2019, 8, 28, 0, 0, 0);
  timeIntervals: String[] = [ "Custom", "2 hours", "4 hours" ];

  updateTimeEvent: EventEmitter<any> = new EventEmitter();

  constructor(public layoutService: GridsterLayoutService, public auth: AuthService) { }

  ngOnInit() {
    const source = timer( 1000, 1000);
    //const subscribe = source.subscribe(val => this.refreshTimer(val));    
  }

  goBackward(){
    let timeDiff = (this.endTime.getTime() - this.startTime.getTime());
    this.startTime = new Date(this.startTime.getTime() - timeDiff);
    this.endTime = new Date(this.endTime.getTime() - timeDiff);
    this.updateTime();
  }  

  goForward(){
    let timeDiff = (this.endTime.getTime() - this.startTime.getTime());
    this.startTime = new Date(this.startTime.getTime() + timeDiff);
    this.endTime = new Date(this.endTime.getTime() + timeDiff);
    this.updateTime();
  }

  zoomIn(){
    let timeDiff = (this.endTime.getTime() - this.startTime.getTime());
    this.startTime = new Date(this.startTime.getTime() + timeDiff/4);
    this.endTime = new Date(this.endTime.getTime() - timeDiff/4);
    this.startTime.setSeconds(0);
    this.endTime.setSeconds(0);
    this.updateTime();
  }

  zoomOut(){
    let timeDiff = (this.endTime.getTime() - this.startTime.getTime());
    this.startTime = new Date(this.startTime.getTime() - timeDiff/2);
    this.endTime = new Date(this.endTime.getTime() + timeDiff/2);
    this.startTime.setSeconds(0);
    this.endTime.setSeconds(0);
    this.updateTime();
  }

  updateTime() {
    let startTime = this.startTime;
    let endTime = this.endTime;
    this.updateTimeEvent.emit( {startTime, endTime} );
  }  

  refreshTimer(val: number){
    console.log("refreshTimer: ", val);

    let currentTime: Date = new Date();
    let timeDiff = (this.endTime.getTime() - this.startTime.getTime());
    let timeOffsetMinutes = (currentTime.getTime() - this.endTime.getTime()) / 1000 / 60;

    console.log("currentTime: ", currentTime);
    console.log("timeDiff: ", timeDiff);
    console.log("timeOffsetMinutes: ", timeOffsetMinutes);

    if( timeOffsetMinutes >= 1){
      currentTime.setSeconds(0, 0);

      console.log("Update Time range: ");
      console.log("adjusted currentTime: ", currentTime);

      this.endTime = new Date(currentTime.getTime());
      this.startTime = new Date(this.endTime.getTime() - timeDiff);

      console.log("New start time: ", this.startTime);
      console.log("New end time: ", this.endTime);
      this.updateTime();    
    }
  }

  timeToStr(time: Date): string{
    return this.padZeroes(time.getUTCDate(),2) + '/' + this.padZeroes((time.getUTCMonth() + 1),2) + '/' + time.getUTCFullYear() + ' ' + this.padZeroes(time.getUTCHours(),2) + ':' + this.padZeroes(time.getUTCMinutes(),2) + ':' + this.padZeroes(time.getUTCSeconds(), 2); 
  }

  padZeroes(input: number, length: number)
  {
    return String("0").repeat(Math.abs(length - input.toString().length)) + input.toString();
  }  

}
