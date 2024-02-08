import { URL_PARAM_NAME } from '@collections/data/organisations/nav-config.data';
import { IExcludedFiltersConfig } from '@collections/repositories/types';

export const excludedOrganisationFilters: IExcludedFiltersConfig = {
  id: URL_PARAM_NAME,
  excluded: ['language'],
};
