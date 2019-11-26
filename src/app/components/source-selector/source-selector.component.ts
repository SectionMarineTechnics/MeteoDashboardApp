import { Component, OnInit } from '@angular/core';
import { FormControl, Validators, FormGroup, FormBuilder } from '@angular/forms';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import { Router } from '@angular/router';

import { DataService } from 'src/app/services/data.service';
import { Lspi } from 'src/app/models/Lspi';
import { PanelType } from 'src/app/models/PanelType';
import { ActivatedRoute } from '@angular/router';
import { GridsterLayoutService } from 'src/app/services/gridster-layout.service';

@Component({
  selector: 'app-source-selector',
  templateUrl: './source-selector.component.html',
  styleUrls: ['./source-selector.component.css']
})

export class SourceSelectorComponent implements OnInit {
  panelTypes: PanelType[];
  selectedType: PanelType;

  serieInfo_form: FormGroup;

  frameId: string = "";

  options: Lspi[] = [];
  selectedLspis: Lspi[] = [];
  filteredOptions: Observable<Lspi[]>;

  constructor(private dataService: DataService, private layoutService: GridsterLayoutService, private formBuilder: FormBuilder, private route: ActivatedRoute, private router: Router) { 
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

    this.route.params.subscribe(params => {
      this.frameId = params['id'];      
      console.log("SourceSelectorComponent route parameter: ", this.frameId)

      this.layoutService.layout

      let gridsterItem = this.layoutService.layout.find(d => d.id === this.frameId);
      if(gridsterItem != undefined){
        console.log("gridsterItem.type: ", gridsterItem.type);

        gridsterItem.serieList.forEach(item => {
          this.selectedLspis.push(item.Lspi)
        });

        this.serieInfo_form.get("Titel").setValue(gridsterItem.title);

        switch(gridsterItem.type) { 
          case 'widgetTimeSeriesChart': { 
            this.serieInfo_form.get("Type").setValue('chart');
            break; 
          } 
          case 'widgetTable': { 
            this.serieInfo_form.get("Type").setValue('table');
            break; 
          } 
          case 'widgetValue': { 
            this.serieInfo_form.get("Type").setValue('value');
            break; 
          } 
          default: { 
            this.serieInfo_form.get("Type").setValue('chart');
            break; 
          } 
        } 
      }
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

  closeForm(){
    this.router.navigateByUrl('/');
  }

  submit(){
    this.layoutService.updateItem(this.frameId, this.serieInfo_form.get("Titel").value, this.selectedLspis, this.serieInfo_form.get("Type").value);
    this.router.navigateByUrl('/');
  }
}
