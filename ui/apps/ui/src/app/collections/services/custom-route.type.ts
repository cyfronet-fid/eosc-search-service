import { sortType } from '@components/sort-by-functionality/sort-value.type';

export type paramType =
  | string
  | string[]
  | sortType
  | undefined
  | null
  | boolean
  | number
  | number[];
export interface ICustomRouteProps {
  collection: string | null;
  scope: string;
  q: string;
  sort_ui: sortType;
  fq: string[];
  cursor: string;
  sort: string[];
  standard: string;
  exact: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  tags: string[];
  radioValueAuthor: string;
  radioValueExact: string;
  radioValueTitle: string;
  radioValueKeyword: string;
  [param: string]: paramType;
}
export type filterValueType = string | unknown[];
export interface IFqMap {
  [filter: string]: filterValueType;
}

export const SEARCH_PAGE_PATH = 'search';
