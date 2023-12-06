import { Injectable } from '@angular/core';
import { createStore, select, withProps } from '@ngneat/elf';
import {
  addEntities,
  deleteAllEntities,
  withEntities,
} from '@ngneat/elf-entities';
import {
  PaginationData,
  deleteAllPages,
  getPaginationData,
  hasPage,
  selectCurrentPageEntities,
  selectPaginationData,
  setPage,
  updatePaginationData,
  withPagination,
} from '@ngneat/elf-pagination';
import { IResult, ISearchResults } from '@collections/repositories/types';

export const RESULTS_PER_PAGE = 10;

export interface IPaginationProps {
  isLoading: boolean;
  nextCursor: string;
}

@Injectable({ providedIn: 'root' })
export class PaginationRepository {
  readonly _store$ = createStore(
    {
      name: `current-results`,
    },
    withEntities<IResult>(),
    withProps<IPaginationProps>({ isLoading: true, nextCursor: '*' }),
    withPagination()
  );

  readonly isLoading$ = this._store$.pipe(select(({ isLoading }) => isLoading));
  readonly currentPageEntities$ = this._store$.pipe(
    selectCurrentPageEntities()
  );
  readonly paginationData$ = this._store$.pipe(selectPaginationData());
  private lastLoadedPage = 0;

  initialize = (response: ISearchResults<IResult>) => {
    this.clear();
    this.setLoading(true);
    this.setNextCursor(response.nextCursorMark);
    this.updatePaginationData({
      total: response.numFound,
      perPage: RESULTS_PER_PAGE,
      lastPage: Math.ceil(response.numFound / RESULTS_PER_PAGE) || 1,
      currentPage: 1,
    });
    this.addResultsAndPaginate(response.results);
    this.setLoading(false);
  };

  paginationData = () => this._store$.query(getPaginationData());
  hasPage = (pageId: number) => this._store$.query(hasPage(pageId));
  nextCursor = () => this._store$.query(({ nextCursor }) => nextCursor);
  addResultsAndPaginate = (results: IResult[]) => {
    if (!this.paginationData().perPage) {
      throw Error('Pagination data must be set before adding new results.');
    }

    this._store$.update(addEntities(results));

    const resultsIds = results.map(({ id }) => id);
    const newPageId = this.lastLoadedPage + 1;
    const newPagesLen = Math.ceil(
      results.length / this.paginationData().perPage
    );

    for (let i = newPageId; i < newPageId + newPagesLen; i++) {
      this.setPage(i, resultsIds.splice(0, this.paginationData().perPage));
    }

    this.lastLoadedPage += newPagesLen;
  };

  setNextCursor = (cursor: string) =>
    this._store$.update((state) => ({
      ...state,
      nextCursor: cursor,
    }));

  updatePaginationData = (paginationData: Partial<PaginationData>) =>
    this._store$.update(
      updatePaginationData({
        ...this._store$.query(getPaginationData()),
        ...paginationData,
      })
    );

  clear = () => {
    this._store$.update(
      (state) => ({
        ...state,
        nextCursor: '*',
        isLoading: false,
      }),
      deleteAllEntities(),
      deleteAllPages()
    );
    this.lastLoadedPage = 0;
  };

  setLoading = (isLoading: boolean) =>
    this._store$.update((state) => ({
      ...state,
      isLoading,
    }));

  setPage = (pageId: number, resultsIds: string[]) =>
    this._store$.update(setPage(pageId, resultsIds));
}
