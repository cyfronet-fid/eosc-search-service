import {
  ICollectionSearchMetadata,
  IFacetParam,
  IFilterNode,
} from '@collections/repositories/types';

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import Fuse from 'fuse.js';

export const toSearchMetadata = (
  q: string,
  fq: string[],
  metadata: ICollectionSearchMetadata
) => ({
  q: q,
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
