import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ValueFrameComponent } from './value-frame.component';

describe('ValueFrameComponent', () => {
  let component: ValueFrameComponent;
  let fixture: ComponentFixture<ValueFrameComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ValueFrameComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ValueFrameComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
