import { ISearchResults } from './types';
import { FacetsResponse } from '@components/search-input/type';

export const _EMPTY_RESPONSE = {
  results: [],
  numFound: 0,
  facets: [],
  nextCursorMark: '',
} as unknown as ISearchResults<never & { id: string }>;

export const _EMPTY_FACETS_RESPONSE: FacetsResponse = {};
