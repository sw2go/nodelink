import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MynodeComponent } from './mynode.component';

describe('MynodeComponent', () => {
  let component: MynodeComponent;
  let fixture: ComponentFixture<MynodeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MynodeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MynodeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
