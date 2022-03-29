import { Component, OnInit } from '@angular/core';
import { SearchService } from '../search/search.service';
import { ActivatedRoute, Router } from '@angular/router';
import { ArticlesStore } from './articles.state';
import { IArticle } from './article.interface';

@Component({
  selector: 'ui-articles-page',
  templateUrl: './articles-page.component.html',
})
export class ArticlesPageComponent implements OnInit {
  articles$ = this._articlesStore.articles$;
  articlesSize$ = this._articlesStore.articlesSize$;
  activeArticle$ = this._articlesStore.activeArticle$;

  constructor(
    private _searchService: SearchService,
    private _articlesStore: ArticlesStore,
    private _route: ActivatedRoute,
    private _router: Router
  ) {}

  ngOnInit() {
    this._route.queryParams.subscribe(async (params) =>
      this.setActive({ id: params['articleId'] } as IArticle)
    );
  }
  setActive = (article: IArticle) => this._articlesStore.setActive(article);
}
