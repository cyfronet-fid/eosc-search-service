import { IAdapter, IResult } from '../../repositories/types';
import { URL_PARAM_NAME } from './nav-config.data';
import { COLLECTION } from './search-metadata.data';
import { IProvider } from './provider.model';
import { parseStatistics } from '../utils';
import {
  toArray,
  toValueWithLabel,
} from '@collections/filters-serializers/utils';
import { toKeywordsSecondaryTag } from '../utils';
import { buildProviderUrl } from '../url-builder-utils';

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
    collection: COLLECTION,
    coloredTags: [],
    secondaryTags: [
      // toDownloadsStatisticsSecondaryTag(openAIREResult.usage_counts_downloads),
      // toViewsStatisticsSecondaryTag(openAIREResult.usage_counts_views),
      toKeywordsSecondaryTag(provider.keywords ?? [], 'keywords'),
    ],
    tags: [
      {
        label: 'EOSC Node',
        values: toValueWithLabel(toArray(provider?.node)),
        filter: 'node',
        showMoreThreshold: 4,
      },
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
    url: buildProviderUrl(provider),
    logoUrl: buildProviderUrl(provider, '/logo'),
    ...parseStatistics(provider),
  }),
};
