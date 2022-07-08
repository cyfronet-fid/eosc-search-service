import {HashMap, IHasId} from "@eosc-search-service/types";

export const INITIAL_FILTER_OPTION_COUNT = 10;
export const FILTERS_FETCH_MORE_LIMIT = 20;

export interface IFacetBucket {
  val: string | number;
  count: number;
}

export interface IFacetResponse {
  buckets: IFacetBucket[];
}

export interface ISearchResults<T extends IHasId> {
  results: T[];
  facets: HashMap<IFacetResponse>;
  nextCursorMark: string;
  numFound: number;
}
