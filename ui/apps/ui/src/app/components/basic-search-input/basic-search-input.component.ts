import { Component, ElementRef, Inject, Input, ViewChild } from '@angular/core';
import { UntypedFormControl } from '@angular/forms';
import { map } from 'rxjs';
import { faMagnifyingGlass } from '@fortawesome/free-solid-svg-icons';
import { UntilDestroy } from '@ngneat/until-destroy';
import { CustomRoute } from '@collections/services/custom-route.service';
import { Router } from '@angular/router';
import { NavConfigsRepository } from '@collections/repositories/nav-configs.repository';
import { DOCUMENT } from '@angular/common';
import { RedirectService } from '@collections/services/redirect.service';

@UntilDestroy()
@Component({
  selector: 'ess-basic-search-input',
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
                placeholder="Browse by"
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

      #container {
        z-index: 11;
        position: relative;
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
    `,
  ],
})
export class BasicSearchInputComponent {
  focused = false;

  faMagnifyingGlass = faMagnifyingGlass;
  formControl = new UntypedFormControl();

  @Input() navigateOnCollectionChange = true;

  @ViewChild('inputQuery', { static: true }) inputQuery!: ElementRef;

  hasSetQuery$ = this._customRoute.q$.pipe(map((q: string) => q && q !== '*'));

  constructor(
    public redirectService: RedirectService,
    private _customRoute: CustomRoute,
    private _router: Router,
    private _navConfigsRepository: NavConfigsRepository,
    @Inject(DOCUMENT) private _document: Document
  ) {}

  async clearQuery() {
    this.formControl.setValue('');
  }

  async updateQueryParams(q: string, $event: Event | null = null) {
    if ($event) {
      $event.stopPropagation();
      $event.preventDefault();
    }
  }
}
