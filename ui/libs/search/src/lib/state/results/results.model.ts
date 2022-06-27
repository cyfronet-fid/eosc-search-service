import {HashMap, IHasId} from "@eosc-search-service/types";
import {isArray} from "@eosc-search-service/common";

export interface IQueryPage {
  cursor: string;
  last: boolean;
}

export type IQueryPages = HashMap<IQueryPage>

export interface IResult {
  id: string;
  title: string;
  description: string;
  type: string;
  typeUrlPath: string;
  collection: string;
  url: string;
  tags: ITag[];
}

export interface ITag {
  label: string;
  value: string | string[];
  originalField: string;
}

export interface SearchState {
  hasNext: boolean;
  maxResults: number;
  currentPage: number;
  maxPage: number;
  cursor: string;
  facets: HashMap<IFacetResponse>;
  active: boolean;
}

export function makeSearchState(
  params: Partial<SearchState> = {}
): SearchState {
  return {
    hasNext: true,
    maxResults: 0,
    currentPage: 0,
    maxPage: 0,
    cursor: '*',
    facets: {},
    active: false,
    ...params,
  };
}

export function clearSearchState(
  collections: HashMap<SearchState>
): HashMap<SearchState> {
  const output: HashMap<SearchState> = {};

  Object.keys(collections).forEach((key) => (output[key] = makeSearchState()));
  return output;
}

export interface CollectionsSearchState {
  collectionSearchStates: HashMap<SearchState>;
}

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

export interface ISolrCollectionParams {
  qf: string[];
  collection: string;
}

export interface ISolrQueryParams {
  q: string;
  fq: string[];
  sort: string[];
  cursor: string;
}

export function toSolrQueryParams(params: HashMap<unknown>): ISolrQueryParams {
  return {
    q: typeof params['q'] === 'string' ? params['q'] : '*',
    fq: isArray<string>(params['fq']) ? params['fq'] : [],
    sort: isArray<string>(params['sort']) ? params['sort'] : [],
    cursor: '*',
  };
}

export function makeEmptySolrQueryParams(
  params: Partial<ISolrQueryParams> = {}
): ISolrQueryParams {
  return {
    q: '*',
    fq: [],
    sort: [],
    cursor: '*',
    ...params,
  };
}

export interface IPage {
  index: number
}
