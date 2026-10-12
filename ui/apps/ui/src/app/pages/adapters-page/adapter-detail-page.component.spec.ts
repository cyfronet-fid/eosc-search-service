import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute, Router } from '@angular/router';
import { RedirectService } from '@collections/services/redirect.service';
import { BehaviorSubject, of } from 'rxjs';

import { AdapterDetailPageComponent } from './adapter-detail-page.component';
import { AdaptersService } from './adapters.service';

describe('AdapterDetailPageComponent', () => {
  let fixture: ComponentFixture<AdapterDetailPageComponent>;
  let routeParams$: BehaviorSubject<{ adapterId: string }>;
  let adaptersService: { get$: jest.Mock };

  const adapter = {
    id: 'adapter-1',
    title: ['Adapter'],
    description: ['Description'],
    type: 'adapter',
    creator_names: ['Jane Doe', 'John Roe'],
    creator_identifiers: '0000-0000-0000-0001',
    creator_affiliations: ['EOSC', 'EGI'],
  };

  beforeEach(async () => {
    routeParams$ = new BehaviorSubject({ adapterId: 'adapter-1' });
    adaptersService = {
      get$: jest.fn().mockReturnValue(of(adapter)),
    };

    await TestBed.configureTestingModule({
      imports: [CommonModule],
      declarations: [AdapterDetailPageComponent],
      providers: [
        { provide: AdaptersService, useValue: adaptersService },
        {
          provide: ActivatedRoute,
          useValue: { params: routeParams$.asObservable() },
        },
        { provide: Router, useValue: { url: '/adapters/adapter-1' } },
        { provide: RedirectService, useValue: {} },
        { provide: HttpClient, useValue: {} },
      ],
      schemas: [NO_ERRORS_SCHEMA],
    }).compileComponents();

    fixture = TestBed.createComponent(AdapterDetailPageComponent);
  });

  const getCreatorValues = (label: string): string[] =>
    Array.from(
      fixture.nativeElement.querySelectorAll('.contact-panel dl') as NodeListOf<HTMLElement>
    )
      .filter((item) => item.querySelector('dt')?.textContent === label)
      .map((item) => item.querySelector('dd')?.textContent?.trim() ?? '');

  it('renders every creator with the affiliation at the same index', () => {
    fixture.detectChanges();

    const creatorPanel = fixture.nativeElement.querySelector(
      '.contact-panel'
    ) as HTMLElement;

    expect(getCreatorValues('Name')).toEqual(['Jane Doe', 'John Roe']);
    expect(getCreatorValues('Affiliation')).toEqual(['EOSC', 'EGI']);
    expect(getCreatorValues('ORCID')).toEqual(['0000-0000-0000-0001']);
    expect(creatorPanel.querySelectorAll('hr')).toHaveLength(1);
  });

  it('assigns identifiers from a list to creators at matching indexes', () => {
    adaptersService.get$.mockReturnValue(
      of({
        ...adapter,
        creator_identifiers: [
          '0000-0000-0000-0001',
          '0000-0000-0000-0002',
        ],
      })
    );

    fixture.detectChanges();

    expect(getCreatorValues('ORCID')).toEqual([
      '0000-0000-0000-0001',
      '0000-0000-0000-0002',
    ]);
  });

  it('does not render individual creator fields when values are missing', () => {
    adaptersService.get$.mockReturnValue(
      of({
        ...adapter,
        creator_names: ['Jane Doe', ''],
        creator_identifiers: ['', '0000-0000-0000-0002'],
        creator_affiliations: ['', 'EGI'],
      })
    );

    fixture.detectChanges();

    expect(getCreatorValues('Name')).toEqual(['Jane Doe']);
    expect(getCreatorValues('ORCID')).toEqual(['0000-0000-0000-0002']);
    expect(getCreatorValues('Affiliation')).toEqual(['EGI']);
  });

  it('renders available creator information when creator names are missing', () => {
    adaptersService.get$.mockReturnValue(
      of({
        ...adapter,
        creator_names: undefined,
        creator_affiliations: undefined,
      })
    );

    fixture.detectChanges();

    expect(getCreatorValues('Name')).toEqual([]);
    expect(getCreatorValues('ORCID')).toEqual(['0000-0000-0000-0001']);
  });

  it('does not render the creators panel when all creator data is missing', () => {
    adaptersService.get$.mockReturnValue(
      of({
        ...adapter,
        creator_names: undefined,
        creator_identifiers: undefined,
        creator_affiliations: undefined,
      })
    );

    fixture.detectChanges();

    expect(fixture.nativeElement.querySelector('.contact-panel')).toBeNull();
  });
});
