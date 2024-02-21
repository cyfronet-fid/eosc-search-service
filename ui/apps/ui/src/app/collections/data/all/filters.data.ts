import { IFiltersConfig } from '../../repositories/types';
import { URL_PARAM_NAME } from './nav-config.data';
import {
  HORIZONTAL_TOOLTIP_TEXT,
  INTEROPERABILITY_PATTERNS_TOOLTIP_TEXT,
} from '@collections/data/config';
import {
  alphanumericFilterSort,
  transformBoolean,
  transformCatalogueNames,
} from '@collections/data/utils';

export const allCollectionsFilters: IFiltersConfig = {
  id: URL_PARAM_NAME,
  filters: [
    {
      id: 'related_organisation_titles',
      filter: 'related_organisation_titles',
      label: 'Related organisations',
      type: 'tag',
      defaultCollapsed: false,
      tooltipText: '',
    },
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
      id: 'type',
      filter: 'type',
      label: 'Type of research product',
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
    // {
    //   id: 'related_organisation_titles',
    //   filter: 'related_organisation_titles',
    //   label: 'Related organisations',
    //   type: 'multiselect',
    //   defaultCollapsed: false,
    //   tooltipText: '',
    // },
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
      id: 'horizontal',
      filter: 'horizontal',
      label: 'Horizontal service',
      type: 'multiselect',
      defaultCollapsed: true,
      tooltipText: HORIZONTAL_TOOLTIP_TEXT,
      transformNodes: transformBoolean,
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
      id: 'doi',
      filter: 'doi',
      label: 'DOI',
      type: 'tag',
      defaultCollapsed: false,
      tooltipText: '',
    },
    {
      id: 'scientific_domains',
      filter: 'scientific_domains',
      label: 'Scientific domain',
      type: 'tag',
      defaultCollapsed: false,
      tooltipText: '',
    },
    {
      id: 'resource_organisation',
      filter: 'resource_organisation',
      label: 'Resource organisation',
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
      id: 'keywords',
      filter: 'keywords',
      label: 'Keywords',
      type: 'tag',
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
    {
      id: 'catalogue',
      filter: 'catalogue',
      label: 'Community Catalog',
      type: 'dropdown',
      defaultCollapsed: false,
      tooltipText: '',
      global: true,
      transformNodes: transformCatalogueNames,
    },
    {
      id: 'guidelines_str',
      filter: 'guidelines_str',
      label: 'Interoperability guideline',
      type: 'tag',
      defaultCollapsed: false,
      tooltipText: '',
    },
    {
      id: 'providers',
      filter: 'providers',
      label: 'Provider',
      type: 'tag',
      defaultCollapsed: false,
      tooltipText: '',
    },
    {
      id: 'resource_organisation',
      filter: 'resource_organisation',
      label: 'Resource Organisation',
      type: 'tag',
      defaultCollapsed: false,
      tooltipText: '',
    },
  ],
};
