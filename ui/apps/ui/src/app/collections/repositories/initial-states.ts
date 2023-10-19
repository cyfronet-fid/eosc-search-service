import { ISearchResults } from './types';
import { SuggestionResponse } from '@components/search-input/types';
import { BibliographyRecord, Citation } from '@components/bibliography/types';

export const _EMPTY_RESPONSE = {
  results: [],
  numFound: 0,
  facets: [],
  nextCursorMark: '',
  isError: true,
} as unknown as ISearchResults<never & { id: string }>;

export const _EMPTY_SUGGESTIONS_RESPONSE: SuggestionResponse = {};
export const _EMPTY_EXPORT_RESPONSE: BibliographyRecord = {
  type: '',
  record: '',
};
export const _EMPTY_CITATION_RESPONSE: Citation = {
  style: '',
  citation: '',
};
