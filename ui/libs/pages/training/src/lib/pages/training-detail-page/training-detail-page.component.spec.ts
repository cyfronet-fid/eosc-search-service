import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TrainingDetailPageComponent } from './training-detail-page.component';

describe('TrainingDetailPageComponent', () => {
  let component: TrainingDetailPageComponent;
  let fixture: ComponentFixture<TrainingDetailPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TrainingDetailPageComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TrainingDetailPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
