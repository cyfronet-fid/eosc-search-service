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

export const SEARCH_PAGE_PATH = 'search';
