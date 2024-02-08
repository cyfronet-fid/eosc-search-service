import { URL_PARAM_NAME } from './nav-config.data';
import { ICollectionSearchMetadata } from '../../repositories/types';
import { DEFAULT_FACET, ORGANISATION_QF } from '@collections/data/config';

export const COLLECTION = 'organisation';
export const organisationsSearchMetadata: ICollectionSearchMetadata = {
  id: URL_PARAM_NAME,
  facets: DEFAULT_FACET,
  params: {
    qf: ORGANISATION_QF,
    collection: COLLECTION,
  },
};
