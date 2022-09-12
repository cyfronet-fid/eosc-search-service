import { Component, OnInit } from '@angular/core';
import { UntypedFormControl } from '@angular/forms';
import {
  debounceTime,
  distinctUntilChanged,
  filter,
  map,
  switchMap,
  tap,
} from 'rxjs';
import { faMagnifyingGlass } from '@fortawesome/free-solid-svg-icons';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { SearchInputService } from './search-input.service';
import { CustomRoute } from '@collections/services/custom-route.service';
import { SEARCH_PAGE_PATH } from '@collections/services/custom-route.type';
import { ISuggestedResults } from './type';
import { Router } from '@angular/router';
import { escapeQuery } from '@collections/services/custom-route.utils';

@UntilDestroy()
@Component({
  selector: 'ess-search-input',
  template: `
    <div id="container">
      <div class="search-box">
        <form>
          <div class="input-group">
            <input
              type="text"
              class="form-control"
              autocomplete="off"
              i18n-placeholder
              placeholder="Search in catalogs"
              (focus)="formControl.value ? (focused = true) : null"
              (keydown.enter)="
                updateQueryParams(formControl.value || '*', $event)
              "
              [formControl]="formControl"
            />
            <div class="input-group-btn">
              <button
                class="btn btn-primary"
                type="button"
                (click)="updateQueryParams(formControl.value || '*')"
              >
                <i class="bi bi-search"></i> Search
              </button>
            </div>
          </div>
        </form>
      </div>
      <button
        *ngIf="formControl.value && formControl.value.trim() !== ''"
        id="btn--clear-query"
        style="margin-right: 5px;"
        type="button"
        class="btn btn-secondary"
        (click)="clearQuery()"
      >
        Clear phrase <span>&cross;</span>
      </button>

      <div
        class="list-group suggestions"
        *ngIf="suggestedResults.length > 0 && focused"
      >
        <ng-container *ngFor="let group of suggestedResults">
          <div class="list-group-item">
            <span class="group">{{ group.label }}</span> &nbsp;<a
              [routerLink]="['/search', group.link]"
              [queryParams]="{ q: formControl.value }"
              >see all</a
            >
          </div>
          <a
            *ngFor="let result of group.results"
            href="javascript:void(0)"
            (click)="openInNewTab(result.url)"
            class="list-group-item list-group-item-action result"
            >{{ result.title }}</a
          >
        </ng-container>
      </div>
    </div>
    <div class="backdrop" *ngIf="focused" (click)="focused = false"></div>
  `,
  styles: [
    `
      .backdrop {
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background-color: black;
        opacity: 0;
        z-index: 10;
      }
      .suggestions {
        text-align: left;
        position: absolute;
        top: 40px;
        width: calc(100% - 150px);
        left: 20px;
        border-radius: 0 0 10px 10px;
        z-index: 10;
      }
      .suggestions .group {
        text-transform: uppercase;
        color: #6c757d;
      }
      .suggestions .result {
        padding-left: 40px;
      }
      .suggestions a.result {
        color: #3987be;
      }

      #container {
        z-index: 11;
        position: relative;
      }
      #search {
        width: calc(100% - 120px);
        border: solid 1px rgba(0, 0, 0, 0.1);
        border-radius: 25px 0 0 25px;
        padding-left: 20px;
      }
      #search:focus {
        border: solid 1px rgba(0, 0, 0, 0.1);
      }
      #btn--search {
        border-radius: 0 25px 25px 0;
        width: 120px;
        background-color: #3987be;
      }
      #btn--clear-query {
        position: absolute;
        top: 7px;
        right: 130px;
        font-size: 12px;
        border-radius: 50px;
        padding: 4px 14px;
        background-color: rgba(0, 0, 0, 0.3);
        border: none;
      }
      #search,
      #btn--search {
        float: left;
        height: 40px;
      }
    `,
  ],
})
export class SearchInputComponent implements OnInit {
  focused = false;

  faMagnifyingGlass = faMagnifyingGlass;
  formControl = new UntypedFormControl();

  suggestedResults: ISuggestedResults[] = [];

  constructor(
    private _customRoute: CustomRoute,
    private _router: Router,
    private _searchInputService: SearchInputService
  ) {}

  ngOnInit() {
    this._customRoute.q$
      .pipe(
        untilDestroyed(this),
        filter((q: string) => q !== '*'),
        filter((q) => q !== this.formControl.value)
      )
      .subscribe((q) => this.formControl.setValue(q));

    this.formControl.valueChanges
      .pipe(
        map((q: string) => q.trim()),
        distinctUntilChanged(),
        debounceTime(150),
        tap((q) => (q ? (this.focused = true) : null)),
        switchMap((q) => this._searchInputService.currentSuggestions(q))
      )
      .subscribe(
        (suggestedResults) => (this.suggestedResults = suggestedResults)
      );
  }

  async updateQueryParams(q: string, $event: Event | null = null) {
    if ($event) {
      $event.stopPropagation();
      $event.preventDefault();
    }

    const url = this._router.url.includes(SEARCH_PAGE_PATH)
      ? []
      : [`/${SEARCH_PAGE_PATH}`];
    await this._router.navigate(url, {
      queryParams: {
        q: escapeQuery(q).trim(),
      },
      queryParamsHandling: 'merge',
    });
  }

  openInNewTab(url: string) {
    window.open(url, '_blank');
    this.focused = false;
  }

  async clearQuery() {
    this.formControl.setValue('');
    await this.updateQueryParams('*');
  }
}
