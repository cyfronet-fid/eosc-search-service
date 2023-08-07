import { IFilterNode } from '@collections/repositories/types';

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import Fuse from 'fuse.js';

export const search = (query: string | null, entities: IFilterNode[]) => {
  if (!query || query.trim() === '') {
    return entities;
  }

  return new Fuse(entities, {
    keys: ['name'],
    shouldSort: false,
    threshold: 0.2,
  })
    .search(query)
    .map(({ item }) => item);
};
