import { ICollectionSearchMetadata } from '../../repositories/types';
import { URL_PARAM_NAME } from './nav-config.data';

export const COLLECTION = 'all';
export const allCollectionsSearchMetadata: ICollectionSearchMetadata = {
  id: URL_PARAM_NAME,
  facets: {},
  queryMutator: (q: string) => q,
  params: {
    qf: [],
    collection: COLLECTION,
  },
};
