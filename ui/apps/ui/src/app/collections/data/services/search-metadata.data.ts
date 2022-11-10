import { ICollectionSearchMetadata } from '../../repositories/types';
import { URL_PARAM_NAME } from './nav-config.data';
import { environment } from '@environment/environment';

export const COLLECTION = environment.collectionsPrefix + 'service';
export const servicesSearchMetadata: ICollectionSearchMetadata = {
  id: URL_PARAM_NAME,
  facets: {
    scientific_domains: {
      field: 'scientific_domains',
      type: 'terms',
      limit: 0,
    },
    providers: {
      field: 'providers',
      type: 'terms',
      limit: 0,
    },
    dedicated_for: {
      field: 'dedicated_for',
      type: 'terms',
      limit: 0,
    },
    related_platforms: {
      field: 'related_platforms',
      type: 'terms',
      limit: 0,
    },
    rating: {
      field: 'rating',
      type: 'terms',
      limit: 0,
    },
    geographical_availabilities: {
      field: 'geographical_availabilities',
      type: 'terms',
      limit: 0,
    },
    categories: {
      field: 'categories',
      type: 'terms',
      limit: 0,
    },
    resource_organisation: {
      field: 'resource_organisation',
      type: 'terms',
      limit: 0,
    },
    best_access_right: {
      field: 'best_access_right',
      type: 'terms',
      limit: 0,
    },
  },
  queryMutator: (q: string) => q + '*',
  params: {
    qf: ['title^50', 'author_names^30', 'description^10'],
    collection: COLLECTION,
  },
};
