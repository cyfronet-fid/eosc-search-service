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
import { SPECIAL_COLLECTIONS } from '@collections/data/config';
import { DEFAULT_SCOPE } from '@collections/services/custom-route.service';

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

  placeholderText: string = '';
  radioValueAuthor = 'A';
  radioValueExact = 'A';
  radioValueTitle = 'A';
  radioValueKeyword = 'A';
  exactmatch = false;
  visible = true;
  selectable = true;
  removable = true;
  addOnBlur = true;
  readonly separatorKeysCodes: number[] = [ENTER, COMMA];
  tags: string[] = [];
  focused = false;
  tooltipText: string | undefined;
  standardSearch = true;
  scope: string = DEFAULT_SCOPE;
  collectionFcAdv = [
    { name: 'Author' },
    { name: 'Exact' },
    { name: 'In title' },
    { name: 'Keyword' },
    { name: 'DOI' },
    { name: 'None of' },
  ];
  optionsDropdownSelectedValue: ICollectionTagsConfig = this.collectionFcAdv[2];
  isSpecialCollection = false;
  isDOISelected = false;

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
    this.collectionFcAdv[2],
    { nonNullable: true }
  );

  setPlaceholderText(collection: string): string {
    switch (collection) {
      case 'service':
      case 'data_source':
        return 'Narrow by: title, keywords, exact, none of';
      case 'bundle':
      case 'guideline':
      case 'training':
        return 'Narrow by: author, title, keywords, exact, none of';
      default:
        return 'Narrow by: author, title, DOI, keywords, exact, none of';
    }
  }
  hasKeyword: string[] = [
    'all_collection',
    'publication',
    'dataset',
    'software',
    'other_rp',
    'training',
    'service',
    'data_source',
  ];
  hasAuthor: string[] = [
    'all_collection',
    'publication',
    'dataset',
    'software',
    'other_rp',
    'training',
  ];
  hasDOI: string[] = [
    'all_collection',
    'publication',
    'dataset',
    'software',
    'other_rp',
  ];

  withKeyword(): boolean {
    return this.hasKeyword.includes(this.collectionFc.value.id);
  }

  withAuthor(): boolean {
    return this.hasAuthor.includes(this.collectionFc.value.id);
  }

  withDOI(): boolean {
    return this.hasDOI.includes(this.collectionFc.value.id);
  }

  shouldDisplayOption(navConfig: { name: string }): boolean {
    return !(
      (navConfig.name === 'Keyword' && !this.withKeyword()) ||
      (navConfig.name === 'Author' && !this.withAuthor()) ||
      (navConfig.name === 'DOI' && !this.withDOI())
    );
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  add(event: { input: any; value: any; narrowed: any }): void {
    const input = event.input;
    const value = event.value;
    const narrow = event.narrowed.toLowerCase();

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
        if (narrow === 'keyword') {
          if (
            this.collectionFc.value.id === 'data_source' ||
            this.collectionFc.value.id === 'service'
          ) {
            this.tags.push('tagged' + ': ' + value.trim());
          } else {
            this.tags.push(narrow + ': ' + value.trim());
          }
        } else {
          this.tags.push(narrow + ': ' + value.trim());
        }
      }

      this.tags.sort((a, b) => a.localeCompare(b));
    }

    // Reset the input value
    if (input) {
      input.value = '';
    }

    this.clearQueryAdvAdd();
    this.updateQueryParamsAdv(this.formControl.value || '*');
  }

  remove(tag: string): void {
    let i = 0;
    while (i < this.tags.length) {
      if (this.tags[i] === tag) {
        this.tags.splice(i, 1);
      } else {
        ++i;
      }
    }

    this.updateQueryParamsAdv(this.formControl.value || '*');
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  removeAll(event: unknown) {
    this.tags.splice(0, this.tags.length);
    this.updateQueryParamsAdv(this.formControl.value || '*');
  }

  manyElems(tag: string): boolean {
    if (tag === 'keyword') {
      const filtered = this.tags.filter((el) => el.startsWith(tag));
      const filtered2 = this.tags.filter((el) => el.startsWith('tagged'));
      if (filtered.length + filtered2.length > 1) {
        return true;
      }
      return false;
    } else {
      const filtered = this.tags.filter((el) => el.startsWith(tag));
      if (filtered.length > 1) {
        return true;
      }
      return false;
    }
  }

  elemExist(tag: string): boolean {
    const filtered = this.tags.filter((el) => el.startsWith(tag));
    if (filtered.length > 0) {
      return true;
    }
    return false;
  }

  resetAdvSearch() {
    this.tags = [];
    this.clearQueryAdv();
    this.updateQueryParamsAdv(this.formControl.value || '*');
    this.collectionFcAdvForm.setValue(this.collectionFcAdv[2]);
  }

  backToStandard() {
    this.standardSearch = true;
    this.resetAdvSearch();
  }

  // TODO: stream event - off when search is not focused and what with suggestes result set on []
  @HostListener('document:click')
  clicked() {
    this.placeholderText = this.setPlaceholderText(this.collectionFc.value.id);
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
  ) {
    this.tooltipText =
      'Choose this for precise results. Only content with the exact phrase you entered will show up. No changes or variations.';
  }

  ngOnInit() {
    this._customRoute.q$
      .pipe(
        untilDestroyed(this),
        filter((q: string) => q !== '*'),
        filter((q) => q !== this.formControl.value)
      )
      .subscribe((q) => this.formControl.setValue(q));
    this._customRoute.collection$.subscribe((val) => {
      this.isSpecialCollection = SPECIAL_COLLECTIONS.includes(val);
      if (this.isSpecialCollection) {
        this.backToStandard();
      }
    });
    this._customRoute.collection$
      .pipe(untilDestroyed(this))
      .subscribe((collection) => {
        this.collectionFc.setValue(
          this._navConfigsRepository.get(collection) ??
            this.searchCollections[0],
          { emitEvent: false }
        );
        this.adjustOptionsDropdown();
      });

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

    const rva = this._route.snapshot.queryParamMap.get('radioValueAuthor');
    if (typeof rva === 'string') {
      this.radioValueAuthor = rva;
    }

    const rve = this._route.snapshot.queryParamMap.get('radioValueExact');
    if (typeof rve === 'string') {
      this.radioValueExact = rve;
    }

    const rvt = this._route.snapshot.queryParamMap.get('radioValueTitle');
    if (typeof rvt === 'string') {
      this.radioValueTitle = rvt;
    }

    const rvk = this._route.snapshot.queryParamMap.get('radioValueKeyword');
    if (typeof rvk === 'string') {
      this.radioValueKeyword = rvk;
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
                this.exactmatch.toString().toLowerCase(),
                this.radioValueAuthor,
                this.radioValueExact,
                this.radioValueTitle,
                this.radioValueKeyword
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
      .subscribe((navConfig) => {
        this.setCollection(this.formControl.value, navConfig);
      });
  }

  onCheckboxChange() {
    this.exactmatch = !this.exactmatch;
    this.updateQueryParamsAdv(this.formControl.value || '*');
  }

  onDropdownChange() {
    this.optionsDropdownSelectedValue = this.collectionFcAdvForm.value;
    this.isDOISelected = this.collectionFcAdvForm.value.name === 'DOI';
  }

  onValueChange() {
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
        cursor: '*',
        standard: this.standardSearch.toString(),
        exact: this.exactmatch.toString().toLowerCase(),
        radioValueAuthor: this.radioValueAuthor,
        radioValueExact: this.radioValueExact,
        radioValueTitle: this.radioValueTitle,
        radioValueKeyword: this.radioValueKeyword,
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
        cursor: '*',
        standard: this.standardSearch.toString(),
        exact: this.exactmatch.toString().toLowerCase(),
        radioValueAuthor: this.radioValueAuthor,
        radioValueExact: this.radioValueExact,
        radioValueTitle: this.radioValueTitle,
        radioValueKeyword: this.radioValueKeyword,
      },
      queryParamsHandling: 'merge',
    });
  }

  async clearQuery() {
    this.formControl.setValue('');
    await this.updateQueryParams('*');
  }

  async clearQueryAdv() {
    this.radioValueKeyword = 'A';
    this.radioValueExact = 'A';
    this.radioValueAuthor = 'A';
    this.radioValueTitle = 'A';
    this.formControlAdv.setValue('');
  }

  async clearQueryAdvAdd() {
    this.formControlAdv.setValue('');
  }

  displayDefaultOption(option: ICollectionTagsConfig) {
    if (option.name === 'Keyword' && !this.withKeyword()) {
      this.collectionFcAdvForm.reset(this.collectionFcAdv[2]);
    } else if (option.name === 'Author' && !this.withAuthor()) {
      this.collectionFcAdvForm.reset(this.collectionFcAdv[2]);
    } else if (option.name === 'DOI' && !this.withDOI()) {
      this.collectionFcAdvForm.reset(this.collectionFcAdv[2]);
    }
  }

  revertSelectedOption(option: ICollectionTagsConfig) {
    if (option.name === 'Keyword' && this.withKeyword()) {
      this.collectionFcAdvForm.setValue(option);
    } else if (option.name === 'Author' && this.withAuthor()) {
      this.collectionFcAdvForm.setValue(option);
    } else if (option.name === 'DOI' && this.withDOI()) {
      this.collectionFcAdvForm.setValue(option);
    }
  }

  optionIsConditional(option: ICollectionTagsConfig): boolean {
    const presentInAllCollections = ['In title', 'Exact', 'None of'];
    return !presentInAllCollections.includes(option.name);
  }

  adjustOptionsDropdown() {
    const option = this.collectionFcAdvForm.value;
    if (
      option === this.optionsDropdownSelectedValue &&
      this.optionIsConditional(option)
    ) {
      this.displayDefaultOption(option);
    } else if (option !== this.optionsDropdownSelectedValue) {
      this.revertSelectedOption(this.optionsDropdownSelectedValue);
    }
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
        scope: this.scope,
        radioValueAuthor: this.radioValueAuthor,
        radioValueExact: this.radioValueExact,
        radioValueTitle: this.radioValueTitle,
        radioValueKeyword: this.radioValueKeyword,
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
  clearInput($event: unknown) {
    this.formControl.setValue('');
    if (!this.standardSearch) {
      this.removeAll($event);
    }
  }
}
