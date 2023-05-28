import { URL_PARAM_NAME } from '@collections/data/trainings/nav-config.data';
import { IExcludedFiltersConfig } from '@collections/repositories/types';

export const excludedTrainingsFilters: IExcludedFiltersConfig = {
  id: URL_PARAM_NAME,
  excluded: ['unified_categories'],
};
