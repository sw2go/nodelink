import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NodeContextComponent } from './nodecontext.component';

describe('NodeComponent', () => {
  let component: NodeContextComponent;
  let fixture: ComponentFixture<NodeContextComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NodeContextComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NodeContextComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
