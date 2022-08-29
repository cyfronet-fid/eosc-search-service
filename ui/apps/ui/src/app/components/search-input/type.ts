import { IResult } from '@collections/repositories/types';

export interface ISuggestedResults {
  caption: string;
  results: IResult[];
  link: string;
}
