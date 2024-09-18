import { IAdapter, IResult } from '../../repositories/types';
import { URL_PARAM_NAME } from './nav-config.data';
import { IOpenAIREResult } from '../openair.model';
import { COLLECTION } from './search-metadata.data';
import {
  toArray,
  toValueWithLabel,
} from '@collections/filters-serializers/utils';
import {
  constructIdentifierTag,
  parseStatistics,
  toInterPatternsSecondaryTag,
  toKeywordsSecondaryTag,
} from '@collections/data/utils';
import { ConfigService } from '../../../services/config.service';
import { formatPublicationDate } from '@collections/data/utils';
import { transformLanguages } from '@collections/data/shared-tags';

export const otherResourcesProductsAdapter: IAdapter = {
  id: URL_PARAM_NAME,
  adapter: (
    openAIREResult: Partial<IOpenAIREResult> & { id: string }
  ): IResult => ({
    isResearchProduct: true,
    id: openAIREResult.id,
    title: openAIREResult?.title?.join(' ') || '',
    description: openAIREResult?.description?.join(' ') || '',
    urls: openAIREResult.url,
    exportData: openAIREResult.exportation || [],
    documentType: openAIREResult?.document_type,
    languages: transformLanguages(openAIREResult?.language),
    date: formatPublicationDate(openAIREResult['publication_date']),
    license: openAIREResult?.license,
    redirectUrl: `${
      ConfigService.config?.eosc_explore_url
    }/search/result?id=${openAIREResult?.id?.split('|')?.pop()}`,
    coloredTags: [],
    tags: [
      {
        label: 'Author',
        values: toValueWithLabel(toArray(openAIREResult?.author_names)),
        filter: 'author_names',
        showMoreThreshold: 10,
      },
      {
        label: 'Scientific domain',
        values: toValueWithLabel(toArray(openAIREResult?.scientific_domains)),
        filter: 'scientific_domains',
      },
      {
        label: 'Identifier',
        values: constructIdentifierTag(openAIREResult?.pids),
        filter: 'pids',
        showMoreThreshold: 4,
      },
    ],
    type: {
      label: openAIREResult?.type || '',
      value: openAIREResult?.type || '',
    },
    collection: COLLECTION,
    secondaryTags: [
      toInterPatternsSecondaryTag(openAIREResult.eosc_if ?? [], 'eosc_if'),
      toKeywordsSecondaryTag(openAIREResult.keywords ?? [], 'keywords'),
    ],
    ...parseStatistics(openAIREResult),
  }),
};
