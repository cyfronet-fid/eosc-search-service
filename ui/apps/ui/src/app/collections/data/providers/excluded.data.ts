import { URL_PARAM_NAME } from '@collections/data/providers/nav-config.data';
import { IExcludedFiltersConfig } from '@collections/repositories/types';

export const excludedProvidersFilters: IExcludedFiltersConfig = {
  id: URL_PARAM_NAME,
  excluded: ['lenguage'],
};
