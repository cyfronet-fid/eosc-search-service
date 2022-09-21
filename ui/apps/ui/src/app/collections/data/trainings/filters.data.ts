import { IFiltersConfig } from '../../repositories/types';
import { URL_PARAM_NAME } from './nav-config.data';

export const trainingsFilters: IFiltersConfig = {
  id: URL_PARAM_NAME,
  filters: [
    {
      id: 'best_access_right',
      filter: 'best_access_right',
      label: 'Access right',
      type: 'multiselect',
    },
    {
      id: 'resource_type',
      filter: 'resource_type',
      label: 'Resource type',
      type: 'multiselect',
    },
    {
      id: 'content_type',
      filter: 'content_type',
      label: 'Content type',
      type: 'multiselect',
    },
    {
      id: 'language',
      filter: 'language',
      label: 'Language',
      type: 'multiselect',
    },
    {
      id: 'eosc_provider',
      filter: 'eosc_provider',
      label: 'Organisation',
      type: 'multiselect',
    },
    {
      id: 'format',
      filter: 'format',
      label: 'Format',
      type: 'multiselect',
    },
    {
      id: 'level_of_expertise',
      filter: 'level_of_expertise',
      label: 'Level of expertise',
      type: 'multiselect',
    },
    {
      id: 'target_group',
      filter: 'target_group',
      label: 'Target group',
      type: 'multiselect',
    },
    {
      id: 'qualification',
      filter: 'qualification',
      label: 'Qualification',
      type: 'multiselect',
    },
    {
      id: 'duration',
      filter: 'duration',
      label: 'Duration',
      type: 'range',
    },
    {
      id: 'publication_date',
      filter: 'publication_date',
      label: 'Version date',
      type: 'date',
    },
    {
      id: 'author_names',
      filter: 'author_names',
      label: 'Authors',
      type: 'tag',
    },
    {
      id: 'keywords',
      filter: 'keywords',
      label: 'Keywords',
      type: 'tag',
    },
    {
      id: 'license',
      filter: 'license',
      label: 'License',
      type: 'tag',
    },
  ],
};
