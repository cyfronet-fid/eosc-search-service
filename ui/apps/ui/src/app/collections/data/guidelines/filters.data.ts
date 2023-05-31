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
    },
    {
      id: 'right_id',
      filter: 'right_id',
      label: 'License',
      type: 'tag',
      defaultCollapsed: false,
    },
    {
      id: 'keywords',
      filter: 'keywords',
      label: 'Keywords',
      type: 'tag',
      defaultCollapsed: false,
    },
    {
      id: 'type_general',
      filter: 'type_general',
      label: 'Resource Type Category',
      type: 'multiselect',
      defaultCollapsed: false,
    },
    {
      id: 'status',
      filter: 'status',
      label: 'Status',
      type: 'multiselect',
      defaultCollapsed: false,
    },
    {
      id: 'domain',
      filter: 'domain',
      label: 'Domain',
      type: 'multiselect',
      defaultCollapsed: false,
    },
    {
      id: 'eosc_guideline_type',
      filter: 'eosc_guideline_type',
      label: 'Guideline Type',
      type: 'multiselect',
      defaultCollapsed: false,
    },
    {
      id: 'provider',
      filter: 'provider',
      label: 'Publisher',
      type: 'multiselect',
      defaultCollapsed: false,
    },
    {
      id: 'tag_list',
      filter: 'tag_list',
      label: 'Keywords',
      type: 'tag',
      defaultCollapsed: false,
    },
  ],
};
