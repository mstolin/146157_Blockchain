import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NewCampaignComponent } from './new-campaign.component';

describe('NewCampaignComponent', () => {
  let component: NewCampaignComponent;
  let fixture: ComponentFixture<NewCampaignComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [NewCampaignComponent]
    });
    fixture = TestBed.createComponent(NewCampaignComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
