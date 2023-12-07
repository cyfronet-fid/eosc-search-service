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
      id: 'legal_status',
      filter: 'legal_status',
      label: 'Legal Status',
      type: 'multiselect',
      defaultCollapsed: false,
      tooltipText: '',
    },
    {
      id: 'areas_of_activity',
      filter: 'areas_of_activity',
      label: 'Areas of Activity',
      type: 'multiselect',
      defaultCollapsed: false,
      tooltipText: '',
    },
    {
      id: 'meril_scientific_domains',
      filter: 'meril_scientific_domains',
      label: 'MERIL Scientific Categorisation',
      type: 'multiselect',
      defaultCollapsed: false,
      tooltipText: '',
    },
    {
      id: 'keywords',
      filter: 'keywords',
      label: 'Tags',
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
