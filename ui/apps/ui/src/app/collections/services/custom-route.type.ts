export type paramType =
  | string
  | string[]
  | undefined
  | null
  | number
  | number[];
export interface ICustomRouteProps {
  collection: string | null;
  q: string;
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
