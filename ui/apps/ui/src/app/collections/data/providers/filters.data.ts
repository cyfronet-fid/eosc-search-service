import { IFiltersConfig } from '../../repositories/types';
import { URL_PARAM_NAME } from './nav-config.data';
import { transformCatalogueNames } from '@collections/data/utils';

export const providersFilters: IFiltersConfig = {
  id: URL_PARAM_NAME,
  filters: [
    {
      id: 'scientific_domains',
      filter: 'scientific_domains',
      label: 'Scientific domain',
      type: 'multiselect',
      defaultCollapsed: false,
      tooltipText: '',
      expandArrow: true,
    },
    {
      id: 'areas_of_activity',
      filter: 'areas_of_activity',
      label: 'Area of activity',
      type: 'multiselect',
      defaultCollapsed: false,
      tooltipText: '',
      expandArrow: true,
    },
    {
      id: 'legal_status',
      filter: 'legal_status',
      label: 'Legal status',
      type: 'multiselect',
      defaultCollapsed: false,
      tooltipText: '',
      expandArrow: true,
    },
    {
      id: 'meril_scientific_domains',
      filter: 'meril_scientific_domains',
      label: 'MERIL Scientific categorisation',
      type: 'multiselect',
      defaultCollapsed: false,
      tooltipText: '',
      expandArrow: true,
    },
    {
      id: 'keywords',
      filter: 'keywords',
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
