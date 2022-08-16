import { IFiltersConfig } from '../../repositories/types';
import { URL_PARAM_NAME } from './nav-config.data';

export const datasetsFilters: IFiltersConfig = {
  id: URL_PARAM_NAME,
  filters: [
    {
      id: 'publisher',
      filter: 'publisher',
      label: 'Publisher',
      type: 'multiselect',
    },
    {
      id: 'bestaccessright',
      filter: 'bestaccessright',
      label: 'Access right',
      type: 'multiselect',
    },
    {
      id: 'language',
      filter: 'language',
      label: 'Language',
      type: 'multiselect',
    },
  ],
};
