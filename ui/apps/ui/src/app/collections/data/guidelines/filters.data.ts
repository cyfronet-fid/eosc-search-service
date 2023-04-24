import { IFiltersConfig } from '../../repositories/types';
import { URL_PARAM_NAME } from './nav-config.data';

export const guidelinesFilters: IFiltersConfig = {
  id: URL_PARAM_NAME,
  filters: [
    {
      id: 'author_names',
      filter: 'author_names',
      label: 'Creator Name',
      type: 'tag',
    },
    {
      id: 'right_id',
      filter: 'right_id',
      label: 'License',
      type: 'tag',
    },
    {
      id: 'keywords',
      filter: 'keywords',
      label: 'Keywords',
      type: 'tag',
    },
  ],
};
