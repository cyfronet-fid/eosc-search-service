import { ICollectionSearchMetadata } from '../../repositories/types';
import { URL_PARAM_NAME } from './nav-config.data';
import { environment } from '@environment/environment';
import { DEFAULT_FACET } from '@collections/data/config';

export const COLLECTION = environment.collectionsPrefix + 'dataset';
export const datasetsSearchMetadata: ICollectionSearchMetadata = {
  id: URL_PARAM_NAME,
  facets: DEFAULT_FACET,
  params: {
    qf: [
      'title^50',
      'author_names^30',
      'description^10',
      'keywords',
      'tag_list',
    ],
    collection: COLLECTION,
  },
};
