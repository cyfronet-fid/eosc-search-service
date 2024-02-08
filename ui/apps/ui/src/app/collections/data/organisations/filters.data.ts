import { IFiltersConfig } from '../../repositories/types';
import { URL_PARAM_NAME } from './nav-config.data';

export const organisationsFilters: IFiltersConfig = {
  id: URL_PARAM_NAME,
  filters: [
    {
      id: 'country',
      filter: 'country',
      label: 'Country',
      type: 'multiselect',
      defaultCollapsed: false,
      tooltipText: '',
      expandArrow: true,
    },
    {
      id: 'related_resources',
      filter: 'related_resources',
      label: 'Type of provided resources',
      type: 'checkbox-resource-type',
      defaultCollapsed: false,
      tooltipText: '',
      expandArrow: true,
    },
  ],
};
