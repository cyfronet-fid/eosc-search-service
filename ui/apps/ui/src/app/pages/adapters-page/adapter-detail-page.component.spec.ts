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
    creators: JSON.stringify([
      {
        name: 'Jane Doe',
        identifiers: ['0000-0000-0000-0001', 'creator-pid-1'],
        affiliations: ['EOSC', 'EGI'],
      },
      {
        name: 'John Roe',
        identifiers: ['creator-pid-2'],
        affiliations: ['Cyfronet'],
      },
    ]),
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
      .flatMap((item) =>
        Array.from(item.querySelectorAll('dd')).map(
          (value) => value.textContent?.trim() ?? ''
        )
      );

  it('renders every creator with all their identifiers and affiliations', () => {
    fixture.detectChanges();

    const creatorPanel = fixture.nativeElement.querySelector(
      '.contact-panel'
    ) as HTMLElement;

    expect(getCreatorValues('Name')).toEqual(['Jane Doe', 'John Roe']);
    expect(getCreatorValues('Affiliation')).toEqual([
      'EOSC',
      'EGI',
      'Cyfronet',
    ]);
    expect(getCreatorValues('PID')).toEqual([
      '0000-0000-0000-0001',
      'creator-pid-1',
      'creator-pid-2',
    ]);
    expect(creatorPanel.querySelector('h6')?.textContent?.trim()).toBe(
      'Creators'
    );
    const groups = Array.from(creatorPanel.querySelectorAll('dl'));
    expect(
      groups.map((group) => [
        group.querySelector('dt')?.textContent?.trim(),
        ...Array.from(group.querySelectorAll('dd')).map(
          (value) => value.textContent?.trim()
        ),
      ])
    ).toEqual([
      ['Name', 'Jane Doe'],
      ['PID', '0000-0000-0000-0001', 'creator-pid-1'],
      ['Affiliation', 'EOSC', 'EGI'],
      ['Name', 'John Roe'],
      ['PID', 'creator-pid-2'],
      ['Affiliation', 'Cyfronet'],
    ]);
    expect(creatorPanel.querySelectorAll('hr')).toHaveLength(1);
  });

  it('does not render individual creator fields when values are missing', () => {
    adaptersService.get$.mockReturnValue(
      of({
        ...adapter,
        creators: JSON.stringify([
          { name: 'Jane Doe', identifiers: [], affiliations: [] },
          { identifiers: ['creator-pid-2'], affiliations: ['EGI'] },
        ]),
      })
    );

    fixture.detectChanges();

    expect(getCreatorValues('Name')).toEqual(['Jane Doe']);
    expect(getCreatorValues('PID')).toEqual(['creator-pid-2']);
    expect(getCreatorValues('Affiliation')).toEqual(['EGI']);
  });

  it('renders a singular heading and no separator for one creator', () => {
    adaptersService.get$.mockReturnValue(
      of({
        ...adapter,
        creators: JSON.stringify([{ name: 'Jane Doe' }]),
      })
    );

    fixture.detectChanges();

    const creatorPanel = fixture.nativeElement.querySelector('.contact-panel');
    expect(creatorPanel.querySelector('h6').textContent.trim()).toBe('Creator');
    expect(creatorPanel.querySelectorAll('hr')).toHaveLength(0);
    expect(getCreatorValues('PID')).toEqual([]);
    expect(getCreatorValues('Affiliation')).toEqual([]);
  });

  it.each([undefined, '', '[]', 'invalid JSON', 'null', '{}'])(
    'does not render the creators panel for unavailable creators: %s',
    (creators) => {
      adaptersService.get$.mockReturnValue(
        of({
          ...adapter,
          creators,
        })
      );

      fixture.detectChanges();

      expect(fixture.nativeElement.querySelector('.contact-panel')).toBeNull();
    }
  );
});
