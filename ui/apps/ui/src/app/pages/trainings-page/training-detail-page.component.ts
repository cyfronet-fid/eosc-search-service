import { Component, OnInit } from '@angular/core';
import { IResult, ITag } from '@collections/repositories/types';
import { TrainingsService } from './trainings.service';
import { ActivatedRoute, Router } from '@angular/router';
import { trainingsAdapter } from '@collections/data/trainings/adapter.data';
import isArray from 'lodash-es/isArray';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { ITraining } from '@collections/data/trainings/training.model';
import { toArray } from '@collections/filters-serializers/utils';
import { deserializeAll } from '@collections/filters-serializers/filters-serializers.utils';
import { CustomRoute } from '@collections/services/custom-route.service';
import { FiltersConfigsRepository } from '@collections/repositories/filters-configs.repository';

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

  constructor(
    private trainingsService: TrainingsService,
    private route: ActivatedRoute,
    private _customRoute: CustomRoute,
    private _filtersConfigsRepository: FiltersConfigsRepository,
    private _router: Router
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

  _addFilter(filter: string, value: string): string[] {
    const filtersConfigs = this._filtersConfigsRepository.get(
      this._customRoute.collection()
    ).filters;
    const fqMap = this._customRoute.fqMap();
    if (toArray(fqMap[value]).includes(value)) {
      return deserializeAll(fqMap, filtersConfigs);
    }

    return deserializeAll(
      {
        ...this._customRoute.fqMap(),
        [filter]: [...toArray(this._customRoute.fqMap()[filter]), value],
      },
      filtersConfigs
    );
  }

  async setActiveFilter(filter: string, value: string) {
    await this._router.navigate(['/search'], {
      queryParams: {
        fq: this._addFilter(filter, value),
      },
      queryParamsHandling: 'merge',
    });
  }

  toggleTab(id: string) {
    this.currentTab = id;
  }
}
