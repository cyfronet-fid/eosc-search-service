import { URL_PARAM_NAME } from './nav-config.data';
import { ICollectionSearchMetadata } from '../../repositories/types';

export const COLLECTION = 'training';
export const trainingsSearchMetadata: ICollectionSearchMetadata = {
  id: URL_PARAM_NAME,
  facets: {
    resource_type: { field: 'resource_type', type: 'terms', limit: 0 },
    content_type: { field: 'content_type', type: 'terms', limit: 0 },
    language: { field: 'language', type: 'terms', limit: 0 },
    eosc_provider: { field: 'eosc_provider', type: 'terms', limit: 0 },
    format: { field: 'format', type: 'terms', limit: 0 },
    level_of_expertise: {
      field: 'level_of_expertise',
      type: 'terms',
      limit: 0,
    },
    target_group: { field: 'target_group', type: 'terms', limit: 0 },
    qualification: { field: 'qualification', type: 'terms', limit: 0 },
    duration: { field: 'duration', type: 'terms', limit: 0 },
    publication_date: {
      field: 'publication_date',
      type: 'terms',
      limit: 0,
    },
    best_access_right: { field: 'best_access_right', type: 'terms', limit: 0 },
  },
  params: {
    qf: ['title', 'description', 'keywords'],
    collection: COLLECTION,
  },
};
