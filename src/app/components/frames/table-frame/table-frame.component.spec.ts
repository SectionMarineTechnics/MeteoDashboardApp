import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TableFrameComponent } from './table-frame.component';

describe('TableFrameComponent', () => {
  let component: TableFrameComponent;
  let fixture: ComponentFixture<TableFrameComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TableFrameComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TableFrameComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
