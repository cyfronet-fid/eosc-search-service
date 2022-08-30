import {
  ICollectionSearchMetadata,
  IFacetParam,
} from '@collections/repositories/types';

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
  filter: string,
  facets: { [facet: string]: IFacetParam }
) => ({
  [filter]: {
    ...facets[filter],
    limit: -1,
  },
});
