import {
  IFacetBucket,
  IFilterNode,
  IFiltersConfig,
} from '../../repositories/types';
import { URL_PARAM_NAME } from './nav-config.data';
import { facetToFlatNodes } from '@components/filters/utils';

import { HORIZONTAL_TOOLTIP_TEXT } from '@collections/data/config';
import {
  alphanumericFilterSort,
  transformCatalogueNames,
} from '@collections/data/utils';

export const dataSourcesFilters: IFiltersConfig = {
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
      label: 'Access type',
      type: 'multiselect',
      defaultCollapsed: false,
      tooltipText: '',
    },
    {
      id: 'scientific_domains',
      filter: 'scientific_domains',
      label: 'Scientific Domains',
      type: 'multiselect',
      defaultCollapsed: false,
      tooltipText: '',
    },
    {
      id: 'categories',
      filter: 'categories',
      label: 'Categories',
      type: 'multiselect',
      defaultCollapsed: false,
      tooltipText: '',
    },
    {
      id: 'providers',
      filter: 'providers',
      label: 'Providers',
      type: 'multiselect',
      defaultCollapsed: false,
      tooltipText: '',
    },
    {
      id: 'resource_organisation',
      filter: 'resource_organisation',
      label: 'Resource organisation',
      type: 'multiselect',
      defaultCollapsed: true,
      tooltipText: '',
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
      id: 'dedicated_for',
      filter: 'dedicated_for',
      label: 'Dedicated for',
      type: 'multiselect',
      defaultCollapsed: true,
      tooltipText: '',
    },
    {
      id: 'platforms',
      filter: 'platforms',
      label: 'Related scientific communities and platforms',
      type: 'multiselect',
      defaultCollapsed: true,
      tooltipText: '',
    },
    {
      id: 'rating',
      filter: 'rating',
      label: 'Rating',
      type: 'multiselect',
      defaultCollapsed: true,
      tooltipText: '',
    },
    {
      id: 'geographical_availabilities',
      filter: 'geographical_availabilities',
      label: 'Access restrictions',
      type: 'multiselect',
      defaultCollapsed: true,
      tooltipText: '',

      onFacetsFetch: (bucketValues: IFacetBucket[]): IFilterNode[] =>
        facetToFlatNodes(bucketValues, 'geographical_availabilities').map(
          (node) => ({
            ...node,
            name: node.name === 'World' ? 'None' : node.name,
          })
        ),
    },
    {
      id: 'horizontal',
      filter: 'horizontal',
      label: 'Horizontal service',
      type: 'multiselect',
      defaultCollapsed: true,
      tooltipText: HORIZONTAL_TOOLTIP_TEXT,

      onFacetsFetch: (bucketValues: IFacetBucket[]): IFilterNode[] =>
        facetToFlatNodes(bucketValues, 'horizontal').map((node) => ({
          ...node,
          name: node.name === 'true' ? 'yes' : 'no',
        })),
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
  ],
};
