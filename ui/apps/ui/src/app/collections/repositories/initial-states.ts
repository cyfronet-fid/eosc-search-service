import { ISearchResults } from './types';
import { SuggestionResponse } from '@components/search-input/types';

export const _EMPTY_RESPONSE = {
  results: [],
  numFound: 0,
  facets: [],
  nextCursorMark: '',
} as unknown as ISearchResults<never & { id: string }>;

export const _EMPTY_SUGGESTIONS_RESPONSE: SuggestionResponse = {};
