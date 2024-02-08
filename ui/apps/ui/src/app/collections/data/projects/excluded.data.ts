import { URL_PARAM_NAME } from '@collections/data/projects/nav-config.data';
import { IExcludedFiltersConfig } from '@collections/repositories/types';

export const excludedProjectFilters: IExcludedFiltersConfig = {
  id: URL_PARAM_NAME,
  excluded: ['resource_organisation'],
};
