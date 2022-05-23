import { ISet } from './set.model';
import { publicationsCollection } from '../collections/publications/publications.collection';
import { ALL_CATALOGS_LABEL } from './all.set';

export const publicationsSet: ISet = {
  title: 'Publications',
  breadcrumbs: [
    {
      label: ALL_CATALOGS_LABEL,
      url: '/search/all',
    },
    {
      label: 'Publications',
    },
  ],
  urlPath: 'publications',
  collections: [publicationsCollection],
};
