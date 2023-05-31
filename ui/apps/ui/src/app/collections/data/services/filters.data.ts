import {
  IFacetBucket,
  IFilterNode,
  IFiltersConfig,
} from '../../repositories/types';
import { URL_PARAM_NAME } from './nav-config.data';
import { facetToFlatNodes } from '@components/filters/utils';

export const servicesFilters: IFiltersConfig = {
  id: URL_PARAM_NAME,
  filters: [
    {
      id: 'unified_categories',
      filter: 'unified_categories',
      label: 'Research step',
      type: 'multiselect',
      defaultCollapsed: false,
    },
    {
      id: 'best_access_right',
      filter: 'best_access_right',
      label: 'Access type',
      type: 'multiselect',
      defaultCollapsed: false,
    },
    {
      id: 'scientific_domains',
      filter: 'scientific_domains',
      label: 'Scientific Domains',
      type: 'multiselect',
      defaultCollapsed: false,
    },
    {
      id: 'categories',
      filter: 'categories',
      label: 'Categories',
      type: 'multiselect',
      defaultCollapsed: false,
    },
    {
      id: 'providers',
      filter: 'providers',
      label: 'Providers',
      type: 'multiselect',
      defaultCollapsed: false,
    },
    {
      id: 'resource_organisation',
      filter: 'resource_organisation',
      label: 'Resource organisation',
      type: 'multiselect',
      defaultCollapsed: true,
    },
    {
      id: 'dedicated_for',
      filter: 'dedicated_for',
      label: 'Dedicated for',
      type: 'multiselect',
      defaultCollapsed: true,
    },
    {
      id: 'platforms',
      filter: 'platforms',
      label: 'Related scientific communities and platforms',
      type: 'multiselect',
      defaultCollapsed: true,
    },
    {
      id: 'rating',
      filter: 'rating',
      label: 'Rating',
      type: 'multiselect',
      defaultCollapsed: true,
    },
    {
      id: 'geographical_availabilities',
      filter: 'geographical_availabilities',
      label: 'Access restrictions',
      type: 'multiselect',
      defaultCollapsed: true,

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

      onFacetsFetch: (bucketValues: IFacetBucket[]): IFilterNode[] =>
        facetToFlatNodes(bucketValues, 'horizontal').map((node) => ({
          ...node,
          name: node.name === 'true' ? 'yes' : 'no',
        })),
    },
    {
      id: 'language',
      filter: 'language',
      label: 'Language',
      type: 'tag',
      defaultCollapsed: false,
    },
    {
      id: 'tag_list',
      filter: 'tag_list',
      label: 'Keywords',
      type: 'tag',
      defaultCollapsed: false,
    },
  ],
};
