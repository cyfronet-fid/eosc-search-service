import { IFiltersConfig } from '../../repositories/types';
import { URL_PARAM_NAME } from './nav-config.data';

export const trainingsFilters: IFiltersConfig = {
  id: URL_PARAM_NAME,
  filters: [
    {
      id: 'Resource_Type_s',
      filter: 'Resource_Type_s',
      label: 'Resource type',
      type: 'multiselect',
    },
    {
      id: 'Content_Type_s',
      filter: 'Content_Type_s',
      label: 'Content type',
      type: 'multiselect',
    },
    {
      id: 'Language_s',
      filter: 'Language_s',
      label: 'Language',
      type: 'multiselect',
    },
    {
      id: 'EOSC_PROVIDER_s',
      filter: 'EOSC_PROVIDER_s',
      label: 'Organisation',
      type: 'multiselect',
    },
    {
      id: 'Format_ss',
      filter: 'Format_ss',
      label: 'Format',
      type: 'multiselect',
    },
    {
      id: 'Level_of_expertise_s',
      filter: 'Level_of_expertise_s',
      label: 'Level of expertise',
      type: 'multiselect',
    },
    {
      id: 'Target_group_s',
      filter: 'Target_group_s',
      label: 'Target group',
      type: 'multiselect',
    },
    {
      id: 'Qualification_s',
      filter: 'Qualification_s',
      label: 'Qualification',
      type: 'multiselect',
    },
    {
      id: 'Duration_s',
      filter: 'Duration_s',
      label: 'Duration',
      type: 'multiselect',
    },
    {
      id: 'version_date__created_in__s',
      filter: 'Version_date__created_in__s',
      label: 'Created on',
      type: 'multiselect',
    },
  ],
};
