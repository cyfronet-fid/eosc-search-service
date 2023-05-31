import { URL_PARAM_NAME } from '@collections/data/guidelines/nav-config.data';
import { IExcludedFiltersConfig } from '@collections/repositories/types';

export const excludedGuidelinesFilters: IExcludedFiltersConfig = {
  id: URL_PARAM_NAME,
  excluded: ['type_general'],
};
