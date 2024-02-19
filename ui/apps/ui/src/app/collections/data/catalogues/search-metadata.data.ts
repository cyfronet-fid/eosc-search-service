import { URL_PARAM_NAME } from './nav-config.data';
import { ICollectionSearchMetadata } from '../../repositories/types';
import { CATALOGUE_QF, DEFAULT_FACET } from '@collections/data/config';

export const COLLECTION = 'catalogue';
export const cataloguesSearchMetadata: ICollectionSearchMetadata = {
  id: URL_PARAM_NAME,
  facets: DEFAULT_FACET,
  params: {
    qf: CATALOGUE_QF,
    collection: COLLECTION,
  },
};
