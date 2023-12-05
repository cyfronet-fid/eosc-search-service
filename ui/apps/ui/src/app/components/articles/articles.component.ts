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
      title: 'Exploration Toolkit',
      description: 'Navigating EOSC<br>Catalogue & Marketplace',
      url: `${
        this._configService.get().knowledge_hub_url
      }/articles/article_01.html`,
    },
    {
      id: '1',
      title: 'Searching Pathways',
      description: 'Smart Strategies<br>for EOSC Exploration',
      url: `${
        this._configService.get().knowledge_hub_url
      }/articles/article_02.html`,
    },
    {
      id: '2',
      title: 'Effective Data Reuse',
      description: 'Documentation and Metadata Refinement',
      url: `${
        this._configService.get().knowledge_hub_url
      }/articles/article_03.html`,
    },
  ];

  constructor(
    private _customRoute: CustomRoute,
    private _router: Router,
    public redirectService: RedirectService,
    private _configService: ConfigService
  ) {}
}
