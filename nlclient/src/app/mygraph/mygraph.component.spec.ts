import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MygraphComponent } from './mygraph.component';

describe('MygraphComponent', () => {
  let component: MygraphComponent;
  let fixture: ComponentFixture<MygraphComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MygraphComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MygraphComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
