import {Component, EventEmitter, OnInit, Output,} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {FormControl} from '@angular/forms';
import {filter, map} from 'rxjs';
import {faMagnifyingGlass} from '@fortawesome/free-solid-svg-icons'

@Component({
  selector: 'ess-search-input',
  template: `
    <input
      type="text"
      id="search"
      i18n-placeholder
      placeholder="Search in catalogs"
      (keydown.enter)="setParam()"
      [formControl]="form"
    />
    <button id="btn--search" class="btn btn-primary" type="button" (click)="setParam()">
      <fa-icon [icon]="faMagnifyingGlass"></fa-icon>
      <span>&nbsp;&nbsp;&nbsp;&nbsp;<ng-container i18n>Search</ng-container>&nbsp;&nbsp;</span>
    </button>
  `,
  styles: [`
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
    }
    #search, #btn--search {
      float: left;
      height: 40px;
    }
  `]
})
export class SearchInputComponent implements OnInit {
  faMagnifyingGlass = faMagnifyingGlass
  form = new FormControl();

  @Output() searchedValue = new EventEmitter<string>();

  constructor(private _route: ActivatedRoute, private _router: Router) {
  }

  ngOnInit() {
    this._route.queryParamMap
      .pipe(
        map((params) => params.get('q')),
        filter((q) => q == this.form.value || q !== '*')
      )
      .subscribe((q) => this.form.setValue(q))
  }

  async setParam() {
    const q = this.form.value;
    const currentPath = this._router.url.split("?")[0];
    const newPath = currentPath === '/' ? ['search/all'] : [];
    await this._router.navigate(newPath, {
      queryParams: {q: q || '*'},
      queryParamsHandling: 'merge',
    })
  }
  // form = new FormControl();
  //
  // @Output() searchedValue = new EventEmitter<string>();
  //
  // private _queryToValue$: Subscription | null = null;
  // private _valueToResults$: Subscription | null = null;
  //
  // constructor(private _route: ActivatedRoute, private _router: Router) {}
  //
  // ngOnInit() {
  //   // Load search-input query from URL params
  //   this._queryToValue$ = this._route.queryParams
  //     .pipe(
  //       map((params) => params['q']),
  //       tap((q: string) => {
  //         const searchQuery = (q !== '*' && q) || '';
  //         const emitEvent = q !== '*' && q != this.form.value;
  //         this.form.setValue(searchQuery, { emitEvent });
  //       }),
  //       map((q) => (q && q.trim() !== '' ? q : '*')),
  //       filter((q) => q === '*')
  //     )
  //     .subscribe((q) => this.searchedValue.emit(q));
  //
  //   // Load data from search-input query
  //   this._valueToResults$ = this.form.valueChanges
  //     .pipe(
  //       debounceTime(500),
  //       map((q: string) => q.trim()),
  //       tap((q: string) =>
  //         this._router.navigate([], {
  //           queryParams: { q: q || '*' },
  //           queryParamsHandling: 'merge',
  //         })
  //       )
  //     )
  //     .subscribe((q) => this.searchedValue.emit(q));
  // }
  //
  // ngOnDestroy() {
  //   this._queryToValue$?.unsubscribe();
  //   this._valueToResults$?.unsubscribe();
  // }
}
