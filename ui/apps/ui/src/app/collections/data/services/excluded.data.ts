import { URL_PARAM_NAME } from '@collections/data/services/nav-config.data';
import { IExcludedFiltersConfig } from '@collections/repositories/types';

export const excludedServicesFilters: IExcludedFiltersConfig = {
  id: URL_PARAM_NAME,
  excluded: ['categories', 'rating'],
};
