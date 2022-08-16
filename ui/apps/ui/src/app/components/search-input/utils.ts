import { ISuggestedResults } from './type';
import { ISearchResults } from '../../collections/repositories/types';

export const toSuggestedResults = (
  response: ISearchResults<any> & { link: string }
): ISuggestedResults => ({
  caption: response.results[0]?.type,
  results: response.results,
  link: response.link,
});
