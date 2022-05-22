import { ISet } from './set.model';
import { ALL_CATALOGS_LABEL } from './all.set';
import { servicesCollection } from '../collections/services/services.collection';

export const servicesSet: ISet = {
  title: 'Services',
  breadcrumbs: [
    {
      label: ALL_CATALOGS_LABEL,
      url: '/search/all',
    },
    {
      label: 'Services',
    },
  ],
  urlPath: 'services',
  collections: [servicesCollection],
};
