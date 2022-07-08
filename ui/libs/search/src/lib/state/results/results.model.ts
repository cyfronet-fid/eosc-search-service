import {HashMap} from "@eosc-search-service/types";
import {isArray} from "@eosc-search-service/common";
import {IFacetResponse} from "../common";

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
  const fqs: HashMap<string[]> = {};
  if (isArray<string>(params['fq'])) {
    params['fq'].map(fq => {
      const parts = fq.split(':')
      if (fqs[parts[0]]) {
        fqs[parts[0]].push(parts[1]);
      } else {
        fqs[parts[0]] = [parts[1]];
      }
    })
  }

  const altFq: string[] = Object.entries(fqs).map(([key, values]) => {
    return key + ':(' + values.join(` OR `) + ')'
  })

  return {
    q: typeof params['q'] === 'string' ? params['q'] : '*',
    fq: altFq,
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
