import { URL_PARAM_NAME } from '@collections/data/software/nav-config.data';
import { IExcludedFiltersConfig } from '@collections/repositories/types';

export const excludedSoftwareFilters: IExcludedFiltersConfig = {
  id: URL_PARAM_NAME,
  excluded: ['fos', 'unified_categories', 'publication_date', 'document_type'],
};
