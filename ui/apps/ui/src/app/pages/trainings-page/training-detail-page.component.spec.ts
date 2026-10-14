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
    author_names: ['Jane Doe', 'John Roe'],
    author_names_id: ['0000-0000-0000-0001', '0000-0000-0000-0002'],
    author_affiliations: ['EOSC', 'EGI'],
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

  it('renders every creator with the identifier and affiliation at the same index', () => {
    fixture.detectChanges();

    const creatorPanel = fixture.nativeElement.querySelector(
      '.contact-panel'
    ) as HTMLElement;
    const details = Array.from(creatorPanel.querySelectorAll('dl'));
    const valuesFor = (label: string) =>
      details
        .filter((item) => item.querySelector('dt')?.textContent === label)
        .map((item) => item.querySelector('dd')?.textContent?.trim());

    expect(
      creatorPanel.querySelector('h6')?.textContent?.trim()
    ).toBe('Creators');
    expect(valuesFor('Name')).toEqual(['Jane Doe', 'John Roe']);
    expect(valuesFor('ORCID')).toEqual([
      '0000-0000-0000-0001',
      '0000-0000-0000-0002',
    ]);
    expect(valuesFor('Affiliation')).toEqual(['EOSC', 'EGI']);
    expect(creatorPanel.querySelectorAll('hr')).toHaveLength(1);
  });

  it('does not render the creators panel when author names are missing', () => {
    trainingsService.get$.mockReturnValue(
      of({ ...training, author_names: undefined })
    );

    fixture.detectChanges();

    expect(fixture.nativeElement.querySelector('.contact-panel')).toBeNull();
  });
});
