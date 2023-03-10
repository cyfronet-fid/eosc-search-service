import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BackToSearchBarComponent } from './back-to-search-bar.component';

describe('BackToSearchBarComponent', () => {
  let component: BackToSearchBarComponent;
  let fixture: ComponentFixture<BackToSearchBarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [BackToSearchBarComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(BackToSearchBarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
