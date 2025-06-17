import { IFiltersConfig } from '../../repositories/types';
import { URL_PARAM_NAME } from './nav-config.data';
import {
  transformLicense,
  transformProgrammingLanguages,
} from '@collections/data/utils';

export const adapterFilters: IFiltersConfig = {
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
      id: 'license',
      filter: 'license',
      label: 'License',
      type: 'multiselect',
      defaultCollapsed: true,
      tooltipText: '',
      expandArrow: true,
      transformNodes: transformLicense,
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
      transformNodes: transformProgrammingLanguages,
    },
  ],
};
