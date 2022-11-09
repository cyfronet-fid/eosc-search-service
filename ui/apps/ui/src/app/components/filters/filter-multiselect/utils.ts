import {
  ICollectionSearchMetadata,
  IFacetParam,
} from '@collections/repositories/types';
import { FilterTreeNode } from '@components/filters/types';

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import Fuse from 'fuse.js';

export const toSearchMetadata = (
  q: string,
  fq: string[],
  metadata: ICollectionSearchMetadata
) => ({
  q: metadata.queryMutator(q),
  fq,
  cursor: '*',
  rows: 0,
  sort: [],
  ...metadata.params,
});

export const toFilterFacet = (
  filter: string
): { [field: string]: IFacetParam } => ({
  [filter]: {
    field: filter,
    type: 'terms',
    limit: -1,
  },
});

export const search = (query: string | null, entities: FilterTreeNode[]) => {
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
