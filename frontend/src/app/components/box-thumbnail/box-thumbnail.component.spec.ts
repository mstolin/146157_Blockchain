import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BoxThumbnailComponent } from './box-thumbnail.component';

describe('BoxThumbnailComponent', () => {
  let component: BoxThumbnailComponent;
  let fixture: ComponentFixture<BoxThumbnailComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [BoxThumbnailComponent]
    });
    fixture = TestBed.createComponent(BoxThumbnailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
