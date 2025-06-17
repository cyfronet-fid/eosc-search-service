import { IAdapter, IResult } from '../../repositories/types';
import { IOpenAIREResult } from '../openair.model';
import { COLLECTION } from './search-metadata.data';
import { URL_PARAM_NAME } from './nav-config.data';
import {
  toArray,
  toValueWithLabel,
} from '@collections/filters-serializers/utils';
import {
  formatPublicationDate,
  parseStatistics,
} from '@collections/data/utils';
import { ConfigService } from '../../../services/config.service';

export const adaptersAdapter: IAdapter = {
  id: URL_PARAM_NAME,
  adapter: (
    openAIREResult: Partial<IOpenAIREResult> & { id: string }
  ): IResult => ({
    isResearchProduct: false,
    id: openAIREResult.id,
    exportData: openAIREResult.exportation || [],
    title: openAIREResult?.title?.join(' ') || '',
    description: openAIREResult?.description?.join(' ') || '',
    programmingLanguage: openAIREResult?.programming_language,
    license: openAIREResult?.license,
    date: formatPublicationDate(openAIREResult['publication_date']),
    url: `${
      ConfigService.config?.eosc_explore_url
    }/search/result?id=${encodeURIComponent(
      openAIREResult?.id?.split('|')?.pop() || ''
    )}`,
    coloredTags: [],
    tags: [
      {
        label: 'EOSC Node',
        values: toValueWithLabel(toArray(openAIREResult.node)),
        filter: 'node',
        showMoreThreshold: 4,
      },
      {
        label: 'Programming language',
        values: toValueWithLabel(toArray(openAIREResult.programming_language)),
        filter: 'programming_language',
        showMoreThreshold: 4,
      },
    ],
    type: {
      label: openAIREResult?.type || '',
      value: openAIREResult?.type || '',
    },
    collection: COLLECTION,
    secondaryTags: [],
    ...parseStatistics(openAIREResult),
  }),
};
