import { URL_PARAM_NAME } from './nav-config.data';
import { ICollectionSearchMetadata } from '../../repositories/types';

export const COLLECTION = 'trainings';
export const trainingsSearchMetadata: ICollectionSearchMetadata = {
  id: URL_PARAM_NAME,
  facets: {
    Resource_Type_s: { field: 'Resource_Type_s', type: 'terms', limit: 0 },
    Content_Type_s: { field: 'Content_Type_s', type: 'terms', limit: 0 },
    Language_s: { field: 'Language_s', type: 'terms', limit: 0 },
    EOSC_PROVIDER_s: { field: 'EOSC_PROVIDER_s', type: 'terms', limit: 0 },
    Format_ss: { field: 'Format_s', type: 'terms', limit: 0 },
    Level_of_expertise_s: {
      field: 'Level_of_expertise_s',
      type: 'terms',
      limit: 0,
    },
    Target_group_s: { field: 'Target_group_s', type: 'terms', limit: 0 },
    Qualification_s: { field: 'Qualification_s', type: 'terms', limit: 0 },
    Duration_s: { field: 'Duration_s', type: 'terms', limit: 0 },
    Version_date__created_in__s: {
      field: 'Version_date__created_in__s',
      type: 'terms',
      limit: 0,
    },
  },
  queryMutator: (q: string) => q,
  params: {
    qf: ['Resource_title_s'],
    collection: COLLECTION,
  },
};
