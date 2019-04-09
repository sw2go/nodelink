import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GraphContextComponent } from './graphcontext.component';

describe('GraphComponent', () => {
  let component: GraphContextComponent;
  let fixture: ComponentFixture<GraphContextComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GraphContextComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GraphContextComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
