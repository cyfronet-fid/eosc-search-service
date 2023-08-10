import {
  ISuggestedResults,
  ISuggestedResultsGroup,
  ISuggestionResponseResults,
} from './types';
import {
  IResult,
  ISearchResults,
  adapterType,
} from '@collections/repositories/types';

export const toSuggestedResults = (
  response: ISuggestionResponseResults<IResult>,
  adapter: adapterType
): ISuggestedResultsGroup => {
  const output = {
    label: response.collection.replace(/_/g, ' '),
    results: response.results,
    link: response.collection,
  };
  output.results = output.results.map(adapter);
  return output;
};

export const toSuggestedResultsAdv = (
  response: ISearchResults<IResult> & { link: string }
): ISuggestedResults => ({
  label: response.results[0]?.type.value,
  results: response.results,
  link: response.link,
});
