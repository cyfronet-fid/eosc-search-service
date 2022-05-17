import { ISet } from './set.model';
import { researchProductsCollection } from '../collections/research-products/research-products.collection';
import { ALL_CATALOGS_LABEL } from './all.set';

export const researchProductsSet: ISet = {
  title: 'Research products',
  breadcrumbs: [
    {
      label: ALL_CATALOGS_LABEL,
      url: '',
    },
    {
      label: 'Research products',
    },
  ],
  urlPath: 'research-products',
  collections: [researchProductsCollection],
};
