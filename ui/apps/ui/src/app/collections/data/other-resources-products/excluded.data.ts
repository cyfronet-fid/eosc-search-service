import { URL_PARAM_NAME } from '@collections/data/other-resources-products/nav-config.data';
import { IExcludedFiltersConfig } from '@collections/repositories/types';

export const excludedOtherResourcesProductsFilters: IExcludedFiltersConfig = {
  id: URL_PARAM_NAME,
  excluded: ['unified_categories'],
};
