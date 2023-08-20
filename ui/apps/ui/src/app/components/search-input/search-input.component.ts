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
import { ISuggestedResultsGroup } from './types';
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
  templateUrl: './search-input.component.html',
  styleUrls: ['./search-input.component.scss'],
})
export class SearchInputComponent implements OnInit {
  @Input() navigateOnCollectionChange = true;

  @ViewChild('inputQuery', { static: true }) inputQuery!: ElementRef;
  @ViewChild('inputQueryAdv', { static: true }) inputQueryAdv!: ElementRef;
  @ViewChild('inputQueryAdv2', { static: true }) inputQueryAdv2!: ElementRef;

  exactmatch = false;
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
    { name: 'keyword' },
    { name: 'none of' },
  ];

  faMagnifyingGlass = faMagnifyingGlass;
  formControl = new UntypedFormControl();

  suggestedResults: ISuggestedResultsGroup[] = [];
  formControlAdv = new UntypedFormControl();
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

    const exact = this._route.snapshot.queryParamMap.get('exact');
    if (exact) {
      this.exactmatch = exact === 'true';
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
              .currentSuggestions(
                q,
                collection.id,
                this.exactmatch.toString().toLowerCase()
              )
              .pipe(untilDestroyed(this)),
            this._searchInputService
              .currentSuggestionsAdv(
                q,
                collection.id,
                this.tags,
                this.exactmatch.toString().toLowerCase()
              )
              .pipe(untilDestroyed(this))
          )
        )
      )
      .subscribe((suggestedResults) => {
        this.suggestedResults = suggestedResults;
      });
    this.collectionFc.valueChanges
      .pipe(untilDestroyed(this))
      .subscribe((navConfig) =>
        this.setCollection(this.formControl.value, navConfig)
      );
  }

  onCheckboxChange() {
    this.exactmatch = !this.exactmatch;
    this.updateQueryParamsAdv(this.formControl.value || '*');
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
        exact: this.exactmatch.toString().toLowerCase(),
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
        exact: this.exactmatch.toString().toLowerCase(),
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
        exact: this.exactmatch.toString().toLowerCase(),
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
