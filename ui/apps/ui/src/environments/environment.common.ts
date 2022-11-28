/* eslint-disable @typescript-eslint/ban-ts-comment,@typescript-eslint/no-explicit-any */
/**
 * This file is riddled with @ts-ignore directives,
 * as it uses auto generated file ./base which is not well
 * formatted or well behaved
 */

import { sharedEnvironment } from './environment.generated';

export const commonEnvironment = {
  // @ts-ignore
  collectionsPrefix: '',
  ...sharedEnvironment,
  backendApiPath: 'api/web',
  navigationApiPath: 'navigate',
  userApiPath: 'auth/userinfo',
  recommendationsApiPath: 'recommendations',
  search: {
    apiPath: 'search-results',
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
