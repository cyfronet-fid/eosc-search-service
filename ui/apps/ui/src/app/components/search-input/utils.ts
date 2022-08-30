import { ISuggestedResults } from './type';
import { IResult, ISearchResults } from '@collections/repositories/types';

export const toSuggestedResults = (
  response: ISearchResults<IResult> & { link: string }
): ISuggestedResults => ({
  label: response.results[0]?.type,
  results: response.results,
  link: response.link,
});
