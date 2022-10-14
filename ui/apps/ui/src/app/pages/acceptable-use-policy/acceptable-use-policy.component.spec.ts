import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AcceptableUsePolicyComponent } from './acceptable-use-policy.component';

describe('AcceptableUsePolicyComponent', () => {
  let component: AcceptableUsePolicyComponent;
  let fixture: ComponentFixture<AcceptableUsePolicyComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AcceptableUsePolicyComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(AcceptableUsePolicyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
