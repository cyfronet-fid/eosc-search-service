import { URL_PARAM_NAME } from '@collections/data/adapters/nav-config.data';
import { IExcludedFiltersConfig } from '@collections/repositories/types';

export const excludedAdapterFilters: IExcludedFiltersConfig = {
  id: URL_PARAM_NAME,
  excluded: [],
};
