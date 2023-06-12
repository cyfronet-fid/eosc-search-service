import { URL_PARAM_NAME } from '@collections/data/bundles/nav-config.data';
import { IExcludedFiltersConfig } from '@collections/repositories/types';

export const excludedBundlesFilters: IExcludedFiltersConfig = {
  id: URL_PARAM_NAME,
  excluded: ['resource_organisation'],
};
