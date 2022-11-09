import { FilterTreeNode, IFacetResponse } from './types';

export const facetToTreeNodes = (
  facet: IFacetResponse,
  facetName: string
): FilterTreeNode[] =>
  (facet?.buckets || []).map(({ val, count }) => ({
    id: val + '',
    name: val + '',
    value: val + '',
    count: count + '',
    filter: facetName,
    isSelected: false,
    level: 0,
    expandable: false,
  }));
