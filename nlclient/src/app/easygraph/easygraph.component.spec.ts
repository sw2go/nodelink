import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EasygraphComponent } from './easygraph.component';

describe('EasygraphComponent', () => {
  let component: EasygraphComponent;
  let fixture: ComponentFixture<EasygraphComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EasygraphComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EasygraphComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
