import { URL_PARAM_NAME } from '@collections/data/catalogues/nav-config.data';
import { IExcludedFiltersConfig } from '@collections/repositories/types';

export const excludedCatalogueFilters: IExcludedFiltersConfig = {
  id: URL_PARAM_NAME,
  excluded: ['language'],
};
