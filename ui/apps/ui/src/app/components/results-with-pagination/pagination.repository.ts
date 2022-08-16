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
import { IResult, ISearchResults } from '../../collections/repositories/types';

export const MAX_COLLECTION_RESULTS = 100;
export const RESULTS_PER_PAGE = 10;
export const MAX_PAGES_PER_LOAD = MAX_COLLECTION_RESULTS / RESULTS_PER_PAGE;

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
    withProps<IPaginationProps>({ isLoading: false, nextCursor: '*' }),
    withPagination()
  );

  readonly isLoading$ = this._store$.pipe(select(({ isLoading }) => isLoading));
  readonly currentPageEntities$ = this._store$.pipe(
    selectCurrentPageEntities()
  );
  readonly paginationData$ = this._store$.pipe(selectPaginationData());

  initialize = (response: ISearchResults<any>) => {
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
    let newPageId =
      this.paginationData().currentPage === 1
        ? 1
        : this.paginationData().currentPage + 1;
    while (resultsIds.length > 0) {
      this.setPage(
        newPageId,
        resultsIds.splice(0, this.paginationData().perPage)
      );
      newPageId += 1;
    }
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
  clear = () =>
    this._store$.update(
      (state) => ({
        ...state,
        nextCursor: '*',
        isLoading: false,
      }),
      deleteAllEntities(),
      deleteAllPages()
    );
  setLoading = (isLoading: boolean) =>
    this._store$.update((state) => ({
      ...state,
      isLoading,
    }));
  setPage = (pageId: number, resultsIds: string[]) =>
    this._store$.update(setPage(pageId, resultsIds));
}
