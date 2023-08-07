import { URL_PARAM_NAME } from '@collections/data/publications/nav-config.data';
import { IExcludedFiltersConfig } from '@collections/repositories/types';

export const excludedPublicationsFilters: IExcludedFiltersConfig = {
  id: URL_PARAM_NAME,
  excluded: ['unified_categories'],
};
