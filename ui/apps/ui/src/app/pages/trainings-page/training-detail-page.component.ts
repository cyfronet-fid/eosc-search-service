import { Component, OnInit } from '@angular/core';
import { IResult, ITag } from '@collections/repositories/types';
import { TrainingsService } from './trainings.service';
import { ActivatedRoute } from '@angular/router';
import { trainingsAdapter } from '@collections/data/trainings/adapter.data';
import isArray from 'lodash-es/isArray';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { ITraining } from '@collections/data/trainings/training.model';

@UntilDestroy()
@Component({
  selector: 'ess-training-detail-page',
  templateUrl: './training-detail-page.component.html',
  styleUrls: ['./training-detail-page.component.scss'],
})
export class TrainingDetailPageComponent implements OnInit {
  training?: IResult;
  originUrl?: string;
  keywords?: string[];
  accessType?: string;
  detailsTags: ITag[] = [];
  sidebarTags: ITag[] = [];
  currentTab = 'about';
  isArray = isArray;
  myTraining?: ITraining;

  mockItem = {
    author_names: [
      'Bezuidenhout Louise',
      'Clare Helen',
      'Dijk Elly',
      'Ferguson Kim',
      'Flohr Pascal',
      'Hirsch Lisa',
      'Kuchma Iryna',
      'Ševkušić Milica',
      'Vipavc Brvar Irena',
      'EOSC Future',
    ],
    author_names_tg: ['Venkataraman Shanmugasundaram', 'Moura Paula'],
    best_access_right: 'Open access',
    catalogue: 'eosc',
    content_type: ['Text'],
    description: [
      'The Report describes the process for the development of the Toolkit for policymakers. The document also comprises the Templates',
      ' Checklists and Factsheets for RFOs and RPOs and other materials and resources available through the OpenAIRE portal to NOADs and policymakers.',
    ],
    duration: null,
    eosc_provider: ['openaire'],
    geographical_availabilities: ['World'],
    id: 'openaire.ae68509e9ca2ff3e0c0827ce6fb30b63',
    keywords: [
      'Open Science',
      'Open access policies',
      'Institutional policies',
      'Funder policies',
    ],
    keywords_tg: [
      'Open Science',
      'Open access policies',
      'Institutional policies',
      'Funder policies',
    ],
    language: ['English'],
    learning_outcomes: [
      'Can use proper data formats to express resources',
      'Can define the data formats for preservation when creating a DMP',
    ],
    level_of_expertise: 'Beginner',
    license: 'CC BY 4.0',
    open_access: true,
    publication_date: '2020-09-01',
    qualification: [],
    related_services: [],
    resource_organisation: 'openaire',
    resource_type: ['Lesson Plan'],
    scientific_domains: [['Generic', 'Generic>Generic']],
    target_group: ['Researchers', 'Students'],
    title:
      'Data formats for preservation: What you need to know when creating a DMP',
    type: 'training',
    unified_categories: ['Access Training Material'],
    url: ['https://www.openaire.eu/data-formats-preservation-guide'],
  };

  constructor(
    private trainingsService: TrainingsService,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.getItem();
  }

  getItem(): void {
    const id = this.route.snapshot.paramMap.get('trainingId') || 1;
    this.trainingsService
      .get$(id)
      .pipe(untilDestroyed(this))
      .subscribe((item) => {
        this.myTraining = { ...item } as ITraining;
        this.training = trainingsAdapter.adapter(item);
        this.originUrl = this.myTraining.url ? this.myTraining.url[0] : '';
        this.keywords = item.keywords;
        this.accessType = item.best_access_right;
        this.detailsTags = this.training.tags;
        this.sidebarTags = this.training.tags;
      });
  }

  toggleTab(id: string) {
    this.currentTab = id;
  }
}
