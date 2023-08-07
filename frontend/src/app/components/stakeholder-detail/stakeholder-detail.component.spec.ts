import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StakeholderDetailComponent } from './stakeholder-detail.component';

describe('StakeholderDetailComponent', () => {
  let component: StakeholderDetailComponent;
  let fixture: ComponentFixture<StakeholderDetailComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [StakeholderDetailComponent]
    });
    fixture = TestBed.createComponent(StakeholderDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
