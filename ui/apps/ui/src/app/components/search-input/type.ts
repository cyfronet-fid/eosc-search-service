import { IResult } from '@collections/repositories/types';

export interface ISuggestedResults {
  label: string;
  results: IResult[];
  link: string;
}
