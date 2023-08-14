import { IFacetBucket, IResult } from '@collections/repositories/types';

// incoming
export interface ISuggestionResponseResults<T extends { id: string }> {
  collection: string;
  results: T[];
}

// to display
export interface ISuggestedResultsGroup {
  label: string;
  results: IResult[];
  link: string;
}

export interface ISuggestedResults {
  label: string;
  results: IResult[];
  link: string;
}

export type SuggestionResponse = { [collection: string]: IResult[] };
export type FacetsResponse = { [field: string]: IFacetBucket[] };
