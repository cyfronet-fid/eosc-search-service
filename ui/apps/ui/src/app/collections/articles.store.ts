import { createStore } from '@ngneat/elf';
import {
  selectActiveEntity,
  selectAllEntities,
  setActiveId,
  setEntities,
  withActiveId,
  withEntities,
} from '@ngneat/elf-entities';
import { IArticle } from './research-products/research-products.model';
import { BehaviorSubject } from 'rxjs';
import { Injectable } from '@angular/core';
import { IStore } from '../store.interface';
import { ISearchResults } from '../search-service/search-results.interface';
import { Router } from '@angular/router';

const store = createStore(
  { name: 'articles' },
  withEntities<IArticle>(),
  withActiveId()
);
@Injectable({ providedIn: 'root' })
export class ArticlesStore implements IStore<IArticle> {
  articles$ = store.pipe(selectAllEntities());
  articlesSize$ = new BehaviorSubject<number>(0);
  activeArticle$ = store.pipe(selectActiveEntity());

  constructor(private _router: Router) {}

  set(results: ISearchResults<IArticle>) {
    store.update(setEntities(results.results));
    this.setActive(results.results[0]);
    this.articlesSize$.next(results.numFound);
  }
  setActive(article: IArticle) {
    store.update(setActiveId(article.id));
  }
}
