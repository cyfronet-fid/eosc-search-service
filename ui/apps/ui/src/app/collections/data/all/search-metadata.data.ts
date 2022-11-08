import { ICollectionSearchMetadata } from '../../repositories/types';
import { URL_PARAM_NAME } from './nav-config.data';

export const COLLECTION = 'all_collection';
export const allCollectionsSearchMetadata: ICollectionSearchMetadata = {
  id: URL_PARAM_NAME,
  facets: {
    type: { field: 'type', type: 'terms', limit: 0 },
    best_access_right: { field: 'best_access_right', type: 'terms', limit: 0 },
    language: { field: 'language', type: 'terms', limit: 0 },
    fos: { field: 'fos', type: 'terms', limit: 0 },
    unified_categories: {
      field: 'unified_categories',
      type: 'terms',
      limit: 0,
    },
  },
  queryMutator: (q: string) => q,
  params: {
    qf: ['title^50', 'author_names^30', 'description^10'],
    collection: COLLECTION,
  },
};
