import { IFiltersConfig } from '../../repositories/types';
import { URL_PARAM_NAME } from './nav-config.data';

export const guidelinesFilters: IFiltersConfig = {
  id: URL_PARAM_NAME,
  filters: [
    {
      id: 'author_names',
      filter: 'author_names',
      label: 'Creator Name',
      type: 'tag',
      defaultCollapsed: false,
      tooltipText: '',
    },
    {
      id: 'right_id',
      filter: 'right_id',
      label: 'License',
      type: 'tag',
      defaultCollapsed: false,
      tooltipText: '',
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
      id: 'type_general',
      filter: 'type_general',
      label: 'Resource Type Category',
      type: 'multiselect',
      defaultCollapsed: false,
      tooltipText: '',
    },
    {
      id: 'status',
      filter: 'status',
      label: 'Status',
      type: 'multiselect',
      defaultCollapsed: false,
      tooltipText: '',
    },
    {
      id: 'domain',
      filter: 'domain',
      label: 'Domain',
      type: 'multiselect',
      defaultCollapsed: false,
      tooltipText: '',
    },
    {
      id: 'eosc_guideline_type',
      filter: 'eosc_guideline_type',
      label: 'Guideline Type',
      type: 'multiselect',
      defaultCollapsed: false,
      tooltipText: '',
    },
    {
      id: 'provider',
      filter: 'provider',
      label: 'Publisher',
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
  ],
};
