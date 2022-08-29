import { IFiltersConfig } from '../../repositories/types';
import { URL_PARAM_NAME } from './nav-config.data';

export const servicesFilters: IFiltersConfig = {
  id: URL_PARAM_NAME,
  filters: [
    {
      id: 'providers_ss',
      filter: 'providers_ss',
      label: 'Provider',
      type: 'multiselect',
    },
    {
      id: 'resource_organisation_s',
      filter: 'resource_organisation_s',
      label: 'Organisation',
      type: 'multiselect',
    },
    {
      id: 'geographical_availabilities_ss',
      filter: 'geographical_availabilities_ss',
      label: 'Country',
      type: 'multiselect',
    },
    {
      id: 'categories_ss',
      filter: 'categories_ss',
      label: 'Categories',
      type: 'multiselect',
    },
    {
      id: 'scientific_domains_ss',
      filter: 'scientific_domains_ss',
      label: 'Scientific Domains',
      type: 'multiselect',
    },
  ],
};
