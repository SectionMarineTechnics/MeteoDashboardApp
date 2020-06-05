import * as tslib_1 from "tslib";
import { Component } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { map, startWith } from 'rxjs/operators';
let SourceSelectorComponent = class SourceSelectorComponent {
    constructor(dataService, layoutService, formBuilder, route, router) {
        this.dataService = dataService;
        this.layoutService = layoutService;
        this.formBuilder = formBuilder;
        this.route = route;
        this.router = router;
        this.frameId = "";
        this.options = [];
        this.selectedLspis = [];
        this.panelTypes = [
            { value: 'chart', viewValue: 'Grafiek' },
            { value: 'value', viewValue: 'Waarde' },
            { value: 'table', viewValue: 'Tabel' }
        ];
        this.selectedType = this.panelTypes[0];
        this.serieInfo_form = this.formBuilder.group({
            Titel: new FormControl("", Validators.required),
            Type: new FormControl("", Validators.required),
            LspiSelector: new FormControl("")
        });
    }
    ngOnInit() {
        this.dataService.getLSPIList()
            .then(_ => (this.options = this.dataService.lspis))
            .then(result => {
            this.setInitialValue();
        });
        this.route.params.subscribe(params => {
            this.frameId = params['id'];
            console.log("SourceSelectorComponent route parameter: ", this.frameId);
            this.layoutService;
        });
    }
    setInitialValue() {
        console.log("this.dataService.lspis: ", this.dataService.lspis);
        this.filteredOptions = this.serieInfo_form.get("LspiSelector").valueChanges
            .pipe(startWith(''), map(value => typeof value === 'string' ? value : value.name), map(name => name ? this._filter(name) : this.options.slice()));
    }
    displayFn(lspi) {
        return lspi ? lspi.Name() : undefined;
    }
    _filter(name) {
        const filterValue = name.toLowerCase();
        return this.options.filter(option => option.Name().toLowerCase().indexOf(filterValue) === 0);
    }
    addLspi() {
        this.selectedLspis.push(this.serieInfo_form.get("LspiSelector").value);
    }
    deleteLspi(lspi) {
        const index = this.selectedLspis.indexOf(lspi);
        if (index !== -1) {
            this.selectedLspis.splice(index, 1);
        }
    }
    lspiElementsSelected() {
        return this.selectedLspis.length > 0;
    }
    closeForm() {
        this.router.navigateByUrl('/');
    }
    submit() {
        this.layoutService.updateItem(this.frameId, this.serieInfo_form.get("Titel").value, this.selectedLspis, this.serieInfo_form.get("Type").value);
        this.router.navigateByUrl('/');
    }
};
SourceSelectorComponent = tslib_1.__decorate([
    Component({
        selector: 'app-source-selector',
        templateUrl: './source-selector.component.html',
        styleUrls: ['./source-selector.component.css']
    })
], SourceSelectorComponent);
export { SourceSelectorComponent };
//# sourceMappingURL=source-selector.component.js.map