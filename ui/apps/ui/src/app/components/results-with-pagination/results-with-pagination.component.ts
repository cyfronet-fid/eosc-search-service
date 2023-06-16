import { Component, Input, OnInit, TrackByFunction } from '@angular/core';
import { PaginationService } from './pagination.service';
import { BehaviorSubject, skip, tap } from 'rxjs';
import { isEqual, omit, range } from 'lodash-es';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { IResult, ISearchResults } from '@collections/repositories/types';
import { CustomRoute } from '@collections/services/custom-route.service';
import { paramType } from '@collections/services/custom-route.type';
import { Router } from '@angular/router';

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
      <ng-container
        *ngFor="let result of results$ | async; trackBy: trackByResultId"
      >
        <ess-result
          *ngIf="
            result.type.value.toString().includes('provider');
            else defaultResultTemplate
          "
          class="results"
          [id]="result.id"
          [title]="result.title"
          [tags]="result.tags"
          [description]="result.description | transformArrayDescriptionPipe"
          [abbreviation]="result.abbreviation ?? ''"
          [type]="result.type"
          [date]="result.date"
          [highlights]="highlights[result.id] ?? {}"
          [url]="result.url"
        ></ess-result>
        <ng-template #defaultResultTemplate>
          <ess-result
            class="results"
            [id]="result.id"
            [title]="result.title"
            [description]="result.description | transformArrayDescriptionPipe"
            [type]="result.type"
            [url]="result.url"
            [tags]="result.tags"
            [coloredTags]="result.coloredTags ?? []"
            [secondaryTags]="result.secondaryTags ?? []"
            [views]="result.views"
            [downloads]="result.downloads"
            [accessRight]="result.accessRight"
            [date]="result.date"
            [highlights]="highlights[result.id] ?? {}"
            [offers]="result.offers ?? []"
          ></ess-result>
        </ng-template>
      </ng-container>

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
  highlights: {
    [id: string]: { [field: string]: string[] | undefined } | undefined;
  } = {};

  @Input()
  set response(response: ISearchResults<IResult> | null) {
    if (response === null) {
      return;
    }

    if (this._shouldResetCursor()) {
      this._router
        .navigate([], {
          queryParams: {
            cursor: '*',
          },
          queryParamsHandling: 'merge',
        })
        .then();
      return;
    }

    const params = this._customRoute.params();
    if (this._shouldInitPagination(params)) {
      this._paginationService.initPagination(response);
      this.highlights = response.highlighting ?? {};
      return;
    }

    this._paginationService.updatePagination(
      params,
      response,
      this.pageNr$.value
    );
    this.highlights = response.highlighting ?? {};

    this._paginationService.setLoading(false);
  }

  pageNr$ = new BehaviorSubject<number>(1);
  results$ = this._paginationService.entities$;
  isLoading$ = this._paginationService.isLoading$;
  paginationData$ = this._paginationService.paginationData$;
  range = range;
  trackByResultId: TrackByFunction<IResult> = (
    index: number,
    entity: IResult
  ) => entity.id;

  constructor(
    private _paginationService: PaginationService,
    private _customRoute: CustomRoute,
    private _router: Router
  ) {}

  ngOnInit() {
    this.pageNr$
      .pipe(
        untilDestroyed(this),
        skip(1),
        tap((pageNr) => {
          setTimeout(() => {
            window.scrollTo(0, 0);
          }, 100);
          this._loadNewPage(pageNr);
        })
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
    await this._router.navigate([], {
      queryParams: {
        cursor,
      },
      queryParamsHandling: 'merge',
    });
  }

  _shouldResetCursor() {
    const cursor = this._customRoute.cursor();
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
