import { ICollectionSearchMetadata } from '../../repositories/types';
import { URL_PARAM_NAME } from './nav-config.data';

export const COLLECTION = 'marketplace';
export const servicesSearchMetadata: ICollectionSearchMetadata = {
  id: URL_PARAM_NAME,
  facets: {
    resource_organisation_s: {
      field: 'resource_organisation_s',
      type: 'terms',
    },
    categories_ss: { field: 'categories_ss', type: 'terms', limit: 0 },
    providers_ss: { field: 'providers_ss', type: 'terms', limit: 0 },
    geographical_availabilities_ss: {
      field: 'geographical_availabilities_ss',
      type: 'terms',
    },
  },
  queryMutator: (q: string) => q + '*',
  params: {
    qf: [
      'name_t',
      'resource_organisation_s',
      'tagline_t',
      'scientific_domains_ss',
    ],
    collection: COLLECTION,
  },
};