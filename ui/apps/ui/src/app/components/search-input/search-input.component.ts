import {
  Component,
  ElementRef,
  HostListener,
  Inject,
  Input,
  OnInit,
  ViewChild,
} from '@angular/core';
import { FormControl, UntypedFormControl } from '@angular/forms';
import {
  combineLatest,
  debounceTime,
  distinctUntilChanged,
  filter,
  iif,
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
import { ActivatedRoute, Router } from '@angular/router';
import { sanitizeQuery } from '@components/search-input/query.sanitizer';
import { NavConfigsRepository } from '@collections/repositories/nav-configs.repository';
import {
  ICollectionNavConfig,
  ICollectionTagsConfig,
} from '@collections/repositories/types';
import { DOCUMENT } from '@angular/common';
import { RedirectService } from '@collections/services/redirect.service';
import { COMMA, ENTER } from '@angular/cdk/keycodes';

export interface Tags {
  narrow: string;
  name: string;
}

@UntilDestroy()
@Component({
  selector: 'ess-search-input',
  template: `
    <div id="container">
      <div *ngIf="standardSearch" class="search-box">
        <form>
          <div class="input-group" style="padding-bottom: 5px;">
            <div class="phase-box">
              <input
                #inputQuery
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
              <button
                *ngIf="
                  (formControl.value && formControl.value.trim() !== '') ||
                  (hasSetQuery$ | async)
                "
                id="btn--clear-query"
                type="button"
                class="btn btn-secondary"
                (click)="clearQuery()"
              >
                Clear <span>&cross;</span>
              </button>
            </div>
            <select
              class="form-select"
              (click)="focused = false"
              [formControl]="collectionFc"
            >
              <option
                *ngFor="let navConfig of searchCollections"
                [ngValue]="navConfig"
              >
                {{ navConfig.title }}
              </option>
            </select>
            <div class="input-group-btn">
              <button
                class="btn btn-primary"
                type="button"
                (click)="updateQueryParams(formControl.value || '*')"
              >
                <i class="bi bi-search"></i>
              </button>
            </div>
          </div>
          <span
            *ngIf="!isLanding()"
            class="adv-search-text-btn"
            (click)="standardSearch = false"
            >Show Advanced Search</span
          >
        </form>

        <div
          class="list-group suggestions"
          *ngIf="suggestedResults.length > 0 && focused"
        >
          <ng-container *ngFor="let group of suggestedResults">
            <div class="list-group-item">
              <span class="group">{{ getLabel(group.label) }}</span>
              &nbsp;<a
                [routerLink]="['/search', group.link]"
                [queryParams]="{ q: formControl.value }"
                >see all</a
              >
            </div>
            <a
              *ngFor="let result of group.results"
              [attr.href]="
                redirectService.internalUrl(
                  result.url,
                  result.id,
                  result.type.value,
                  ''
                )
              "
              class="list-group-item list-group-item-action result"
              >{{ result.title }}</a
            >
          </ng-container>
        </div>
      </div>
      <div *ngIf="!standardSearch" class="search-box-adv">
        <form>
          <div class="input-group" style="margin-bottom: 5px;">
            <select
              class="form-select"
              style="margin-left: 0px;"
              (click)="focused = false"
              [formControl]="collectionFc"
            >
              <option
                *ngFor="let navConfig of searchCollections"
                [ngValue]="navConfig"
              >
                {{ navConfig.title }}
              </option>
            </select>
            <div class="phase-box">
              <input
                #inputQueryAdv
                type="text"
                class="form-control3"
                autocomplete="off"
                i18n-placeholder
                placeholder="Search in catalogs"
                (focus)="formControl.value ? (focused = true) : null"
                (keydown.enter)="
                  updateQueryParamsAdv(formControl.value || '*', $event)
                "
                [formControl]="formControl"
              />
              <button
                *ngIf="
                  (formControl.value && formControl.value.trim() !== '') ||
                  (hasSetQuery$ | async)
                "
                id="btn--clear-query"
                type="button"
                class="btn btn-secondary"
                (click)="clearQuery()"
              >
                Clear <span>&cross;</span>
              </button>
            </div>
            <div class="input-group-btn">
              <button
                class="btn btn-primary"
                type="button"
                (click)="updateQueryParamsAdv(formControl.value || '*')"
              >
                <i class="bi bi-search"></i>
              </button>
            </div>
          </div>
          <div
            *ngIf="tags.length !== 0"
            class="mb-2"
            style="margin-left:-45px;"
          >
            <span class="adv-search-text-tag" *ngFor="let elem of tags">
              <nz-tag nzMode="closeable" (nzOnClose)="remove(elem)">{{
                elem
              }}</nz-tag>
            </span>
          </div>

          <span class="adv-search-text">Narrow your search</span>
          <div class="input-group" style="margin-bottom: 5px; margin-top:5px;">
            <select
              class="form-select"
              style="margin-left: 0px;"
              (click)="focused = false"
              [formControl]="collectionFcAdvForm"
            >
              <option
                *ngFor="let navConfig of collectionFcAdv"
                [ngValue]="navConfig"
              >
                {{ navConfig.name }}
              </option>
            </select>
            <div class="phase-box">
              <input
                #inputQueryAdv2
                type="text"
                class="form-control2"
                autocomplete="off"
                i18n-placeholder
                placeholder="Narrow by: author, in author, exact phrase, in title, none of"
                (keydown.enter)="
                  add({
                    value: formControlAdv.value,
                    input: formControlAdv,
                    narrowed: collectionFcAdvForm.value.name
                  })
                "
                [formControl]="formControlAdv"
              />
              <button
                *ngIf="
                  formControlAdv.value && formControlAdv.value.trim() !== ''
                "
                id="btn--clear-query"
                type="button"
                class="btn btn-secondary"
                (click)="clearQueryAdv()"
              >
                Clear <span>&cross;</span>
              </button>
            </div>
            <div class="input-group-btn">
              <button
                class="btn btn-enter"
                type="button"
                (click)="
                  add({
                    value: formControlAdv.value,
                    input: formControlAdv,
                    narrowed: collectionFcAdvForm.value.name
                  })
                "
              >
                Add
              </button>
            </div>
          </div>
          <span
            class="adv-search-text-btn"
            (click)="
              standardSearch = true;
              tags = [];
              clearQueryAdv();
              updateQueryParamsAdv(this.formControl.value || '*')
            "
            >Hide and Clear Advanced Search</span
          >
        </form>

        <div
          class="list-group suggestions"
          *ngIf="suggestedResults.length > 0 && focused"
        >
          <ng-container *ngFor="let group of suggestedResults">
            <div class="list-group-item">
              <span class="group">{{ getLabel(group.label) }}</span>
              &nbsp;<a
                [routerLink]="['/search', group.link]"
                [queryParams]="{ q: formControl.value }"
                >see all</a
              >
            </div>
            <a
              *ngFor="let result of group.results"
              [attr.href]="
                redirectService.internalUrl(
                  result.url,
                  result.id,
                  result.type.value,
                  ''
                )
              "
              class="list-group-item list-group-item-action result"
              >{{ result.title }}</a
            >
          </ng-container>
        </div>
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
      .form-control2 {
        width: 683px !important;
        border-top-left-radius: 0 !important;
        border-bottom-left-radius: 0 !important;
      }

      .form-control3 {
        width: 565px !important;
        border-top-left-radius: 0 !important;
        border-bottom-left-radius: 0 !important;
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
      .btn-enter {
        color: #ffffff;
        height: 40px;
        background: #040f80;
        padding: 0 20px 0 20px;
        border: none;
        border-radius: 0 8px 8px 0;
      }
      .btn-enter:hover {
        color: #ffffff;
        height: 40px;
        background: #040f80a1;
        padding: 0 20px 0 20px;
        border: none;
        border-radius: 0 8px 8px 0;
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
        right: 0;
        font-size: 12px;
        border-radius: 50px;
        margin-right: 7px;
        padding: 4px 14px;
        background-color: rgba(0, 0, 0, 0.3);
        border: none;
      }
      #search,
      #btn--search {
        float: left;
        height: 40px;
      }

      .form-select {
        flex-grow: 0;
        flex-basis: 150px;
        width: auto;
        min-width: auto;
      }
      .form-select-adv {
        flex-grow: 0;
        flex-basis: 150px;
        width: auto;
        min-width: auto;
      }

      .input-group {
        display: flex;
        flex-wrap: nowrap;
      }

      .adv-search-text-btn {
        color: #ffffff;
        font-size: 12px;
        font-family: Inter;
        margin-left: -40px;
        cursor: pointer;
      }
      .adv-search-text {
        color: #ffffff;
        font-size: 12px;
        font-family: Inter;
        margin-left: -40px;
      }

      .adv-search-text-tag {
        color: #ffffff;
        font-size: 12px;
        font-family: Inter;
        margin-left: 0px;
      }

      @media (max-width: 992px) {
        .adv-search-text-btn {
          color: #ffffff;
          font-size: 12px;
          font-family: Inter;
          margin-left: 40px;
          cursor: pointer;
        }
        .adv-search-text {
          color: #ffffff;
          font-size: 12px;
          font-family: Inter;
          margin-left: 40px;
        }
      }
    `,
  ],
})
export class SearchInputComponent implements OnInit {
  @Input() navigateOnCollectionChange = true;

