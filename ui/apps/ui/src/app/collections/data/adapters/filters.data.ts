import { IFiltersConfig } from '../../repositories/types';
import { URL_PARAM_NAME } from './nav-config.data';
import {
  transformCatalogueNames,
  transformDataSourceNames,
} from '@collections/data/utils';
import { DATASOURCE_FILTER_TOOLTIP_TEXT } from '@collections/data/config';

export const adapterFilters: IFiltersConfig = {
  id: URL_PARAM_NAME,
  filters: [
    {
      id: 'license',
      filter: 'license',
      label: 'License',
      type: 'multiselect',
      defaultCollapsed: true,
      tooltipText: '',
      expandArrow: true,
    },
    {
      id: 'publication_date',
      filter: 'publication_date',
      label: 'Year range',
      type: 'date-year',
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
      id: 'programming_language',
      filter: 'programming_language',
      label: 'Programming language',
      type: 'multiselect',
      defaultCollapsed: true,
      tooltipText: '',
      expandArrow: true,
    },
  ],
};
