import { HashMap } from '@eosc-search-service/types';
import { IFacetResponse, INITIAL_FILTER_OPTION_COUNT } from '../common';
import { ICollectionSearchMetadata } from '../results';
import { IFilterConfiguration, TreeNode } from '@eosc-search-service/common';

export interface IFilter {
  id: string;
  title: string;
  showMore: boolean;
  offset: number;
  count?: number;
  moreAvailable: boolean;
  data: TreeNode[];
}

export interface IFilterEntry {
  title: string;
  count: number;
}

export function mapFacetToTreeNodes(
  facet: IFacetResponse,
  facetName: string,
  fqs?: string[]
): any[] {
  return facet.buckets.map(({ val, count }) => ({
    name: val + '',
    value: val + '',
    count: count + '',
    filter: facetName,
    isSelected:
      fqs === undefined
        ? false
        : fqs.some((filter) => filter === `${facetName}:"${val}"`),
  }));
}

export function addFacetsToFilter(
  collection: ICollectionSearchMetadata,
  facets: HashMap<IFacetResponse>,
  filtersTree: IFilter[],
  fqs?: string[]
): void {
  Object.keys(facets)
    .map(
      (facet) =>
        collection.filtersConfigurations.find(
          ({ filter }) => filter === facet
        ) as IFilterConfiguration
    )
    .filter((filterConfiguration) => filterConfiguration)
    .forEach(({ label, filter }) => {
      const data = mapFacetToTreeNodes(facets[filter], filter, fqs);
      filtersTree.push({
        id: filter,
        title: label,
        data,
        offset: INITIAL_FILTER_OPTION_COUNT,
        moreAvailable: data.length === INITIAL_FILTER_OPTION_COUNT,
        count: undefined,
        showMore: false,
      });
    });
}