  @ViewChild('inputQuery', { static: true }) inputQuery!: ElementRef;
  @ViewChild('inputQueryAdv', { static: true }) inputQueryAdv!: ElementRef;
  @ViewChild('inputQueryAdv2', { static: true }) inputQueryAdv2!: ElementRef;

  visible = true;
  selectable = true;
  removable = true;
  addOnBlur = true;
  readonly separatorKeysCodes: number[] = [ENTER, COMMA];
  tags: string[] = [];
  focused = false;
  standardSearch = true;
  collectionFcAdv = [
    { name: 'author' },
    { name: 'exact' },
    { name: 'in title' },
    { name: 'none of' },
  ];

  faMagnifyingGlass = faMagnifyingGlass;
  formControl = new UntypedFormControl();
  formControlAdv = new UntypedFormControl();
  suggestedResults: ISuggestedResults[] = [];
  hasSetQuery$ = this._customRoute.q$.pipe(map((q: string) => q && q !== '*'));
  searchCollections = this._navConfigsRepository.getAll();
  collectionFc = new FormControl<ICollectionNavConfig>(
    this.searchCollections[0],
    { nonNullable: true }
  );

  collectionFcAdvForm = new FormControl<ICollectionTagsConfig>(
    this.collectionFcAdv[0],
    { nonNullable: true }
  );

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  add(event: { input: any; value: any; narrowed: any }): void {
    const input = event.input;
    const value = event.value;
    const narrow = event.narrowed;

    // Add our tags
    if ((value || '').trim()) {
      if (narrow === 'in author') {
        // Not used for now, but keep it
        const splitted = value.trim().split(' ');
        splitted.forEach((el: string) => {
          if (el.trim() !== '') {
            this.tags.push(narrow + ': ' + el.trim());
          }
        });
      } else {
        this.tags.push(narrow + ': ' + value.trim());
      }
    }

    // Reset the input value
    if (input) {
      input.value = '';
    }

    this.clearQueryAdv();
    this.updateQueryParamsAdv(this.formControl.value || '*');
  }

