import { Component } from '@angular/core';
import { RedirectService } from '@collections/services/redirect.service';
import { UntilDestroy } from '@ngneat/until-destroy';
import { CustomRoute } from '@collections/services/custom-route.service';
import { IArticle } from '@collections/repositories/types';
import { Router } from '@angular/router';
import { ConfigService } from '../../services/config.service';

@UntilDestroy()
@Component({
  selector: 'ess-articles',
  templateUrl: './articles.component.html',
  styleUrls: ['./articles.component.scss'],
})
export class ArticlesComponent {
  articles: IArticle[] = [
    {
      id: '0',
      title: 'EOSC Knowledge Hub',
      description:
        'Discover training materials, courses and learning paths supporting open science and FAIR sharing ',
      url: this._configService.get().knowledge_hub_url,
    },
  ];

  constructor(
    private _customRoute: CustomRoute,
    private _router: Router,
    public redirectService: RedirectService,
    private _configService: ConfigService
  ) {}
}
