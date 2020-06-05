import { async, TestBed } from '@angular/core/testing';
import { TimeSeriesChartComponent } from './time-series-chart.component';
describe('TimeSeriesChartComponent', () => {
    let component;
    let fixture;
    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [TimeSeriesChartComponent]
        })
            .compileComponents();
    }));
    beforeEach(() => {
        fixture = TestBed.createComponent(TimeSeriesChartComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });
    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
//# sourceMappingURL=time-series-chart.component.spec.js.map