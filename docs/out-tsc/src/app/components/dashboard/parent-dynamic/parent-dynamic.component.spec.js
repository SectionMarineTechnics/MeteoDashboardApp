import { async, TestBed } from '@angular/core/testing';
import { ParentDynamicComponent } from './parent-dynamic.component';
describe('ParentDynamicComponent', () => {
    let component;
    let fixture;
    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [ParentDynamicComponent]
        })
            .compileComponents();
    }));
    beforeEach(() => {
        fixture = TestBed.createComponent(ParentDynamicComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });
    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
//# sourceMappingURL=parent-dynamic.component.spec.js.map