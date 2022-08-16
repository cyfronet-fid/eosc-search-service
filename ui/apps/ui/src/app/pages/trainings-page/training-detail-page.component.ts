import { Component, OnInit } from '@angular/core';
import { IResult, ITag } from '../../collections/repositories/types';
import { TrainingsService } from './trainings.service';
import { ActivatedRoute } from '@angular/router';
import { trainingsAdapter } from '../../collections/data/trainings/adapter.data';

@Component({
  selector: 'ess-training-detail-page',
  templateUrl: './training-detail-page.component.html',
  styleUrls: ['./training-detail-page.component.scss'],
})
export class TrainingDetailPageComponent implements OnInit {
  training?: IResult;
  originUrl?: string;
  keywords?: string;
  accessType?: string;
  detailsTags: ITag[] = [];
  sidebarTags: ITag[] = [];
  currentTab = 'about';

  constructor(
    private trainingsService: TrainingsService,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.getItem();
  }

  getItem(): void {
    const id = parseInt(this.route.snapshot.paramMap.get('trainingId')!, 10);
    this.trainingsService.get$(id).subscribe((item) => {
      this.training = trainingsAdapter.adapter(item);
      this.originUrl = item.URL_s;
      this.keywords = item.Keywords_ss;
      this.accessType = item.Access_Rights_s;
      this.detailsTags = this.training.tags;
      this.sidebarTags = this.training.tags;
      console.log(
        this.training.tags.find((option) => option.originalField === 'URL')
      );
    });
  }
  isArray = (tagValue: string | string[]) => Array.isArray(tagValue);

  toggleTab(id: string) {
    this.currentTab = id;
  }
}
