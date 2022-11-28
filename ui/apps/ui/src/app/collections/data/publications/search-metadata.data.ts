import { ICollectionSearchMetadata } from '../../repositories/types';
import { URL_PARAM_NAME } from './nav-config.data';
import { DEFAULT_FACET } from '@collections/data/config';
import { COLLECTION } from '@collections/data/all/search-metadata.data';

export const publicationsSearchMetadata: ICollectionSearchMetadata = {
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
