import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SoldBoxThumbnailComponent } from './sold-box-thumbnail.component';

describe('SoldBoxThumbnailComponent', () => {
  let component: SoldBoxThumbnailComponent;
  let fixture: ComponentFixture<SoldBoxThumbnailComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [SoldBoxThumbnailComponent]
    });
    fixture = TestBed.createComponent(SoldBoxThumbnailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
