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
import { DICTIONARY_TYPE_FOR_PIPE } from '../../dictionary/dictionaryType';
import { translateDictionaryValue } from '../../dictionary/translateDictionaryValue';

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
  type = DICTIONARY_TYPE_FOR_PIPE;
  providersNames = '-';

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
        if (item['providers'] != undefined) {
          this.providersNames = item['providers']?.join(', ');
        }
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

  keywordQueryParam(value: string): {
    [key: string]: string[] | undefined | string;
  } {
    return {
      fq: this._addFilter('keywords', value),
      q: '*',
      return_path: undefined,
      search_params: undefined,
    };
  }

  toggleTab(id: string) {
    this.currentTab = id;
  }

  getIcon(): string {
    const value = this.myTraining?.scientific_domains
      ? this.myTraining.scientific_domains[0]
      : '-';

    if (value.toLowerCase().indexOf('generic') !== -1) {
      return 'ico_interdisciplinary';
    }

    if (value.toLowerCase().indexOf('engineering') !== -1) {
      return 'ico_engineering';
    }

    if (value.toLowerCase().indexOf('humanities') !== -1) {
      return 'ico_humanities';
    }

    if (value.toLowerCase().indexOf('agricultural') !== -1) {
      return 'ico_agricultural';
    }

    if (value.toLowerCase().indexOf('medical') !== -1) {
      return 'ico_medical';
    }

    if (value.toLowerCase().indexOf('social') !== -1) {
      return 'ico_social';
    }

    return 'ico_other';
  }

  getCategory(): string {
    const value = this.myTraining?.scientific_domains
      ? translateDictionaryValue(
          this.type.TRAINING_DOMAIN,
          this.myTraining.scientific_domains[0].toString()
        )
      : '-';
    return value.toString();
  }

  getSubstring(str: string): string {
    const index = str.indexOf('>');
    return str.substring(index + 1);
  }
}
