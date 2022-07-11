import {HashMap} from "@eosc-search-service/types";
import {IFacetResponse, INITIAL_FILTER_OPTION_COUNT} from "../common";
import {ICollectionSearchMetadata} from "../results";
import {IFilterConfiguration, TreeNode} from "@eosc-search-service/common";

export interface IFilter {
  id: string;
  title: string;
  showMore: boolean;
  cursors: {[x: string]: {offset: number, moreAvailable: boolean}};
  data: TreeNode[];
}

export interface IFilterEntry {
  title: string;
  count: number;
}

export function mapFacetToTreeNodes(facet: IFacetResponse, facetName: string, fqs?: string[]): any[] {
  return facet.buckets.map(({ val, count }) => ({
    name: val + '',
    value: val + '',
    count: count + '',
    filter: facetName,
    isSelected: fqs === undefined ? false : fqs.some((filter) => filter === `${facetName}:"${val}"`),
  }));
}

export function addFacetsToFilter(collection: ICollectionSearchMetadata, facets: HashMap<IFacetResponse>, filtersTree: IFilter[], fqs?: string[]): void {
  Object.keys(facets)
    .map((facet) => collection.filtersConfigurations.find(({ filter }) => filter === facet) as IFilterConfiguration)
    .filter(filterConfiguration => filterConfiguration)
    .forEach(({ label, filter}) => {
      const existingFilter = filtersTree.find(
        (filterNode) => filterNode.title === filter
      );
      const data = mapFacetToTreeNodes(facets[filter], filter, fqs)
      if (!existingFilter) {
        filtersTree.push({
          id: filter,
          title: label,
          data,
          cursors: {[collection.type]: {moreAvailable: data.length === INITIAL_FILTER_OPTION_COUNT, offset: INITIAL_FILTER_OPTION_COUNT}},
          showMore: false,
        });
      } else {
        if (existingFilter.cursors[collection.type] === undefined) {
          existingFilter.cursors[collection.type] = {moreAvailable: data.length === INITIAL_FILTER_OPTION_COUNT, offset: INITIAL_FILTER_OPTION_COUNT};
        }
        existingFilter.data = [...existingFilter.data, ...data];
      }
    });
}
