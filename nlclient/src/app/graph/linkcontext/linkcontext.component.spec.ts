import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LinkContextComponent } from './linkcontext.component';

describe('LinkComponent', () => {
  let component: LinkContextComponent;
  let fixture: ComponentFixture<LinkContextComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LinkContextComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LinkContextComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
