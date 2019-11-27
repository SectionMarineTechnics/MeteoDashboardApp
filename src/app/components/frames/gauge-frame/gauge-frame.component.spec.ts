import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GaugeFrameComponent } from './gauge-frame.component';

describe('GaugeFrameComponent', () => {
  let component: GaugeFrameComponent;
  let fixture: ComponentFixture<GaugeFrameComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GaugeFrameComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GaugeFrameComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
