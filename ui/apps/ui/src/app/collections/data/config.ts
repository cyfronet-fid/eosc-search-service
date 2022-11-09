import { IFacetParam } from '@collections/repositories/types';

export const DEFAULT_FACET: { [field: string]: IFacetParam } = {
  title: { field: 'title', type: 'terms', limit: 0 },
};
