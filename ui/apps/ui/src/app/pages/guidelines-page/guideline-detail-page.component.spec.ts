import { CommonModule } from '@angular/common';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute, Router } from '@angular/router';
import { IGuideline } from '@collections/data/guidelines/guideline.model';
import { BehaviorSubject, of, throwError } from 'rxjs';

import { InteroperabilityGuidelinesPipeModule } from '../../pipe/interoperability-guidelines.pipe.module';
import { GuidelineDetailPageComponent } from './guideline-detail-page.component';
import { GuidelinesService } from './guidelines.service';

describe('GuidelineDetailPageComponent', () => {
  let component: GuidelineDetailPageComponent;
  let fixture: ComponentFixture<GuidelineDetailPageComponent>;
  let routeParams$: BehaviorSubject<{ guidelineId: string }>;
  let guidelinesService: {
    get$: jest.Mock;
    getRelatedResourceIds$: jest.Mock;
  };
  let router: { url: string; navigate: jest.Mock };

  const creators = [
    {
      author_name_type_info: { author_names: 'Jane Doe' },
      author_names_id: '0000-0000-0000-0001',
      author_affiliation_info: { author_affiliations: 'EOSC' },
    },
  ];

  const guideline: IGuideline = {
    id: 'guideline-1',
    title: ['A & B guideline'],
    description: ['Description'],
    type_general: [],
    url: ['https://example.com/guideline'],
    license: 'CC BY 4.0',
    license_url: 'https://example.com/license',
    related_standards_uri: ['https://example.com/standard'],
    related_standards_id: ['ISO 1234'],
    creators: JSON.stringify(creators),
    related_services: [],
    node: 'EOSC EU Node',
  };

  beforeEach(async () => {
    routeParams$ = new BehaviorSubject({ guidelineId: 'guideline-1' });
    guidelinesService = {
      get$: jest.fn().mockReturnValue(of(guideline)),
      getRelatedResourceIds$: jest
        .fn()
        .mockReturnValue(of([' pid-1 ', 'pid-1', 'pid/2', ''])),
    };
    router = {
      url: '/guidelines/guideline-1',
      navigate: jest.fn().mockResolvedValue(true),
    };

    await TestBed.configureTestingModule({
      imports: [CommonModule, InteroperabilityGuidelinesPipeModule],
      declarations: [GuidelineDetailPageComponent],
      providers: [
        {
          provide: GuidelinesService,
          useValue: guidelinesService,
        },
        {
          provide: ActivatedRoute,
          useValue: { params: routeParams$.asObservable() },
        },
        { provide: Router, useValue: router },
      ],
      schemas: [NO_ERRORS_SCHEMA],
    }).compileComponents();

    fixture = TestBed.createComponent(GuidelineDetailPageComponent);
    component = fixture.componentInstance;
  });

  it('loads the guideline and builds an encoded related-services link', () => {
    fixture.detectChanges();

    expect(guidelinesService.get$).toHaveBeenCalledWith('guideline-1');
    expect(guidelinesService.getRelatedResourceIds$).toHaveBeenCalledWith(
      'guideline-1'
    );
    expect(component.relatedServicesLink).toBe(
      '/search/service?q=*&fq=pid:(%22pid-1%22,%22pid%2F2%22)&guideline=A%20%26%20B%20guideline'
    );
  });

  it('renders the license and related standards in separate columns', () => {
    fixture.detectChanges();

    const cards = Array.from(
      fixture.nativeElement.querySelectorAll('.description-blocks .card')
    ) as HTMLElement[];
    const licenseCard = cards.find((card) =>
      card.textContent?.includes('License')
    );
    const standardsCard = cards.find((card) =>
      card.textContent?.includes('Related standards')
    );
    const licenseColumn = licenseCard?.closest('.col');
    const standardsColumn = standardsCard?.closest('.col');

    expect(licenseCard).toBeTruthy();
    expect(standardsCard).toBeTruthy();
    expect(licenseColumn).not.toBe(standardsColumn);
    expect(licenseColumn?.nextElementSibling).toBe(standardsColumn);
  });

  it('renders optional cards and the read button only when data is present', () => {
    guidelinesService.get$.mockReturnValue(
      of({
        ...guideline,
        url: undefined,
        license: undefined,
        related_standards_uri: undefined,
        related_standards_id: undefined,
      })
    );

    fixture.detectChanges();

    expect(
      fixture.nativeElement.querySelector('.ig-buttons-container')
    ).toBeNull();
    expect(
      fixture.nativeElement.querySelectorAll('.description-blocks .card')
    ).toHaveLength(0);
  });

  it('uses the guideline URL for the read button', () => {
    fixture.detectChanges();

    const link = fixture.nativeElement.querySelector(
      '.ig-buttons-container a'
    ) as HTMLAnchorElement;

    expect(component.getIdentifierLink()).toBe(guideline.url?.[0]);
    expect(link.getAttribute('href')).toBe('https://example.com/guideline');
  });

  it('uses singular and plural creator headings', () => {
    fixture.detectChanges();
    const heading = fixture.nativeElement.querySelector(
      '.contact-panel h6'
    ) as HTMLElement;

    expect(heading.textContent?.trim()).toBe('Creator');

    component.interoperabilityGuidelineItem = {
      ...guideline,
      creators: JSON.stringify([...creators, creators[0]]),
    };
    fixture.detectChanges();

    expect(heading.textContent?.trim()).toBe('Creators');
  });

  it('hides the related-services link when loading related IDs fails', () => {
    guidelinesService.getRelatedResourceIds$.mockReturnValue(
      throwError(() => new Error('Related resources unavailable'))
    );

    fixture.detectChanges();

    expect(component.relatedServicesLink).toBeUndefined();
    expect(fixture.nativeElement.querySelector('.linked-resource')).toBeNull();
  });

  it('redirects when the guideline cannot be loaded', async () => {
    guidelinesService.get$.mockReturnValue(
      throwError(() => new Error('Guideline unavailable'))
    );

    fixture.detectChanges();
    await fixture.whenStable();

    expect(router.navigate).toHaveBeenCalledWith(['**']);
  });
});
