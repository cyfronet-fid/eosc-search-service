import { ISearchResults } from './types';

export const _EMPTY_RESPONSE = {
  results: [],
  numFound: 0,
  facets: [],
  nextCursorMark: '',
} as unknown as ISearchResults<any & { id: string }>;
