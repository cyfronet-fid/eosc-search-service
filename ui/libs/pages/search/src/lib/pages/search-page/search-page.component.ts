import { Component } from '@angular/core';
import { Observable, filter, map, of } from 'rxjs';
import { NavigationEnd, Router } from '@angular/router';
import {MocksService} from "@eosc-search-service/common";

@Component({
  selector: 'ess-search-page',
  template: `
    <div class="row" id="dashboard__main">
      <div class="col-3" id="dashboard__filters">
        <ess-category-list
          *ngIf="categories.length > 0"
          [categories]="categories"
        ></ess-category-list>
      </div>
      <div class="col-9">
        <ess-result
          *ngFor="let result of getResults$() | async"
          [title]="result.title"
          [description]="result.description"
          [type]="result.type"
          [tags]="toTags(result)"
        ></ess-result>
      </div>
    </div>
  `,
  styles: [],
})
export class SearchPageComponent {
  results$ = this._router.events.pipe(
    filter((event) => event instanceof NavigationEnd)
  );

  getResults$(): Observable<any[]> {
    switch (this._router.url.split('?')[0]) {
      case '/services':
        return this._mocksService.getResources$().pipe(
          map((resources: any[]) =>
            resources.map(({ label, description, organisation }) => ({
              title: label,
              description,
              organisation,
              type: 'Service',
              fieldsToTags: ['organisation'],
            }))
          )
        ); // TODO: Load categories and go to subtree based on query param
      case '/trainings':
      case '/publications':
      case '/all':
      default:
        return of([]);
    }
  }
  get categories() {
    switch (this._router.url.split('?')[0]) {
      case '/services':
        return []; // TODO: Load categories and go to subtree based on query param
      case '/trainings':
      case '/publications':
      case '/all':
      default:
        return [];
    }
  }

  constructor(private _mocksService: MocksService, private _router: Router) {}

  toTags = (result: any): any[] => {
    return result.fieldsToTags
      .filter(
        (field: string) => !!result[field] && result[field] instanceof String
      )
      .map((field: string) => ({
        type: field,
        value: result[field],
      }));
  };
}
