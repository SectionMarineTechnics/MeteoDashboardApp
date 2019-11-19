import { Component, OnInit } from '@angular/core';
import { FormControl, Validators, FormGroup, FormBuilder } from '@angular/forms';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';

import { DataService } from 'src/app/services/data.service';
import { Lspi } from 'src/app/models/Lspi';
import { PanelType } from 'src/app/models/PanelType';

@Component({
  selector: 'app-source-selector',
  templateUrl: './source-selector.component.html',
  styleUrls: ['./source-selector.component.css']
})

export class SourceSelectorComponent implements OnInit {
  panelTypes: PanelType[];
  selectedType: PanelType;

  serieInfo_form: FormGroup;

  options: Lspi[] = [];
  selectedLspis: Lspi[] = [];
  filteredOptions: Observable<Lspi[]>;

  constructor(private dataService: DataService, private formBuilder: FormBuilder) { 
    this.panelTypes = [
      {value: 'chart', viewValue: 'Grafiek'},
      {value: 'value', viewValue: 'Waarde'},
      {value: 'table', viewValue: 'Tabel'}
    ];

    this.selectedType = this.panelTypes[0];
    
    this.serieInfo_form = this.formBuilder.group({
      Titel: new FormControl("",Validators.required),
      Type: new FormControl("",Validators.required),
      LspiSelector: new FormControl("")
   });
  }

  ngOnInit() {
    this.dataService.getLSPIList()
          .then(_ => (this.options = this.dataService.lspis) )
          .then(result => {
            this.setInitialValue();
          });
  }

  setInitialValue(){
    
    console.log("this.dataService.lspis: ", this.dataService.lspis);

    this.filteredOptions = this.serieInfo_form.get("LspiSelector").valueChanges
      .pipe(
        startWith(''),
        map(value => typeof value === 'string' ? value : value.name),
        map(name => name ? this._filter(name) : this.options.slice())
      );       
  }

  displayFn(lspi?: Lspi): string | undefined {
    return lspi ? lspi.Name() : undefined;
  }

  private _filter(name: string): Lspi[] {
    const filterValue = name.toLowerCase();
    return this.options.filter(option => option.Name().toLowerCase().indexOf(filterValue) === 0);
  }
  
  addLspi(){
    this.selectedLspis.push(this.serieInfo_form.get("LspiSelector").value);
  }

  deleteLspi(lspi: Lspi){
    const index: number = this.selectedLspis.indexOf(lspi);
    if (index !== -1) {
        this.selectedLspis.splice(index, 1);
    } 
  }

  lspiElementsSelected(){
      return this.selectedLspis.length > 0;
  }
}
