import { Injectable } from '@angular/core';
import { PaginationRepository } from './pagination.repository';
import { IResult, ISearchResults } from '@collections/repositories/types';
import { paramType } from '@collections/services/custom-route.type';

@Injectable({ providedIn: 'root' })
export class PaginationService {
  constructor(private _paginationRepository: PaginationRepository) {}

  entities$ = this._paginationRepository.currentPageEntities$;
  isLoading$ = this._paginationRepository.isLoading$;
  paginationData$ = this._paginationRepository.paginationData$;
  nextCursor = this._paginationRepository.nextCursor;
  setLoading = this._paginationRepository.setLoading;
  currentPage = () => this._paginationRepository.paginationData().currentPage;

  initPagination = (response: ISearchResults<IResult>) =>
    this._paginationRepository.initialize(response);

  updatePagination = (
    allUrlParams: { [name: string]: paramType },
    response: ISearchResults<IResult>,
    newPageNr: number
  ) => {
    this._paginationRepository.addResultsAndPaginate(response.results);
    this._paginationRepository.setNextCursor(response.nextCursorMark);
    this._paginationRepository.updatePaginationData({
      currentPage: newPageNr,
    });
  };

  hasPage = (pageNr: number) => {
    const currentPage = this._paginationRepository.paginationData().currentPage;
    const hasPage = this._paginationRepository.hasPage(pageNr);
    return hasPage || currentPage === pageNr;
  };

  loadExistingPage = (pageNr: number) => {
    this._paginationRepository.updatePaginationData({
      currentPage: pageNr,
    });
  };
}
