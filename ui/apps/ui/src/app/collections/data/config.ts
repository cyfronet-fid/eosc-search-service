import { IFacetParam } from '@collections/repositories/types';

export const DEFAULT_FACET: { [field: string]: IFacetParam } = {
  title: { field: 'title', type: 'terms', limit: 0 },
};
export const DEFAULT_QF =
  'title^100 author_names_tg^120 description^10 keywords_tg^10 tag_list_tg^10';

export const HORIZONTAL_TOOLTIP_TEXT =
  'Horizontal Services’ are services potentially useful for all researchers' +
  ', no matter their affiliation nor scientific discipline. Usually provided' +
  ' by computing centers and e-Infrastructures. They bring an additional value' +
  ' to service providers and developers, who want to enhance their services with' +
  ' new capabilities like computing or storage.';

export const SDG_TOOLTIP_TEXT =
  'The Sustainable Development Goals Are a collection of seventeen interlinked ' +
  'objectives designed to achieve a better and more sustainable future for all.' +
  ' They address the global challenges we face, including poverty, inequality, ' +
  'climate change, environmental degradation, peace, and justice.';
