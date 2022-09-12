/* eslint-disable @typescript-eslint/ban-ts-comment,@typescript-eslint/no-explicit-any */
/**
 * This file is riddled with @ts-ignore directives,
 * as it uses auto generated file ./base which is not well
 * formatted or well behaved
 */

import { sharedEnvironment } from './environment.generated';

export const commonEnvironment = {
  // @ts-ignore
  ...sharedEnvironment,
  backendApiPath: 'api/web',
  search: {
    apiPath: 'search-results',
  },
};
