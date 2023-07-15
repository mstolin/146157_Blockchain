import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CampaignThumbnailComponent } from './campaign-thumbnail.component';

describe('CampaignThumbnailComponent', () => {
  let component: CampaignThumbnailComponent;
  let fixture: ComponentFixture<CampaignThumbnailComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [CampaignThumbnailComponent]
    });
    fixture = TestBed.createComponent(CampaignThumbnailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
