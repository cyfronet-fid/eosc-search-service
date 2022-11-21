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
  q: query_changer(q),
  fq,
  cursor: '*',
  rows: 0,
  sort: [],
  ...metadata.params,
});

export const toFilterFacet = (
  filter: string,
  facets: { [facet: string]: IFacetParam }
) => ({
  [filter]: {
    ...facets[filter],
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

export const query_changer = (q: string) => {
  const nq = q.split(' ');
    let new_query = '';
    nq.forEach(function(value) {
      value = value + '~1';
      new_query = new_query + value + ' ';
    });
    return new_query;
}
