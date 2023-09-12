import { URL_PARAM_NAME } from '@collections/data/datasets/nav-config.data';
import { IExcludedFiltersConfig } from '@collections/repositories/types';

export const excludedDatasetsFilters: IExcludedFiltersConfig = {
  id: URL_PARAM_NAME,
  excluded: ['unified_categories'],
};
