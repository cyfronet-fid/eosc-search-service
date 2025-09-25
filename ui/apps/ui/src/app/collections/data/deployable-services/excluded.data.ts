import { URL_PARAM_NAME } from '@collections/data/deployable-services/nav-config.data';
import { IExcludedFiltersConfig } from '@collections/repositories/types';

export const excludedDeployableServiceFilters: IExcludedFiltersConfig = {
  id: URL_PARAM_NAME,
  excluded: [],
};
