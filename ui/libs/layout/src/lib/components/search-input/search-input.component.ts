import {Component, EventEmitter, OnDestroy, OnInit, Output,} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {FormControl} from '@angular/forms';
import {map, Subscription} from 'rxjs';
import {faMagnifyingGlass} from '@fortawesome/free-solid-svg-icons'

@Component({
  selector: 'ess-search-input',
  template: `
   <div id="container">
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
     <button  *ngIf="form.value && form.value.trim() !== ''" id="btn--clear-query" type="button" class="btn btn-secondary" (click)="clearQuery()">
       Clear phrase <span>X</span>
     </button>
   </div>
  `,
  styles: [`
    #container {
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
    #search, #btn--search {
      float: left;
      height: 40px;
    }
  `]
})
export class SearchInputComponent implements OnInit, OnDestroy {
  faMagnifyingGlass = faMagnifyingGlass
  form = new FormControl();
  subscription$: Subscription | undefined;

  @Output() searchedValue = new EventEmitter<string>();

  constructor(private _route: ActivatedRoute, private _router: Router) {
    this._router.routeReuseStrategy.shouldReuseRoute = () => false;
  }

  ngOnInit() {
    this.subscription$ = this._route.queryParamMap
      .pipe(
        map((params) => params.get('q')),
        map((q) => q === '*' ? '' : q)
      )
      .subscribe((q) => this.form.setValue(q))
  }

  async setParam() {
    const currentPath = this._router.url.split("?")[0];
    const newPath = currentPath === '/' ? ['/search/all'] : [];
    const q = this.form.value || '*';
    await this._router.navigate(newPath, {
      queryParams: { q },
      queryParamsHandling: 'merge',
    })
  }

  async clearQuery() {
    this.form.setValue('');

    const currentPath = this._router.url.split("?")[0];
    if (currentPath !== '/') {
      await this.setParam();
    }
  }

  ngOnDestroy() {
    this.subscription$?.unsubscribe();
  }
}
