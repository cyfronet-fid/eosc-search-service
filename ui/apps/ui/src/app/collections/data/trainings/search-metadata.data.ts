import { URL_PARAM_NAME } from './nav-config.data';
import { ICollectionSearchMetadata } from '../../repositories/types';
import { environment } from '@environment/environment';
import { DEFAULT_FACET } from '@collections/data/config';

export const COLLECTION = environment.collectionsPrefix + 'training';
export const trainingsSearchMetadata: ICollectionSearchMetadata = {
  id: URL_PARAM_NAME,
  facets: DEFAULT_FACET,
  params: {
    qf: ['title^50', 'description^30', 'keywords', 'tag_list'],
    collection: COLLECTION,
  },
};
