/* eslint-disable @typescript-eslint/no-explicit-any */
import { Component, OnInit } from '@angular/core';
import { Observable, Subscriber } from 'rxjs';
import { MocksService } from '../mocks.service';

function getFacetsFor(fields: Array<string>): any {
  const out: { [field: string]: string | number | any } = {};
  for (const field of fields) {
    out[field] = { type: 'terms', field };
  }
  return out;
}

@Component({
  selector: 'ui-marketplace-page',
  templateUrl: './marketplace-page.component.html',
})
export class MarketplacePageComponent implements OnInit {
  searchResults$!: Observable<any[]>;
  filters$!: Observable<any[]>;

  categories$ = this._mocksService.getCategories$();
  recommendations$ = this._mocksService.getRecommendations$();
  recommendedResources$ = this._mocksService.getRecommendedResources$();

  constructor(private _mocksService: MocksService) {}

  ngOnInit(): void {
    let searchResultsObs: Subscriber<any[]>;
    let filtersObs: Subscriber<any[]>;

    this.searchResults$ = new Observable(
      (_searchResultsObs) => (searchResultsObs = _searchResultsObs)
    );
    this.filters$ = new Observable((_filtersObs) => (filtersObs = _filtersObs));

    this._mocksService
      .getSearchResults$(
        '*',
        'oag_researchoutcomes_prod_20211208_v2',
        getFacetsFor([
          'subject',
          'publisher',
          'bestaccessright',
          'language',
          'journal',
          'organization_names',
          'project_titles',
        ])
      )
      .subscribe((response: any) => {
        searchResultsObs.next(
          response['results'].map(
            (res: { id: string; title: string; author_names: string }) => {
              return {
                id: res['id'],
                title: res['title'],
                author_names: res['author_names'],
                rating: Math.random() * 5,
              };
            }
          )
        );

        const filters = [];
        for (const key in response['facets']) {
          if (key === 'count') {
            continue;
          }
          filters.push({
            label: key,
            buckets: response['facets'][key]['buckets'].map(
              (bucket: { val: string | number; count: number }) => {
                return {
                  title: bucket['val'] + ' (' + bucket['count'] + ')',
                  key: bucket['val'],
                  isLeaf: true,
                };
              }
            ),
          });
        }
        filtersObs.next(filters);
      });
  }
}
