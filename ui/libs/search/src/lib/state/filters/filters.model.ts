import {HashMap} from "@eosc-search-service/types";
import {IFacetResponse, INITIAL_FILTER_OPTION_COUNT} from "../common";
import {ICollectionSearchMetadata} from "../results";
import {TreeNode} from "@eosc-search-service/common";

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
    .filter((facet) => collection.filterToField[facet])
    .forEach((facet) => {
      const filterName = collection.filterToField[facet];
      const existingFilter = filtersTree.find(
        (filter) => filter.title === filterName
      );
      const data = mapFacetToTreeNodes(facets[facet], facet, fqs)
      if (!existingFilter) {
        filtersTree.push({
          id: facet,
          title: filterName,
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
