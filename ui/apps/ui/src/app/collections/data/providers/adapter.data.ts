import { IAdapter, IResult } from '../../repositories/types';
import { URL_PARAM_NAME } from './nav-config.data';
import { v4 as uuidv4 } from 'uuid';
import { COLLECTION } from './search-metadata.data';
import { IProvider } from '@collections/data/providers/provider.model';
import { parseStatistics } from '@collections/data/utils';
import {
  toArray,
  toValueWithLabel,
} from '@collections/filters-serializers/utils';
import { ConfigService } from '../../../services/config.service';

const getDescription = (desc: string[]) => {
  return desc.join('');
};

export const providersAdapter: IAdapter = {
  id: URL_PARAM_NAME,
  adapter: (provider: Partial<IProvider> & { id: string }): IResult => ({
    isSortCollectionScopeOff: false,
    isSortByRelevanceCollectionScopeOff: true,
    isResearchProduct: false,
    id: uuidv4(),
    title: provider['title'] ? provider['title'].toString() : '',
    abbreviation: provider['abbreviation']
      ? provider['abbreviation'].toString()
      : '',
    description: provider['description']
      ? getDescription(provider['description'])
      : '',
    type: {
      label: 'provider',
      value: 'provider',
    },
    collection: COLLECTION,
    coloredTags: [],
    tags: [
      {
        label: 'Scientific domain',
        values: toValueWithLabel(toArray(provider.scientific_domains)),
        filter: 'scientific_domains',
      },
    ],
    url: provider.pid
      ? `${ConfigService.config?.marketplace_url}/providers/${provider.pid}`
      : '',
    ...parseStatistics(provider),
  }),
};
