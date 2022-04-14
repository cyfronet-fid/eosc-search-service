import { IFacetResponse } from './facet-response.interface';

export interface ISearchResults<T> {
  results: T[];
  facets: { [facetName: string]: IFacetResponse };
  nextCursorMark: string;
  numFound: number;
}
