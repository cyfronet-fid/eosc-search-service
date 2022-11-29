import { Component, OnInit } from '@angular/core';
import { IResult, ITag } from '@collections/repositories/types';
import { TrainingsService } from './trainings.service';
import { ActivatedRoute } from '@angular/router';
import { trainingsAdapter } from '@collections/data/trainings/adapter.data';
import isArray from 'lodash-es/isArray';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';

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

  constructor(
    private trainingsService: TrainingsService,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.getItem();
  }

  getItem(): void {
    const id = +(this.route.snapshot.paramMap.get('trainingId') ?? 1);
    this.trainingsService
      .get$(id)
      .pipe(untilDestroyed(this))
      .subscribe((item) => {
        this.training = trainingsAdapter.adapter(item);
        this.originUrl = item.URL_s;
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