  remove(tag: string): void {
    const index = this.tags.indexOf(tag);

    if (index >= 0) {
      this.tags.splice(index, 1);
    }
    this.updateQueryParamsAdv(this.formControl.value || '*');
  }

  // TODO: stream event - off when search is not focused and what with suggestes result set on []
  @HostListener('document:click')
  clicked() {
    if (this.suggestedResults.length > 0) {
      this.focused = false;
      this.suggestedResults = [];
    }
  }

  constructor(
    public redirectService: RedirectService,
    private _customRoute: CustomRoute,
    private _router: Router,
    private _searchInputService: SearchInputService,
    private _navConfigsRepository: NavConfigsRepository,
    private _route: ActivatedRoute,
    @Inject(DOCUMENT) private _document: Document
  ) {}

  ngOnInit() {
    this._customRoute.q$
      .pipe(
        untilDestroyed(this),
        filter((q: string) => q !== '*'),
        filter((q) => q !== this.formControl.value)
      )
      .subscribe((q) => this.formControl.setValue(q));

    this._customRoute.collection$
      .pipe(untilDestroyed(this))
      .subscribe((collection) =>
        this.collectionFc.setValue(
          this._navConfigsRepository.get(collection) ??
            this.searchCollections[0],
          { emitEvent: false }
        )
      );

    const std = this._route.snapshot.queryParamMap.get('standard');
    if (std) {
      this.standardSearch = std === 'true';
    }

    const tgs = this._route.snapshot.queryParamMap.getAll('tags');
    if (typeof tgs === 'string') {
      this.tags.push(tgs);
    } else if (tgs) {
      tgs.forEach((el) => this.tags.push(el));
    }

    combineLatest({
      q: this.formControl.valueChanges.pipe(
        untilDestroyed(this),
        map((q) => sanitizeQuery(q) ?? '*'),
        distinctUntilChanged(),
        debounceTime(150),
        tap((q) => (q ? (this.focused = true) : null))
      ),
      collection: this._customRoute.collection$.pipe(
        untilDestroyed(this),
        map(
          (collection) =>
            this._navConfigsRepository.get(collection) as ICollectionNavConfig
        )
      ),
    })
      .pipe(
        switchMap(({ q, collection }) =>
          iif(
            () => this.standardSearch,
            this._searchInputService
              .currentSuggestions(q, collection.id)
              .pipe(untilDestroyed(this)),
            this._searchInputService
              .currentSuggestionsAdv(q, collection.id, this.tags)
              .pipe(untilDestroyed(this))
          )
        )
      )
      .subscribe(
        (suggestedResults) => (this.suggestedResults = suggestedResults)
      );
    this.collectionFc.valueChanges
      .pipe(untilDestroyed(this))
      .subscribe((navConfig) =>
        this.setCollection(this.formControl.value, navConfig)
      );
  }

