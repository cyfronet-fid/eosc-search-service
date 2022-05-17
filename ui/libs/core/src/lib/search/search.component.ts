import {
  Component,
  EventEmitter, OnInit,
  Output,
} from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormControl } from '@angular/forms';
import { faMagnifyingGlass } from '@fortawesome/free-solid-svg-icons'
import {filter, map} from "rxjs";

@Component({
  selector: 'core-search',
  template: `
    <input
      type="text"
      id="search"
      placeholder="Search in catalogs"
      [formControl]="form"
    />
    <button id="btn--search" class="btn btn-primary" type="button" (click)="setParam()">
      <fa-icon [icon]="faMagnifyingGlass"></fa-icon>
      <span>&nbsp;&nbsp;&nbsp;&nbsp;Search&nbsp;&nbsp;</span>
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
export class SearchComponent implements OnInit {
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
    const newPath = currentPath === '/' ? ['all'] : [];
    await this._router.navigate(newPath, {
      queryParams: {q: q || '*'},
      queryParamsHandling: 'merge',
    })
  }
}
