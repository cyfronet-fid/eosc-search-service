import { allSet } from '../app/sets/all.set';
import { researchProductsSet } from '../app/sets/research-products.set';
import { servicesSet } from '../app/sets/services.set';
import { trainingsSet } from '../app/sets/trainings.set';

export const environment = {
  production: true,
  backendApiPath: 'api/web',
  search: {
    sets: [allSet, researchProductsSet, servicesSet, trainingsSet],
    apiPath: 'search-results',
  },
};
