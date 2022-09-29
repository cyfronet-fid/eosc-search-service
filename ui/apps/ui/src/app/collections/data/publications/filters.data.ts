import { IFiltersConfig } from '../../repositories/types';
import { URL_PARAM_NAME } from './nav-config.data';

export const publicationsFilters: IFiltersConfig = {
  id: URL_PARAM_NAME,
  filters: [
    {
      id: 'best_access_right',
      filter: 'best_access_right',
      label: 'Access right',
      type: 'multiselect',
    },
    {
      id: 'publication_date',
      filter: 'publication_date',
      label: 'Year range',
      type: 'date',
    },
    {
      id: 'document_type',
      filter: 'document_type',
      label: 'Document type',
      type: 'multiselect',
    },
    {
      id: 'fos',
      filter: 'fos',
      label: 'Scientific domain',
      type: 'multiselect',
    },
    {
      id: 'funder',
      filter: 'funder',
      label: 'Funder',
      type: 'multiselect',
    },
    {
      id: 'sdg',
      filter: 'sdg',
      label: 'SDG [Beta]',
      type: 'multiselect',
    },
    {
      id: 'country',
      filter: 'country',
      label: 'Country',
      type: 'multiselect',
    },
    {
      id: 'language',
      filter: 'language',
      label: 'Language',
      type: 'multiselect',
    },
    {
      id: 'source',
      filter: 'source',
      label: 'Publisher',
      type: 'multiselect',
    },
    {
      id: 'research_community',
      filter: 'research_community',
      label: 'Research community',
      type: 'multiselect',
    },
    {
      id: 'author_names',
      filter: 'author_names',
      label: 'Author names',
      type: 'tag',
    },
    {
      id: 'license',
      filter: 'license',
      label: 'License',
      type: 'tag',
    },
    {
      id: 'publisher',
      filter: 'publisher',
      label: 'Publisher',
      type: 'tag',
    },
    {
      id: 'url',
      filter: 'url',
      label: 'DOI',
      type: 'tag',
    },
  ],
};
