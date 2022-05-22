export interface IFacetBucket {
  val: string | number;
  count: number;
}

export interface IFacetResponse {
  buckets: IFacetBucket[];
}
export interface ISearchResults<T> {
  results: T[];
  facets: { [facetName: string]: IFacetResponse };
  nextCursorMark: string;
  numFound: number;
}
