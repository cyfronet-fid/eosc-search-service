import { Injectable } from '@angular/core';
import { PaginationRepository } from './pagination.repository';
import { ISearchResults } from '../../collections/repositories/types';
import {paramType} from "../../pages/search-page/custom-router.type";

@Injectable({ providedIn: 'root' })
export class PaginationService {
  constructor(private _paginationRepository: PaginationRepository) {}

  entities$ = this._paginationRepository.currentPageEntities$;
  isLoading$ = this._paginationRepository.isLoading$;
  paginationData$ = this._paginationRepository.paginationData$;
  nextCursor = this._paginationRepository.nextCursor;
  setLoading = this._paginationRepository.setLoading;
  currentPage = () => this._paginationRepository.paginationData().currentPage;

  initPagination = (response: ISearchResults<any>) => this._paginationRepository.initialize(response);
  updatePagination = (
    allUrlParams: { [name: string]: paramType },
    response: ISearchResults<any>
  ) => {
    this._paginationRepository.addResultsAndPaginate(response.results);
    this._paginationRepository.setNextCursor(response.nextCursorMark);
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
