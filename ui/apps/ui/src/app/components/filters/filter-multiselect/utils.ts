import { IFilterNode, ITermsFacetParam } from '@collections/repositories/types';

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import Fuse from 'fuse.js';

export const toFilterFacet = (
  filter: string
): { [field: string]: ITermsFacetParam } => ({
  [filter]: {
    field: filter,
    type: 'terms',
    limit: -1,
  },
});

export const search = (query: string | null, entities: IFilterNode[]) => {
  if (!query || query.trim() === '') {
    return entities;
  }

  return new Fuse(entities, {
    keys: ['name'],
    shouldSort: false,
  })
    .search(query)
    .map(({ item }) => item);
};
