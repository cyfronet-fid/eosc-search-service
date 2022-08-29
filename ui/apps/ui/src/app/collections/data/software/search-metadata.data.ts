import { ICollectionSearchMetadata } from '../../repositories/types';
import { URL_PARAM_NAME } from './nav-config.data';

export const COLLECTION = 'oag_software';
export const softwareSearchMetadata: ICollectionSearchMetadata = {
  id: URL_PARAM_NAME,
  facets: {
    publisher: { field: 'publisher', type: 'terms', limit: 0 },
    bestaccessright: { field: 'bestaccessright', type: 'terms', limit: 0 },
    language: { field: 'language', type: 'terms', limit: 0 },
  },
  queryMutator: (q: string) => q,
  params: {
    qf: [
      'title^50',
      'author_names^30',
      'publisher^30',
      'bestaccessright',
      'description^10',
    ],
    collection: COLLECTION,
  },
};
