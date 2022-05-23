import { ISet } from './set.model';
import { servicesCollection } from '../collections/services/services.collection';
import { publicationsCollection } from '../collections/publications/publications.collection';

export const ALL_CATALOGS_LABEL = 'All catalogs';
export const allSet: ISet = {
  title: ALL_CATALOGS_LABEL,
  breadcrumbs: [
    {
      label: 'All catalogs',
    },
  ],
  urlPath: 'all',
  collections: [servicesCollection, publicationsCollection],
};
