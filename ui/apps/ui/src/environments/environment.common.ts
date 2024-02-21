/* eslint-disable @typescript-eslint/ban-ts-comment,@typescript-eslint/no-explicit-any */
/**
 * This file is riddled with @ts-ignore directives,
 * as it uses auto generated file ./base which is not well
 * formatted or well-behaved
 */

import { sharedEnvironment } from '@environment/environment.generated';

export const commonEnvironment = {
  // @ts-ignore
  ...sharedEnvironment,
  backendApiPath: 'api/web',
  navigationApiPath: 'navigate',
  userApiPath: 'auth/userinfo',
  recommendationsApiPath: 'recommendations',
  feedbackApiPath: 'feedback',
  search: {
    apiResultsPath: 'search-results',
    apiFiltersPath: 'search-filters',
    apiResultsAdvPath: 'search-results-advanced',
    downloadPath: 'download-results',
    suggestionsPath: 'search-suggestions',
    apiPathAdv: 'search-results-advanced',
    bibExportPath: 'bibliography-export-all-formats',
    bibCitationPath: 'bibliography-cite',
  },

  /*
   * The parameter is needed to bind highlights with field duplicate that was converted to text general
   *
   * Example:
   *
   * We want to search in a field `authors_names` with type `strings`.
   * We duplicate the field with a new name `authors_names_tg` and type `text_general`.
   * Then we add the `authors_names_tg` to `qf` (fields by which we are searching)
   * */
  textGeneralPostfix: '_tg',
};
