import { URL_PARAM_NAME } from '@collections/data/data-sources/nav-config.data';
import { IExcludedFiltersConfig } from '@collections/repositories/types';

export const excludedDataSourcesFilters: IExcludedFiltersConfig = {
  id: URL_PARAM_NAME,
  excluded: ['categories'],
};
