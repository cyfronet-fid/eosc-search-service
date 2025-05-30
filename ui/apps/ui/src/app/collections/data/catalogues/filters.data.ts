import { IFiltersConfig } from '../../repositories/types';
import { URL_PARAM_NAME } from './nav-config.data';

export const catalogueFilters: IFiltersConfig = {
  id: URL_PARAM_NAME,
  filters: [
    {
      id: 'node',
      filter: 'node',
      label: 'EOSC Node',
      type: 'multiselect',
      defaultCollapsed: false,
      tooltipText: '',
      expandArrow: true,
    },
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
      id: 'legal_status',
      filter: 'legal_status',
      label: 'Legal status',
      type: 'multiselect',
      defaultCollapsed: false,
      tooltipText: '',
      expandArrow: true,
    },
    {
      id: 'node',
      filter: 'node',
      label: 'EOSC Node',
      type: 'tag',
      defaultCollapsed: false,
      tooltipText: '',
    },
    {
      id: 'scientific_domains',
      filter: 'scientific_domains',
      label: 'Scientific domain',
      type: 'tag',
      defaultCollapsed: false,
      tooltipText: '',
      expandArrow: true,
    },
    {
      id: 'legal_status',
      filter: 'legal_status',
      label: 'Legal status',
      type: 'tag',
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
  ],
};
