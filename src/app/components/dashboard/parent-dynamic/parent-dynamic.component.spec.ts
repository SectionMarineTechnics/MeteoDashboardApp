import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ParentDynamicComponent } from './parent-dynamic.component';

describe('ParentDynamicComponent', () => {
  let component: ParentDynamicComponent;
  let fixture: ComponentFixture<ParentDynamicComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ParentDynamicComponent ]
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
