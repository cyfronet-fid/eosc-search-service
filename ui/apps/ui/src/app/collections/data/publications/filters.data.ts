import { IFiltersConfig } from '../../repositories/types';
import { URL_PARAM_NAME } from './nav-config.data';
import {
  DATASOURCE_FILTER_TOOLTIP_TEXT,
  INTEROPERABILITY_PATTERNS_TOOLTIP_TEXT,
  SDG_TOOLTIP_TEXT,
} from '@collections/data/config';
import {
  alphanumericFilterSort,
  transformCountryNames,
  transformDataSourceNames,
} from '@collections/data/utils';

export const publicationsFilters: IFiltersConfig = {
  id: URL_PARAM_NAME,
  filters: [
    {
      id: 'unified_categories',
      filter: 'unified_categories',
      label: 'Research step',
      type: 'multiselect',
      defaultCollapsed: false,
      tooltipText: '',
      expandArrow: true,
    },
    {
      id: 'best_access_right',
      filter: 'best_access_right',
      label: 'Access right',
      type: 'multiselect',
      defaultCollapsed: false,
      tooltipText: '',
      expandArrow: true,
    },
    {
      id: 'document_type',
      filter: 'document_type',
      label: 'Document type',
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
      id: 'eosc_if',
      filter: 'eosc_if',
      label: 'Interoperability pattern',
      type: 'multiselect',
      defaultCollapsed: false,
      tooltipText: INTEROPERABILITY_PATTERNS_TOOLTIP_TEXT,
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
      id: 'country',
      filter: 'country',
      label: 'Country',
      type: 'multiselect',
      defaultCollapsed: true,
      tooltipText: '',
      transformNodes: transformCountryNames,
      expandArrow: true,
    },
    {
      id: 'language',
      filter: 'language',
      label: 'Language',
      type: 'multiselect',
      defaultCollapsed: true,
      tooltipText: '',
      customSort: alphanumericFilterSort,
      expandArrow: true,
    },
    {
      id: 'publisher',
      filter: 'publisher',
      label: 'Publisher',
      type: 'multiselect',
      defaultCollapsed: true,
      tooltipText: '',
      expandArrow: true,
    },
    {
      id: 'research_community',
      filter: 'research_community',
      label: 'Research community',
      type: 'multiselect',
      defaultCollapsed: true,
      tooltipText: '',
      expandArrow: true,
    },
    {
      id: 'funder',
      filter: 'funder',
      label: 'Funder',
      type: 'multiselect',
      defaultCollapsed: true,
      tooltipText: '',
      expandArrow: true,
    },
    {
      id: 'sdg',
      filter: 'sdg',
      label: 'Sustainable development goal',
      type: 'multiselect',
      defaultCollapsed: true,
      tooltipText: SDG_TOOLTIP_TEXT,
      expandArrow: true,
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
    {
      id: 'eosc_if',
      filter: 'eosc_if',
      label: 'Interoperability pattern',
      type: 'tag',
      defaultCollapsed: false,
      tooltipText: '',
    },
    {
      id: 'datasource_pids',
      filter: 'datasource_pids',
      label: 'Data Source',
      type: 'dropdown',
      defaultCollapsed: false,
      tooltipText: DATASOURCE_FILTER_TOOLTIP_TEXT,
      global: true,
      transformNodes: transformDataSourceNames,
    },
  ],
};
