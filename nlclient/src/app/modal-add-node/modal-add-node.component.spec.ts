import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalAddNodeComponent } from './modal-add-node.component';

describe('ModalAddNodeComponent', () => {
  let component: ModalAddNodeComponent;
  let fixture: ComponentFixture<ModalAddNodeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ModalAddNodeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ModalAddNodeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
