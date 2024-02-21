import { URL_PARAM_NAME } from './nav-config.data';
import { ICollectionSearchMetadata } from '../../repositories/types';
import { DEFAULT_FACET, PROJECT_QF } from '@collections/data/config';

export const COLLECTION = 'project';
export const projectsSearchMetadata: ICollectionSearchMetadata = {
  id: URL_PARAM_NAME,
  facets: DEFAULT_FACET,
  params: {
    qf: PROJECT_QF,
    collection: COLLECTION,
  },
};
