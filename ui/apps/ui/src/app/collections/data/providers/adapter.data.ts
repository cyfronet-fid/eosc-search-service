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
import { toKeywordsSecondaryTag } from '@collections/data/utils';

const getDescription = (desc: string[]) => {
  return desc.join('');
};

export const providersAdapter: IAdapter = {
  id: URL_PARAM_NAME,
  adapter: (provider: Partial<IProvider> & { id: string }): IResult => ({
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
    secondaryTags: [
      // toDownloadsStatisticsSecondaryTag(openAIREResult.usage_counts_downloads),
      // toViewsStatisticsSecondaryTag(openAIREResult.usage_counts_views),
      toKeywordsSecondaryTag(provider.tag_list ?? [], 'tag_list'),
    ],
    tags: [
      {
        label: 'Scientific domain',
        values: toValueWithLabel(toArray(provider.scientific_domains)),
        filter: 'scientific_domains',
      },
      {
        label: 'Legal status',
        values: toValueWithLabel(toArray(provider.legal_status)),
        filter: 'legal_status',
      },
      {
        label: 'Areas of activity',
        values: toValueWithLabel(toArray(provider.areas_of_activity)),
        filter: 'areas_of_activity',
      },
      {
        label: 'MERIL Scientific Categorisation',
        values: toValueWithLabel(toArray(provider.meril_scientific_domains)),
        filter: 'meril_scientific_domains',
      },
    ],
    url: provider.pid
      ? `${ConfigService.config?.marketplace_url}/providers/${provider.pid}`
      : '',
    ...parseStatistics(provider),
  }),
};
