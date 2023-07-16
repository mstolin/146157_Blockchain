import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StakeholderInputComponent } from './stakeholder-input.component';

describe('StakeholderInputComponent', () => {
  let component: StakeholderInputComponent;
  let fixture: ComponentFixture<StakeholderInputComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [StakeholderInputComponent]
    });
    fixture = TestBed.createComponent(StakeholderInputComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
