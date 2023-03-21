import { sortType } from '@components/sort-by-functionality/sort-value.type';

export type paramType =
  | string
  | string[]
  | sortType
  | undefined
  | null
  | number
  | number[];
export interface ICustomRouteProps {
  collection: string | null;
  q: string;
  sortUI: sortType;
  fq: string[];
  cursor: string;
  sort: string[];
  [param: string]: paramType;
}
export type filterValueType = string | unknown[];
export interface IFqMap {
  [filter: string]: filterValueType;
}

export const SEARCH_PAGE_PATH = 'search';
