import { createStore } from '@ngneat/elf';
import {
  selectActiveEntity,
  selectAllEntities,
  setActiveId,
  setEntities,
  withActiveId,
  withEntities,
} from '@ngneat/elf-entities';
import { IArticle } from './article.interface';
import { map } from 'rxjs';
import { Injectable } from '@angular/core';

const store = createStore(
  { name: 'articles' },
  withEntities<IArticle>(),
  withActiveId()
);
@Injectable({ providedIn: 'root' })
export class ArticlesStore {
  articles$ = store.pipe(selectAllEntities());
  articlesSize$ = this.articles$.pipe(map((articles) => articles?.length || 0));
  activeArticle$ = store.pipe(selectActiveEntity());

  set(articles: IArticle[]) {
    store.update(setEntities(articles), setActiveId(articles[0]?.id));
  }
  setActive(article: IArticle) {
    store.update(setActiveId(article.id));
  }
}
