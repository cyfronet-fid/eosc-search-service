import { IFiltersConfig } from '../../repositories/types';
import { URL_PARAM_NAME } from './nav-config.data';
import { transformCatalogueNames } from '@collections/data/utils';

export const providersFilters: IFiltersConfig = {
  id: URL_PARAM_NAME,
  filters: [
    {
      id: 'scientific_domains',
      filter: 'scientific_domains',
      label: 'Scientific Domains',
      type: 'multiselect',
      defaultCollapsed: false,
      tooltipText: '',
    },
    {
      id: 'tag_list',
      filter: 'tag_list',
      label: 'Keywords',
      type: 'tag',
      defaultCollapsed: false,
      tooltipText: '',
    },
    {
      id: 'catalogue',
      filter: 'catalogue',
      label: 'Community Catalog',
      type: 'dropdown',
      defaultCollapsed: false,
      tooltipText: '',
      global: true,
      transformNodes: transformCatalogueNames,
    },
  ],
};
