import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BibliographyExportComponent } from './bibliography-export.component';

describe('BibliographyExportComponent', () => {
  let component: BibliographyExportComponent;
  let fixture: ComponentFixture<BibliographyExportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [BibliographyExportComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(BibliographyExportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
