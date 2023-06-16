import { URL_PARAM_NAME } from './nav-config.data';
import { ICollectionSearchMetadata } from '../../repositories/types';
import { environment } from '@environment/environment';
import { DEFAULT_FACET, PROVIDER_QF } from '@collections/data/config';

export const COLLECTION = environment.collectionsPrefix + 'provider';
export const providersSearchMetadata: ICollectionSearchMetadata = {
  id: URL_PARAM_NAME,
  facets: DEFAULT_FACET,
  params: {
    qf: PROVIDER_QF,
    collection: COLLECTION,
  },
};
