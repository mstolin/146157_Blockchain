import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BoxDetailComponent } from './box-detail.component';

describe('BoxDetailComponent', () => {
  let component: BoxDetailComponent;
  let fixture: ComponentFixture<BoxDetailComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [BoxDetailComponent]
    });
    fixture = TestBed.createComponent(BoxDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
