import { ICollectionSearchMetadata } from '../../repositories/types';
import { URL_PARAM_NAME } from './nav-config.data';
import { environment } from '@environment/environment';
import { DEFAULT_FACET } from '@collections/data/config';

export const COLLECTION = environment.collectionsPrefix + 'all_collection';
export const allCollectionsSearchMetadata: ICollectionSearchMetadata = {
  id: URL_PARAM_NAME,
  facets: DEFAULT_FACET,
  queryMutator: (q: string) => q,
  params: {
    qf: ['title^50', 'author_names^30', 'description^10'],
    collection: COLLECTION,
  },
};
