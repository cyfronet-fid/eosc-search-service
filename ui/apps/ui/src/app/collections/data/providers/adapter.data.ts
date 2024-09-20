import { IAdapter, IResult } from '../../repositories/types';
import { URL_PARAM_NAME } from './nav-config.data';
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
    id: provider.id,
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
    redirectUrl: provider.pid
      ? `${ConfigService.config?.eu_marketplace_url}/providers/${provider.pid}`
      : '',
    logoUrl: provider.pid
      ? `${ConfigService.config?.eu_marketplace_url}/providers/${provider.pid}/logo`
      : '',
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
        label: 'Area of activity',
        values: toValueWithLabel(toArray(provider.areas_of_activity)),
        filter: 'areas_of_activity',
      },
      {
        label: 'MERIL Scientific categorisation',
        values: toValueWithLabel(toArray(provider.meril_scientific_domains)),
        filter: 'meril_scientific_domains',
      },
    ],
    ...parseStatistics(provider),
  }),
};
