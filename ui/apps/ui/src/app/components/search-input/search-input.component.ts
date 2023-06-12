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
import { sanitizeQuery } from '@components/search-input/query.sanitizer';
import { NavConfigsRepository } from '@collections/repositories/nav-configs.repository';
import { ICollectionNavConfig } from '@collections/repositories/types';
import { DOCUMENT } from '@angular/common';
import { RedirectService } from '@collections/services/redirect.service';

@UntilDestroy()
@Component({
  selector: 'ess-search-input',
  template: `
    <div id="container">
      <div class="search-box">
        <form>
          <div class="input-group">
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
        right: 0;
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

      .form-select {
        flex-grow: 0;
        flex-basis: 150px;
        width: auto;
        min-width: auto;
      }

      .input-group {
        display: flex;
        flex-wrap: nowrap;
      }
    `,
  ],
})
export class SearchInputComponent implements OnInit {
  focused = false;

  faMagnifyingGlass = faMagnifyingGlass;
  formControl = new UntypedFormControl();

  suggestedResults: ISuggestedResults[] = [];
  hasSetQuery$ = this._customRoute.q$.pipe(map((q: string) => q && q !== '*'));
  searchCollections = this._navConfigsRepository.getAll();
  collectionFc = new FormControl<ICollectionNavConfig>(
    this.searchCollections[0],
    { nonNullable: true }
  );

  @Input() navigateOnCollectionChange = true;

  @ViewChild('inputQuery', { static: true }) inputQuery!: ElementRef;

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
          this._searchInputService
            .currentSuggestions(q, collection.id)
            .pipe(untilDestroyed(this))
        )
      )
      .subscribe(
        (suggestedResults) => (this.suggestedResults = suggestedResults)
      );
    this.collectionFc.valueChanges
      .pipe(untilDestroyed(this))
      .subscribe((navConfig) => this.setCollection(navConfig));
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
    this.inputQuery.nativeElement.blur();
    await this._router.navigate(url, {
      queryParams: {
        q: sanitizeQuery(q) ?? '*',
      },
      queryParamsHandling: 'merge',
    });
  }

  async clearQuery() {
    this.formControl.setValue('');
    await this.updateQueryParams('*');
  }

  async setCollection($event: ICollectionNavConfig) {
    if (!this.navigateOnCollectionChange) {
      return;
    }
    await this._router.navigate(['/search', $event.urlParam], {
      queryParamsHandling: 'preserve',
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
