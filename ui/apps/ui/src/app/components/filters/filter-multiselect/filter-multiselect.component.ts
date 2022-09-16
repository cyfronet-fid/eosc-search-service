import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { FilterMultiselectService } from './filter-multiselect.service';
import { FilterTreeNode } from '../types';
import { FilterMultiselectRepository } from './filter-multiselect.repository';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { debounceTime, map, skip, switchMap, tap } from 'rxjs';
import { UntypedFormControl } from '@angular/forms';
import { CustomRouter } from '@collections/services/custom.router';
import { combineLatest } from 'rxjs';

@UntilDestroy()
@Component({
  selector: 'ess-filter',
  template: `
    <div class="filter">
      <span class="filter-title"
        ><b>{{ label }}</b></span
      >
      <span (click)="resetAllActiveEntities()">
        &nbsp; &nbsp;
        <a href="javascript:void(0)" class="clear-button">clear all</a>
      </span>

      <ng-container *ngIf="(isLoading$ | async) === false">
        <ess-checkboxes-tree
          [data]="$any(activeEntities$ | async)"
          (checkboxesChange)="$event[1] === false ? toggleActive($event) : null"
        ></ess-checkboxes-tree>
        <ess-checkboxes-tree
          *ngIf="!showMore"
          [data]="$any(limitedNonActiveEntities$ | async)"
          (checkboxesChange)="$event[1] === true ? toggleActive($event) : null"
        ></ess-checkboxes-tree>

        <ng-container *ngIf="showMore">
          <input
            [attr.placeholder]="'Search...'"
            class="query-input form-control form-control-sm"
            [formControl]="queryFc"
          />
          <div class="filter__viewport" (scroll)="onScroll($event)" #content>
            <ess-checkboxes-tree
              [data]="$any(chunkedEntities$ | async)"
              (checkboxesChange)="
                $event[1] === true ? toggleActive($event) : null
              "
            ></ess-checkboxes-tree>
          </div>
        </ng-container>
        <span *ngIf="hasShowMore$ | async" (click)="showMore = !showMore">
          <a href="javascript:void(0)" class="show-more">{{
            showMore ? 'show less' : 'show more'
          }}</a>
        </span>
      </ng-container>

      <ng-container *ngIf="isLoading$ | async">
        <nz-skeleton-element
          nzType="input"
          [nzActive]="true"
          nzSize="small"
          style="width: 100%; padding-bottom: 5px"
        ></nz-skeleton-element>
        <nz-skeleton-element
          nzType="input"
          [nzActive]="true"
          nzSize="small"
          style="width: 100%; padding-bottom: 5px"
        ></nz-skeleton-element>
        <nz-skeleton-element
          nzType="input"
          [nzActive]="true"
          nzSize="small"
          style="width: 100%; padding-bottom: 5px"
        ></nz-skeleton-element>
      </ng-container>
    </div>
  `,
  styles: [
    `
      .filter__viewport {
        max-height: 290px;
        overflow: auto;
      }
      .filter {
        margin-bottom: 10px;
      }
      .filter-title {
        padding-bottom: 6px;
        display: inline-block;
      }
      .query-input {
        margin-bottom: 12px;
      }
    `,
  ],
  providers: [FilterMultiselectService, FilterMultiselectRepository],
})
export class FilterMultiselectComponent implements OnInit {
  @ViewChild('content', { static: false }) content?: unknown;

  @Input()
  label!: string;

  @Input()
  set filter(filter: string) {
    this._filter = filter;
    this._filterMultiselectService.filter = filter;
  }

  _filter = '';
  showMore = false;
  hasShowMore$ = this._filterMultiselectService.hasShowMore$;

  isLoading$ = this._filterMultiselectService.isLoading$;
  activeEntities$ = this._filterMultiselectService.activeEntities$;

  chunkedEntities$ = this._filterMultiselectService.chunkedNonActiveEntities$;
  limitedNonActiveEntities$ =
    this._filterMultiselectService.limitedNonActiveEntities$;

  queryFc = new UntypedFormControl('');

  onScroll = this._filterMultiselectService.onScroll;

  constructor(
    private _customRouter: CustomRouter,
    private _filterMultiselectService: FilterMultiselectService
  ) {}

  ngOnInit() {
    this._filterMultiselectService
      ._loadAllAvailableValues$(
        this._customRouter.params()['collection'] as string
      )
      .pipe(
        untilDestroyed(this),
        tap(() =>
          this._filterMultiselectService.setActiveIds(
            this._customRouter.fqMap()[this._filterMultiselectService.filter] ??
              []
          )
        ),
        switchMap(() =>
          this._filterMultiselectService
            ._updateCounts$({
              ...this._customRouter.params(),
              fq: this._customRouter.fqWithExcludedFilter(
                this._filterMultiselectService.filter
              ),
            })
            .pipe(untilDestroyed(this))
        )
      )
      .subscribe();

    this._customRouter.fqMap$
      .pipe(
        untilDestroyed(this),
        skip(1),
        map((fqMap) => fqMap[this._filter] ?? []),
        tap((activeIds) =>
          this._filterMultiselectService.setActiveIds(activeIds)
        )
      )
      .subscribe();

    // load on changes other than collection
    combineLatest(
      this._customRouter
        .fqWithExcludedFilter$(this._filter)
        .pipe(untilDestroyed(this)),
      this._customRouter.q$.pipe(untilDestroyed(this))
    )
      .pipe(
        skip(1),
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        map(([fq, _]) => fq),
        switchMap((fq) =>
          this._filterMultiselectService._updateCounts$({
            ...this._customRouter.params(),
            fq,
          })
        )
      )
      .subscribe();

    this._filterMultiselectService.initNonActiveEntitiesChunk$
      .pipe(untilDestroyed(this))
      .subscribe();

    this.queryFc.valueChanges
      .pipe(untilDestroyed(this), debounceTime(300))
      .subscribe((query) => this._filterMultiselectService.setQuery(query));
  }

  resetAllActiveEntities = () =>
    this._customRouter.removeFilterFromUrl(
      this._filterMultiselectService.filter
    );

  toggleActive = async (event: [FilterTreeNode, boolean]) => {
    const [node, currentIsSelected] = event;
    const { filter, value, isSelected } = node;
    if (isSelected === currentIsSelected) {
      return;
    }

    if (currentIsSelected) {
      await this._customRouter.addFilterValueToUrl(filter, value);
      return;
    }
    await this._customRouter.removeFilterValueFromUrl(filter, value);
  };
}
