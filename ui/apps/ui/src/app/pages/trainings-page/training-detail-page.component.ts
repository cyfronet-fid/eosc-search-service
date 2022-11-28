import { Component, OnInit } from '@angular/core';
import { TrainingsService } from './repository/trainings.service';
import { ActivatedRoute } from '@angular/router';
import isArray from 'lodash-es/isArray';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { distinctUntilChanged, map, switchMap } from 'rxjs';
import { ITraining } from '@pages/trainings-page/repository/training.model';

@UntilDestroy()
@Component({
  selector: 'ess-training-detail-page',
  templateUrl: './training-detail-page.component.html',
  styleUrls: ['./training-detail-page.component.scss'],
})
export class TrainingDetailPageComponent implements OnInit {
  training?: ITraining;
  originUrl?: string;
  currentTab = 'about';
  isArray = isArray;

  constructor(
    private trainingsService: TrainingsService,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.route.paramMap
      .pipe(
        untilDestroyed(this),
        map((params) => +(params.get('trainingId') ?? 1)),
        distinctUntilChanged(),
        switchMap((id) => this.trainingsService.get$(id))
      )
      .subscribe((training) => (this.training = training));
  }

  toggleTab(id: string) {
    this.currentTab = id;
  }
}
