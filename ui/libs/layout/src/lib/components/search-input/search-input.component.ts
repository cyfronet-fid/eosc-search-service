import {
  Component,
  EventEmitter,
  OnDestroy,
  OnInit,
  Output,
} from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormControl } from '@angular/forms';
import { Subscription, debounceTime, filter, map, tap } from 'rxjs';
import { faMagnifyingGlass } from '@fortawesome/free-solid-svg-icons'

@Component({
  selector: 'ess-search-input',
  template: `
    <div class="search-bar">
      <div class="row">
        <div class="col-3">
          <a href="/">
            <img id="logo" src="assets/eosc-logo-color.png" alt="EOSC logo" />
          </a>
        </div>
        <div class="col-9" style="padding: 0">
          <input
            type="text"
            id="search"
            placeholder="Search in catalogs"
            [formControl]="form"
          />
          <button id="btn--search" class="btn btn-primary" type="button">
            <fa-icon [icon]="faMagnifyingGlass"></fa-icon>
            <span>&nbsp;&nbsp;&nbsp;&nbsp;Search&nbsp;&nbsp;</span>
          </button>
        </div>
      </div>
    </div>
  `,
  styles: [`
    #logo {
      max-width: 120px;
    }

    #search {
      width: calc(100% - 120px);
      border: solid 1px rgba(0, 0, 0, 0.1);
      border-radius: 25px 0 0 25px;
    }
    #search::placeholder {
      padding-left: 20px;
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
export class SearchInputComponent implements OnInit, OnDestroy {
  faMagnifyingGlass = faMagnifyingGlass

  form = new FormControl();

  @Output() searchedValue = new EventEmitter<string>();

  private _queryToValue$: Subscription | null = null;
  private _valueToResults$: Subscription | null = null;

  constructor(private _route: ActivatedRoute, private _router: Router) {}

  ngOnInit() {
    // Load search-input query from URL params
    this._queryToValue$ = this._route.queryParams
      .pipe(
        map((params) => params['q']),
        tap((q: string) => {
          const searchQuery = (q !== '*' && q) || '';
          const emitEvent = q !== '*' && q != this.form.value;
          this.form.setValue(searchQuery, { emitEvent });
        }),
        map((q) => (q && q.trim() !== '' ? q : '*')),
        filter((q) => q === '*')
      )
      .subscribe((q) => this.searchedValue.emit(q));

    // Load data from search-input query
    this._valueToResults$ = this.form.valueChanges
      .pipe(
        debounceTime(500),
        map((q: string) => q.trim()),
        tap((q: string) =>
          this._router.navigate([], {
            queryParams: { q: q || '*' },
            queryParamsHandling: 'merge',
          })
        )
      )
      .subscribe((q) => this.searchedValue.emit(q));
  }

  ngOnDestroy() {
    this._queryToValue$?.unsubscribe();
    this._valueToResults$?.unsubscribe();
  }
}
