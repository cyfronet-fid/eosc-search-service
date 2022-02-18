import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MarketplacePageComponent } from './marketplace-page.component';

describe('MarketplacePageComponent', () => {
  let component: MarketplacePageComponent;
  let fixture: ComponentFixture<MarketplacePageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MarketplacePageComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MarketplacePageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