  isLanding() {
    return !this._router.url.includes(SEARCH_PAGE_PATH);
  }

  async updateQueryParams(q: string, $event: Event | null = null) {
    if ($event) {
      $event.stopPropagation();
      $event.preventDefault();
    }

    const url = this._router.url.includes(SEARCH_PAGE_PATH)
      ? []
      : [`/${SEARCH_PAGE_PATH}/${this.collectionFc.value.urlParam}`];
    this.focused = false;
    await this._router.navigate(url, {
      queryParams: {
        q: sanitizeQuery(q) ?? '*',
        tags: this.tags,
        standard: this.standardSearch.toString(),
      },
      queryParamsHandling: 'merge',
    });
  }

  async updateQueryParamsAdv(q: string, $event: Event | null = null) {
    if ($event) {
      $event.stopPropagation();
      $event.preventDefault();
    }

    const url = this._router.url.includes(SEARCH_PAGE_PATH)
      ? []
      : [`/${SEARCH_PAGE_PATH}/${this.collectionFc.value.urlParam}`];
    this.focused = false;
    await this._router.navigate(url, {
      queryParams: {
        q: sanitizeQuery(q) ?? '*',
        tags: this.tags,
        standard: this.standardSearch.toString(),
      },
      queryParamsHandling: 'merge',
    });
  }

  async clearQuery() {
    this.formControl.setValue('');
    await this.updateQueryParams('*');
  }

  async clearQueryAdv() {
    this.formControlAdv.setValue('');
  }

  async setCollection(q: string, $event: ICollectionNavConfig) {
    if (!this.navigateOnCollectionChange) {
      return;
    }

    await this._router.navigate(['/search', $event.urlParam], {
      queryParams: {
        q: sanitizeQuery(q) ?? '*',
        tags: this.tags,
        standard: this.standardSearch.toString(),
      },
    });
  }

  getLabel(label: string): string {
    switch (label) {
      case 'guideline':
        return 'INTEROPERABILITY GUIDELINES';
        break;
      case 'bundle':
        return 'BUNDLES';
        break;
      default:
        return label;
    }
  }
}
