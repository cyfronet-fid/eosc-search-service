import {
  IFacetBucket,
  IFilterNode,
  IFiltersConfig,
} from '../../repositories/types';
import { URL_PARAM_NAME } from './nav-config.data';
import { facetToFlatNodes } from '@components/filters/utils';
import { HORIZONTAL_TOOLTIP_TEXT } from '@collections/data/config';
import { alphanumericFilterSort } from '@collections/data/utils';

export const allCollectionsFilters: IFiltersConfig = {
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
      id: 'type',
      filter: 'type',
      label: 'Type of research product',
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
      id: 'fos',
      filter: 'fos',
      label: 'Scientific discipline',
      type: 'multiselect',
      defaultCollapsed: false,
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
      id: 'author_names',
      filter: 'author_names',
      label: 'Author name',
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
      label: 'Scientific Domains',
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
  ],
};
