import { IFacetParam } from '@collections/repositories/types';

export const DEFAULT_FACET: { [field: string]: IFacetParam } = {
  title: { field: 'title', type: 'terms', limit: 0 },
};
export const DEFAULT_QF = [
  'title^100',
  'author_names_tg^100',
  'description^30',
  'keywords_tg^10',
  'tag_list_tg^10',
];
