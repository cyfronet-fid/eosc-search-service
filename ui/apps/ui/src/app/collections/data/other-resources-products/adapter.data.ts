import { IAdapter, IResult } from '../../repositories/types';
import { URL_PARAM_NAME } from './nav-config.data';
import { IOpenAIREResult } from '../openair.model';
import { COLLECTION } from './search-metadata.data';
import {
  toArray,
  toValueWithLabel,
} from '@collections/filters-serializers/utils';
import {
  parseStatistics,
  toKeywordsSecondaryTag,
} from '@collections/data/utils';
import { ConfigService } from '../../../services/config.service';

export const otherResourcesProductsAdapter: IAdapter = {
  id: URL_PARAM_NAME,
  adapter: (
    openAIREResult: Partial<IOpenAIREResult> & { id: string }
  ): IResult => ({
    id: openAIREResult.id,
    title: openAIREResult?.title?.join(' ') || '',
    description: openAIREResult?.description?.join(' ') || '',
    url: `${
      ConfigService.config?.eosc_explore_url
    }/search/result?id=${openAIREResult?.id?.split('|')?.pop()}`,
    coloredTags: [
      {
        values: toValueWithLabel(toArray(openAIREResult?.best_access_right)),
        filter: 'best_access_right',
        colorClassName: (openAIREResult?.best_access_right || '').match(
          /open(.access)?/gi
        )
          ? 'tag-light-green'
          : 'tag-light-coral',
      },
      {
        colorClassName: 'tag-almond',
        values: toValueWithLabel(toArray(openAIREResult['license'])),
        filter: 'license',
      },
      {
        colorClassName: 'tag-peach',
        filter: 'language',
        values: toValueWithLabel(toArray(openAIREResult?.language)),
      },
    ],
    tags: [
      {
        label: 'Author names',
        values: toValueWithLabel(toArray(openAIREResult?.author_names)),
        filter: 'author_names',
      },
      {
        label: 'DOI',
        values: toValueWithLabel(toArray(openAIREResult?.doi)),
        filter: 'doi',
      },
      {
        label: 'Field of Science',
        values: toValueWithLabel(toArray(openAIREResult?.fos)),
        filter: 'fos',
      },
    ],
    type: {
      label: openAIREResult?.type || '',
      value: openAIREResult?.type || '',
    },
    collection: COLLECTION,
    secondaryTags: [
      // toDownloadsStatisticsSecondaryTag(openAIREResult.usage_counts_downloads),
      // toViewsStatisticsSecondaryTag(openAIREResult.usage_counts_views),
      toKeywordsSecondaryTag(openAIREResult.keywords ?? [], 'keywords'),
    ],
    ...parseStatistics(openAIREResult),
  }),
};
