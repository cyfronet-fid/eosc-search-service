import { Component } from '@angular/core';
import { filter, map, tap } from 'rxjs';
import { MocksService } from '../mocks.service';
import { SearchService } from '../search/search.service';
import { IArticle } from '../articles-page/article.interface';
import { facetBucketToFilter } from './utils';

@Component({
  selector: 'ui-marketplace-page',
  templateUrl: './marketplace-page.component.html',
})
export class MarketplacePageComponent {
  filters$ = this._searchService.getFacetsCounts$('*').pipe(
    map((facets) =>
      Object.keys(facets)
        .filter((facet) => !!facets[facet].buckets)
        .map((facet) => ({
          label: facet,
          buckets: facets[facet].buckets.map(facetBucketToFilter),
          isLeaf: true,
        }))
    )
  );

  categories$ = this._mocksService.getCategories$();
  recommendations$ = this._mocksService.getRecommendations$();
  recommendedResources$ = this._mocksService.getRecommendedResources$();

  constructor(
    private _mocksService: MocksService,
    private _searchService: SearchService
  ) {}
}
