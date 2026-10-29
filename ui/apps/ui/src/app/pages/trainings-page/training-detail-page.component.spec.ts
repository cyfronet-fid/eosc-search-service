import { CommonModule } from '@angular/common';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute, Router } from '@angular/router';
import { FiltersConfigsRepository } from '@collections/repositories/filters-configs.repository';
import { CustomRoute } from '@collections/services/custom-route.service';
import { of } from 'rxjs';

import { InteroperabilityGuidelinesPipeModule } from '../../pipe/interoperability-guidelines.pipe.module';
import { TrainingDetailPageComponent } from './training-detail-page.component';
import { TrainingsService } from './trainings.service';

describe('TrainingDetailPageComponent', () => {
  let fixture: ComponentFixture<TrainingDetailPageComponent>;
  let trainingsService: { get$: jest.Mock };

  const training = {
    id: 'training-1',
    title: ['Training'],
    description: ['Description'],
    type: 'training',
    providers: [],
    keywords: [],
    language: ['English'],
    license: 'CC BY 4.0',
    resource_type: ['Course'],
    content_type: ['Presentation'],
    level_of_expertise: 'Beginner',
    qualification: 'Certificate',
    duration: 3600,
    target_group: [],
    scientific_domains: ['Generic'],
    node: 'EOSC EU Node',
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
    trainingsService = {
      get$: jest.fn().mockReturnValue(of(training)),
    };

    await TestBed.configureTestingModule({
      imports: [CommonModule, InteroperabilityGuidelinesPipeModule],
      declarations: [TrainingDetailPageComponent],
      providers: [
        { provide: TrainingsService, useValue: trainingsService },
        {
          provide: ActivatedRoute,
          useValue: {
            snapshot: {
              paramMap: { get: jest.fn().mockReturnValue('training-1') },
            },
          },
        },
        { provide: CustomRoute, useValue: {} },
        { provide: FiltersConfigsRepository, useValue: {} },
        { provide: Router, useValue: {} },
      ],
      schemas: [NO_ERRORS_SCHEMA],
    }).compileComponents();

    fixture = TestBed.createComponent(TrainingDetailPageComponent);
  });

  it('renders every creator with all their identifiers and affiliations', () => {
    fixture.detectChanges();

    const creatorPanel = fixture.nativeElement.querySelector(
      '.contact-panel'
    ) as HTMLElement;
    const details = Array.from(creatorPanel.querySelectorAll('dl'));

    expect(creatorPanel.querySelector('h6')?.textContent?.trim()).toBe(
      'Creators'
    );
    expect(
      details.map((item) => [
        item.querySelector('dt')?.textContent?.trim(),
        ...Array.from(item.querySelectorAll('dd')).map((value) =>
          value.textContent?.trim()
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

  it.each([
    { name: 'Jane Doe' },
    { name: 'Jane Doe', identifiers: [], affiliations: [] },
  ])('renders a single creator without optional details: %j', (creator) => {
    trainingsService.get$.mockReturnValue(
      of({ ...training, creators: JSON.stringify([creator]) })
    );

    fixture.detectChanges();

    const creatorPanel = fixture.nativeElement.querySelector('.contact-panel');
    expect(creatorPanel.querySelector('h6').textContent.trim()).toBe('Creator');
    expect(creatorPanel.querySelectorAll('dl')).toHaveLength(1);
    expect(creatorPanel.querySelector('dd').textContent.trim()).toBe(
      'Jane Doe'
    );
    expect(creatorPanel.querySelectorAll('hr')).toHaveLength(0);
  });

  it.each([undefined, '', '[]', 'invalid JSON', 'null', '{}'])(
    'does not render the creators panel for unavailable creators: %s',
    (creators) => {
      trainingsService.get$.mockReturnValue(of({ ...training, creators }));

      fixture.detectChanges();

      expect(fixture.nativeElement.querySelector('.contact-panel')).toBeNull();
    }
  );
});
