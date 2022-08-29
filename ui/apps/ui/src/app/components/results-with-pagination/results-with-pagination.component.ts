import { Component, Input, OnInit } from '@angular/core';
import { PaginationService } from './pagination.service';
import { BehaviorSubject, skip, tap } from 'rxjs';
import { isEqual, omit, range } from 'lodash-es';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { IResult, ISearchResults } from '../../collections/repositories/types';
import { CustomRouter } from '@collections/services/custom.router';
import { paramType } from '@collections/services/custom-router.type';

@UntilDestroy()
@Component({
  selector: 'ess-results-with-pagination',
  template: `
    <ng-container *ngIf="isLoading$ | async">
      <nz-skeleton-element
        nzType="input"
        [nzActive]="true"
        style="width:200px"
      ></nz-skeleton-element>
      <nz-skeleton
        *ngFor="let i of range(0, 5)"
        [nzActive]="true"
      ></nz-skeleton>
      <nz-skeleton-element
        nzType="input"
        [nzActive]="true"
        style="width:200px"
      ></nz-skeleton-element>
    </ng-container>
    <nz-empty
      *ngIf="
        $any(results$ | async)?.length === 0 && (isLoading$ | async) === false
      "
    ></nz-empty>
    <ng-container
      *ngIf="
        $any(results$ | async)?.length > 0 && (isLoading$ | async) === false
      "
    >
      <ess-pagination
        [paginationData]="$any(paginationData$ | async)"
        [loading]="(isLoading$ | async) ?? false"
        (activePageChange)="pageNr$.next($event)"
      ></ess-pagination>
      <ess-result
        class="results"
        *ngFor="let result of results$ | async"
        [title]="result.title"
        [description]="result.description"
        [type]="result.type"
        [url]="result.url"
        [typeUrlPath]="'/search/' + result.typeUrlPath"
        [tags]="result.tags"
      ></ess-result>
      <ess-pagination
        [paginationData]="$any(paginationData$ | async)"
        [loading]="(isLoading$ | async) ?? false"
        (activePageChange)="pageNr$.next($event)"
      ></ess-pagination>
    </ng-container>
  `,
  styles: [],
})
export class ResultsWithPaginationComponent implements OnInit {
  _prevParamsWithoutCursor: { [name: string]: paramType } = {};

  @Input()
  set response(response: ISearchResults<IResult> | null) {
    if (response === null) {
      return;
    }

    if (this._shouldResetCursor()) {
      this._customRouter.setCursorInUrl().then();
      return;
    }

    const params = this._customRouter.params();
    if (this._shouldInitPagination(params)) {
      this._paginationService.initPagination(response);
      return;
    }

    this._paginationService.updatePagination(params, response);
    this._paginationService.setLoading(false);
  }

  pageNr$ = new BehaviorSubject<number>(1);
  results$ = this._paginationService.entities$;
  isLoading$ = this._paginationService.isLoading$;
  paginationData$ = this._paginationService.paginationData$;
  range = range;

  constructor(
    private _paginationService: PaginationService,
    private _customRouter: CustomRouter
  ) {}

  ngOnInit() {
    this.pageNr$
      .pipe(
        untilDestroyed(this),
        skip(1),
        tap((pageNr) => this._loadNewPage(pageNr))
      )
      .subscribe();
  }

  async _loadNewPage(pageNr: number) {
    this._paginationService.setLoading(true);
    if (this._paginationService.hasPage(pageNr)) {
      this._paginationService.loadExistingPage(pageNr);
      this._paginationService.setLoading(false);
      return;
    }

    const cursor = this._paginationService.nextCursor();
    await this._customRouter.setCursorInUrl(cursor);
  }

  _shouldResetCursor() {
    const cursor = this._customRouter.cursor();
    if (!cursor || cursor === '*') {
      return false;
    }

    const currentPage = this._paginationService.currentPage();
    return currentPage === 1;
  }

  _shouldInitPagination(params: { [param: string]: paramType }) {
    const paramsWithoutCursor = omit(params, ['cursor']);
    const shouldInitPagination = !isEqual(
      paramsWithoutCursor,
      this._prevParamsWithoutCursor
    );
    this._prevParamsWithoutCursor = paramsWithoutCursor;
    return shouldInitPagination;
  }
}
