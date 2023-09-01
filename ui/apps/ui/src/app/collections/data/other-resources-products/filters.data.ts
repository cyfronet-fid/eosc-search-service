import { IFiltersConfig } from '../../repositories/types';
import { URL_PARAM_NAME } from './nav-config.data';
import { SDG_TOOLTIP_TEXT } from '@collections/data/config';
import {
  alphanumericFilterSort,
  convertCountryCodeToName,
} from '@collections/data/utils';

export const otherResourcesProductsFilters: IFiltersConfig = {
  id: URL_PARAM_NAME,
  filters: [
    {
      id: 'unified_categories',
      filter: 'unified_categories',
      label: 'Research step',
      type: 'multiselect',
      defaultCollapsed: false,
      tooltipText: '',
    },
    {
      id: 'best_access_right',
      filter: 'best_access_right',
      label: 'Access right',
      type: 'multiselect',
      defaultCollapsed: false,
      tooltipText: '',
    },
    {
      id: 'publication_date',
      filter: 'publication_date',
      label: 'Year range',
      type: 'date-year',
      defaultCollapsed: false,
      tooltipText: '',
    },
    {
      id: 'document_type',
      filter: 'document_type',
      label: 'Document type',
      type: 'multiselect',
      defaultCollapsed: false,
      tooltipText: '',
    },
    {
      id: 'fos',
      filter: 'fos',
      label: 'Scientific domain',
      type: 'multiselect',
      defaultCollapsed: false,
      tooltipText: '',
    },
    {
      id: 'country',
      filter: 'country',
      label: 'Country',
      type: 'multiselect',
      defaultCollapsed: true,
      tooltipText: '',
      onFacetsFetch: convertCountryCodeToName,
    },
    {
      id: 'language',
      filter: 'language',
      label: 'Language',
      type: 'multiselect',
      defaultCollapsed: true,
      tooltipText: '',
      customSort: alphanumericFilterSort,
    },
    {
      id: 'source',
      filter: 'source',
      label: 'Publisher',
      type: 'multiselect',
      defaultCollapsed: true,
      tooltipText: '',
    },
    {
      id: 'research_community',
      filter: 'research_community',
      label: 'Research community',
      type: 'multiselect',
      defaultCollapsed: true,
      tooltipText: '',
    },
    {
      id: 'funder',
      filter: 'funder',
      label: 'Funder',
      type: 'multiselect',
      defaultCollapsed: true,
      tooltipText: '',
    },
    {
      id: 'sdg',
      filter: 'sdg',
      label: 'Sustainable development goals',
      type: 'multiselect',
      defaultCollapsed: true,
      tooltipText: SDG_TOOLTIP_TEXT,
    },
    {
      id: 'author_names',
      filter: 'author_names',
      label: 'Author',
      type: 'tag',
      defaultCollapsed: false,
      tooltipText: '',
    },
    {
      id: 'license',
      filter: 'license',
      label: 'License',
      type: 'tag',
      defaultCollapsed: false,
      tooltipText: '',
    },
    {
      id: 'publisher',
      filter: 'publisher',
      label: 'Publisher',
      type: 'tag',
      defaultCollapsed: false,
      tooltipText: '',
    },
    {
      id: 'doi',
      filter: 'doi',
      label: 'DOI',
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
  ],
};
