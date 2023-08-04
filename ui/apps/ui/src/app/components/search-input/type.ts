import { IFacetBucket, IResult } from '@collections/repositories/types';

export interface ISuggestedResults {
  label: string;
  results: IResult[];
  link: string;
}

export type FacetsResponse = { [field: string]: IFacetBucket[] };
