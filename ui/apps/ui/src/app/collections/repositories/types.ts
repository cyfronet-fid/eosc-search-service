import { IFacetResponse } from '@components/filters/types';

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
  filter: string;
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

export interface CommonSettings {
  backendApiPath: string;
  search: {
    apiPath: string;
  };
}

export interface ISearchResults<T extends { id: string }> {
  results: T[];
  facets: { [field: string]: IFacetResponse };
  nextCursorMark: string;
  numFound: number;
}

export interface IFacetParam {
  type: 'terms';
  offset?: number;
  limit?: number;
  sort?: number;
  prefix?: string;
  contains?: string;

  [facet: string]: string | number | undefined;
}

export interface ICollectionNavConfig {
  id: string;
  title: string;
  urlParam: string;

  breadcrumbs: {
    label: string;
    url?: string;
  }[];
}
export interface IAdapter {
  id: string;
  adapter: adapterType;
}
export type adapterType = <T>(item: Partial<T> & { id: string }) => IResult;
export interface IFiltersConfig {
  id: string;
  filters: IFilterConfig[];
}
export interface IFilterConfig {
  id: string;
  filter: string;
  label: string;

  /*
   * multiselect, select and dat types are handled by sidebar
   * tag is handled by result single labels
   * */
  type: 'multiselect' | 'select' | 'date' | 'tag';
}

export interface ICollectionSearchMetadata {
  id: string;
  facets: { [field: string]: IFacetParam };
  queryMutator: (q: string) => string;
  params: ISolrCollectionParams;
}

export interface ISolrQueryParams {
  q: string;
  fq: string[];
  sort: string[];
  rows: number;
  cursor: string;
}