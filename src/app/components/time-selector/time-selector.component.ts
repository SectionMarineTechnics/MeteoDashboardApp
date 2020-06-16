import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { GridsterLayoutService } from 'src/app/services/gridster-layout.service';
import { FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';
import { MAT_DATE_LOCALE, DateAdapter, MAT_DATE_FORMATS } from '@angular/material/core';
import { MomentDateAdapter, MAT_MOMENT_DATE_FORMATS, MAT_MOMENT_DATE_ADAPTER_OPTIONS } from '@angular/material-moment-adapter';
import { Moment } from 'moment';

@Component({
  selector: 'app-time-selector',
  templateUrl: './time-selector.component.html',
  styleUrls: ['./time-selector.component.css'],
  providers: [  { provide: MAT_DATE_LOCALE, useValue: 'nl-BE' },   
                { provide: DateAdapter, useClass: MomentDateAdapter, deps: [MAT_DATE_LOCALE, MAT_MOMENT_DATE_ADAPTER_OPTIONS] },
                { provide: MAT_MOMENT_DATE_FORMATS, useValue: MAT_MOMENT_DATE_FORMATS} ]
})
export class TimeSelectorComponent implements OnInit {
  timeInfo_form: FormGroup;

  constructor(private _adapter: DateAdapter<any>, private layoutService: GridsterLayoutService, private formBuilder: FormBuilder, private router: Router) {
    this._adapter.setLocale('nl-BE');
    
    this.timeInfo_form = this.formBuilder.group({
      StartDate: new FormControl("", Validators.required),
      StartTime: new FormControl("", Validators.required),      
      EndDate: new FormControl("", Validators.required),
      EndTime: new FormControl("", Validators.required)
   });
   }

  ngOnInit() {
    /*console.log("ngOnInit TimeSelectorComponent", this.layoutService.startTime, this.layoutService.endTime);*/
    
    this.timeInfo_form.get("StartDate").setValue(this.layoutService.startTime);
    this.timeInfo_form.get("EndDate").setValue(this.layoutService.endTime);    

    var hh = this.layoutService.startTime.getHours();
    var mm = this.layoutService.startTime.getMinutes();
    this.timeInfo_form.get("StartTime").setValue(this.padZeroes(hh,2) + ":" + this.padZeroes(mm,2));
    
    var hh = this.layoutService.endTime.getHours();
    var mm = this.layoutService.endTime.getMinutes();
    this.timeInfo_form.get("EndTime").setValue(this.padZeroes(hh,2) + ":" + this.padZeroes(mm,2));
    
    if(this.layoutService.currentUser == undefined)
    { 
      this.router.navigateByUrl('/');
    }
  }

  padZeroes(input: number, length: number)
  {
    return String("0").repeat(Math.abs(length - input.toString().length)) + input.toString();
  }  

  closeForm(){
    this.router.navigateByUrl('/');
  }

  submit(){
    let startTime: string = this.timeInfo_form.get("StartTime").value;
    let hh: string = startTime.substring(0,2);
    let mm: string = startTime.substring(3,5);
    let startDateInput: any = this.timeInfo_form.get("StartDate").value;
    
    /*console.log("this.timeInfo_form.get(\"StartTime\").value: ", startTime);
    console.log("this.timeInfo_form.get(\"StartDate\").value: ", startDateInput);*/
    
    let startDate: Date = new Date();
    /*console.log("startDateInput.__proto__.constructor.name : ", startDateInput.__proto__.constructor.name );*/
    if(startDateInput.__proto__.constructor.name == "Date"){
      startDate = new Date(startDateInput.getFullYear(), startDateInput.getMonth(), startDateInput.getDate(), 0, 0, 0, 0);
      /*console.log("Created new startDate based on Date object: ", startDate);*/
    }
    else /*if(startDateInput.__proto__.constructor.name == "Moment")*/{
      /*console.log("startDateInput.year(): ", startDateInput.year());
      console.log("startDateInput.month(): ", startDateInput.month());
      console.log("startDateInput.date(): ", startDateInput.date());*/
      startDate = new Date(startDateInput.year(), startDateInput.month(), startDateInput.date(), 0, 0, 0, 0);
      /*console.log("Created new startDate based on Moment object: ", startDate);*/
    }
    
    startDate.setHours(Number(hh));
    startDate.setMinutes(Number(mm));

    /*console.log("startDate with update hh en mm: ", startDate);*/

    let endTime: string = this.timeInfo_form.get("EndTime").value;
    hh = endTime.substring(0,2);
    mm = endTime.substring(3,5);
    let endDateInput: any = this.timeInfo_form.get("EndDate").value;

    /*console.log("this.timeInfo_form.get(\"EndTime\").value: ", endTime);
    console.log("this.timeInfo_form.get(\"EndDate\").value: ", endDateInput); */

    let endDate: Date = new Date();
    if(endDateInput.__proto__.constructor.name == "Date"){
      endDate = new Date(endDateInput.getFullYear(), endDateInput.getMonth(), endDateInput.getDate(), 0, 0, 0, 0);
    }
    else /*if(endDateInput.__proto__.constructor.name == "Moment"*/{
      endDate = new Date(endDateInput.year(), endDateInput.month(), endDateInput.date(), 0, 0, 0, 0);
    }

    endDate.setHours(Number(hh));
    endDate.setMinutes(Number(mm));

    this.layoutService.startTime = startDate;
    this.layoutService.endTime = endDate;
    this.layoutService.updateTime();

    this.router.navigateByUrl('/');
  }
}
