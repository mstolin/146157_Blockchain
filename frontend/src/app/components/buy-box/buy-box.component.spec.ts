import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BuyBoxComponent } from './buy-box.component';

describe('BuyBoxComponent', () => {
  let component: BuyBoxComponent;
  let fixture: ComponentFixture<BuyBoxComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [BuyBoxComponent]
    });
    fixture = TestBed.createComponent(BuyBoxComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
